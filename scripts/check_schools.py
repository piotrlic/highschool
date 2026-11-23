"""Monitor official admission pages; observations never overwrite reviewed offers/scores."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

WORDS = re.compile(r'2027|2028|rekrut|ofert|profil|kierunk|oddzia|klas|dni otwart|dzień otwart|prog[ió]|punkt|admission|recruit|open day|curriculum', re.I)
SKIP = {'script', 'style', 'nav', 'header', 'footer', 'noscript', 'svg'}
BLOCK = {'p', 'div', 'li', 'h1', 'h2', 'h3', 'h4', 'tr', 'br', 'section', 'article'}
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}

class RelevantText(HTMLParser):
    def __init__(self, url):
        super().__init__(convert_charrefs=True)
        self.url, self.stack, self.parts, self.links = url, [], [], []
        self.anchor = None
    def handle_starttag(self, tag, attrs):
        blocked = (self.stack[-1][1] if self.stack else False) or tag in SKIP
        if tag not in VOID:
            self.stack.append((tag, blocked))
        if blocked:
            return
        if tag in BLOCK:
            self.parts.append('\n')
        if tag == 'a':
            self.anchor = [dict(attrs).get('href', ''), []]
    def handle_endtag(self, tag):
        blocked = self.stack[-1][1] if self.stack else False
        if tag == 'a' and self.anchor and not blocked:
            href, text = self.anchor
            label = ' '.join(' '.join(text).split())
            url = urljoin(self.url, href)
            if WORDS.search(label) and urlparse(url).scheme in ('http', 'https'):
                self.links.append((label[:300], url.split('#')[0]))
            self.anchor = None
        if tag in BLOCK and not blocked:
            self.parts.append('\n')
        for i in range(len(self.stack)-1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break
    def handle_data(self, text):
        if self.stack and self.stack[-1][1]:
            return
        self.parts.append(text)
        if self.anchor:
            self.anchor[1].append(text)

def extract(html, url):
    p = RelevantText(url)
    p.feed(html)
    text = '\n'.join(' '.join(line.split()) for line in ''.join(p.parts).splitlines())
    if len(text.strip()) < 150 or re.search(r'captcha|verify you are human|just a moment|access denied', text, re.I):
        raise ValueError('Strona blokująca odczyt lub zbyt mało treści')
    lines = sorted(set(line for line in text.splitlines() if WORDS.search(line)))
    if not lines:
        raise ValueError('Brak czytelnej treści o ofercie/rekrutacji')
    links = sorted(set(p.links))
    # Only relevant text/links, excluding counters, layout, scripts and navigation.
    fingerprint = hashlib.sha256(json.dumps([lines, links], ensure_ascii=False).encode()).hexdigest()
    return {'extractorVersion': 2, 'fingerprint': fingerprint, 'lines': lines[:300], 'links': [list(v) for v in links[:100]]}

def fetch_source(item):
    code, school = item
    url = school.get('monitorUrl')
    if not url:
        return code, {'status': 'not_configured', 'url': None, 'error': 'Brak zweryfikowanej oficjalnej strony szkoły do monitorowania'}
    try:
        if urlparse(url).scheme != 'https':
            raise ValueError('Wymagany adres HTTPS')
        req = Request(url, headers={'User-Agent': 'HighschoolMonitor/1.0 (+https://github.com/piotrlic/highschool)', 'Accept': 'text/html'})
        with urlopen(req, timeout=25) as response:
            if 'html' not in response.headers.get('Content-Type', '').lower():
                raise ValueError('Źródło nie jest stroną HTML')
            raw = response.read(2_000_001)
            if len(raw) > 2_000_000:
                raise ValueError('Strona przekracza limit odczytu')
            html = raw.decode(response.headers.get_content_charset() or 'utf-8', errors='replace')
            result = extract(html, response.url)
        return code, {'status': 'ok', 'url': url, **result}
    except Exception as error:
        return code, {'status': 'error', 'url': url, 'error': str(error)[:300]}

def reconcile(catalog, results, now):
    m = catalog.setdefault('monitoring', {'sources': {}, 'updates': []})
    sources = m.setdefault('sources', {})
    updates = m.setdefault('updates', [])
    changed = errors = 0
    for code, result in results:
        old = sources.get(code, {})
        if result['status'] != 'ok':
            errors += 1
            sources[code] = {**old, **result, 'checkedAt': now}
            continue
        # Establish baseline on first read or URL change; preserve baseline across failed reads.
        baseline = old.get('fingerprint') if old.get('url') == result['url'] and old.get('extractorVersion', 1) == result.get('extractorVersion', 1) else None
        different = baseline and baseline != result['fingerprint']
        if different:
            changed += 1
            additions = [line for line in result['lines'] if line not in old.get('lines', [])]
            relevant = sorted(additions, key=lambda line: ('2027' not in line and '2028' not in line, len(line)))
            excerpt = ' '.join(relevant)[:600] or 'Usunięto lub zmieniono fragmenty informacji o rekrutacji albo odnośniki do oferty.'
            updates.append({'id': code+'-'+now, 'school': code, 'detectedAt': now, 'url': result['url'], 'excerpt': excerpt, 'status': 'needs_review'})
        sources[code] = {**result, 'checkedAt': now, 'baselineAt': old.get('baselineAt', now), 'lastChangedAt': now if different else old.get('lastChangedAt')}
    m['lastRunAt'] = now
    m['updates'] = sorted(updates, key=lambda u: u['detectedAt'], reverse=True)[:100]
    return changed, errors

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--data', type=Path, default=Path('data/schools.json'))
    args = parser.parse_args()
    catalog = json.loads(args.data.read_text())
    if catalog.get('schemaVersion') != 1:
        raise ValueError('Nieobsługiwana wersja danych')
    now = datetime.now(timezone.utc).isoformat(timespec='seconds')
    with ThreadPoolExecutor(max_workers=3) as pool:
        results = list(pool.map(fetch_source, catalog['schools'].items()))
    changed, errors = reconcile(catalog, results, now)
    temp = args.data.with_suffix('.tmp')
    temp.write_text(json.dumps(catalog, ensure_ascii=False, indent=2)+'\n')
    temp.replace(args.data)
    print(f'Sources: {len(results)}; OK: {len(results)-errors}; errors: {errors}; changed: {changed}')
    for code, r in results:
        if r['status'] != 'ok':
            print(f'{code}: {r["error"]}')
    # Persist partial failures, but report complete outage as a failed run.
    return 1 if errors == len(results) else 0

if __name__ == '__main__':
    raise SystemExit(main())

