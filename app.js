
async function start(){
const response=await fetch('./data/schools.json',{cache:'no-cache'});
if(!response.ok)throw new Error('Nie udało się pobrać danych szkół.');
const catalog=await response.json();
if(catalog.schemaVersion!==1||!Array.isArray(catalog.classes)||!catalog.schools||!catalog.thresholds)throw new Error('Nieprawidłowy format danych szkół.');
const schoolLocations=catalog.schools,data=catalog.classes,historicalScores=catalog.thresholds;
function schoolLabel(code){return schoolLocations[code].label}
function shortLabel(code){return schoolLocations[code].shortLabel}
function extraLocation(s){return s.additionalAddress?'<br><small>Druga lokalizacja: '+esc(s.additionalAddress)+'. Potwierdź miejsce zajęć.</small>':''}
let schoolMap=null, visibleSchools=[], selectedSchool=null, mapSignature=null;
const mapMarkers=new Map();
function directionsUrl(code){const s=schoolLocations[code];return 'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(s.lat+','+s.lng)}
function markerIcon(code){return L.divIcon({className:'school-pin'+(schoolLocations[code].type==='Technikum'?' technical':'')+(selectedSchool===code?' selected':''),html:'<span>'+shortLabel(code)+'</span>',iconSize:[76,36],iconAnchor:[38,18],popupAnchor:[0,-20]})}
function fitSchools(){if(!schoolMap||!visibleSchools.length)return;schoolMap.fitBounds(visibleSchools.map(code=>{const s=schoolLocations[code];return [s.lat,s.lng]}),{padding:[45,45],maxZoom:15,animate:false})}
function selectSchool(code,scroll=false){
 if(!visibleSchools.includes(code))return;
 selectedSchool=code;
 const s=schoolLocations[code];
 el('map-selection').innerHTML='<strong>'+schoolLabel(code)+'</strong> · '+s.address+extraLocation(s)+' · <a href="'+directionsUrl(code)+'" target="_blank" rel="noopener noreferrer">Wyznacz dojazd</a> · <a href="'+s.source+'" target="_blank" rel="noopener noreferrer">Kontakt szkoły</a>';
 for(const button of el('map-schools').querySelectorAll('button'))button.setAttribute('aria-pressed',String(button.dataset.school===code));
 if(schoolMap){
  for(const [id,marker] of mapMarkers)marker.setIcon(markerIcon(id));
  schoolMap.setView([s.lat,s.lng],15,{animate:false});
  mapMarkers.get(code)?.openPopup();
 }
 if(scroll){el('map-panel').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});el('school-map').focus({preventScroll:true})}
}
function updateSchoolMap(results){
 visibleSchools=[...new Set(results.map(c=>c.school))];
 el('map-count').textContent=visibleSchools.length?'Szkoły pasujące do filtrów: '+visibleSchools.length+' z '+Object.keys(schoolLocations).length+'. Kliknij znacznik, aby zobaczyć szczegóły.':'Brak szkół pasujących do filtrów.';
 el('map-fit').disabled=!visibleSchools.length;
 if(!visibleSchools.includes(selectedSchool)){
  selectedSchool=null;
  el('map-selection').textContent=visibleSchools.length?'Kliknij znacznik lub nazwę szkoły, aby zobaczyć adres i dojazd.':'Zmień filtry, aby zobaczyć szkoły na mapie.';
 }
 el('map-schools').replaceChildren();
 for(const code of visibleSchools){const b=document.createElement('button');b.type='button';b.className='map-school';b.dataset.school=code;b.textContent=schoolLabel(code);b.setAttribute('aria-pressed',String(code===selectedSchool));b.addEventListener('click',()=>selectSchool(code));el('map-schools').append(b)}
 if(!schoolMap)return;
 for(const marker of mapMarkers.values())marker.remove();
 mapMarkers.clear();
 for(const code of visibleSchools){const s=schoolLocations[code];const marker=L.marker([s.lat,s.lng],{icon:markerIcon(code),title:schoolLabel(code)+' — '+s.address,alt:schoolLabel(code),keyboard:true}).addTo(schoolMap).bindPopup('<strong>'+schoolLabel(code)+'</strong><br>'+s.address+extraLocation(s)+'<br><a href="'+directionsUrl(code)+'" target="_blank" rel="noopener noreferrer">Wyznacz dojazd</a>');marker.on('click',()=>selectSchool(code));mapMarkers.set(code,marker)}
 const signature=visibleSchools.join('|');
 if(signature!==mapSignature){mapSignature=signature;if(visibleSchools.length)fitSchools();else schoolMap.setView([51.768,19.455],12,{animate:false})}
}
function initSchoolMap(){
 try{
  schoolMap=L.map('school-map',{scrollWheelZoom:false,zoomControl:false}).setView([51.768,19.455],12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).on('tileerror',()=>{el('map-error').textContent='Nie udało się wczytać części mapy. Adresy szkół i linki do dojazdu są dostępne po wybraniu szkoły.';el('map-error').hidden=false}).addTo(schoolMap);
  L.control.zoom({zoomInTitle:'Przybliż',zoomOutTitle:'Oddal'}).addTo(schoolMap);
  updateSchoolMap(data.filter(matching));if(selectedSchool)selectSchool(selectedSchool);
 }catch{el('map-error').hidden=false}
}

const el=id=>document.getElementById(id);const state={saved:new Set(),favorites:false};try{state.saved=new Set(JSON.parse(localStorage.getItem('lodz-licea-saved')||'[]'))}catch{}

function esc(value){return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function fill(id,values){for(const v of [...new Set(values)].sort((a,b)=>a.localeCompare(b,'pl',{numeric:true}))){const o=document.createElement('option');o.value=v;o.textContent=v;el(id).append(o)}}
function fillSchools(){const previous=el('school').value;el('school').replaceChildren();const option=document.createElement('option');option.value='';option.textContent='Wszystkie szkoły';el('school').append(option);const candidates=Object.keys(schoolLocations).filter(code=>!el('type').value||schoolLocations[code].type===el('type').value);fill('school',candidates.map(schoolLabel));el('school').value=candidates.some(code=>schoolLabel(code)===previous)?previous:''}
fillSchools();fill('subject',data.flatMap(c=>c.subjects));fill('lang',data.flatMap(c=>c.languages));fill('occupation',data.map(c=>c.occupation).filter(Boolean));
function key(c){return c.id||c.school+'-'+c.code}
function save(){try{localStorage.setItem('lodz-licea-saved',JSON.stringify([...state.saved]))}catch{}}
function searchText(c){return [schoolLabel(c.school),schoolLocations[c.school].name,c.code,c.profile,c.occupation,...c.subjects,...c.languages].join(' ').toLocaleLowerCase('pl')}
function matching(c){
 const stem={Humanistyczny:'humanist',Przyrodniczy:'przyrodnicz',Biologiczny:'biolog',Matematyczny:'matematy',Językowy:'język',Integracyjny:'integracyj'}[el('profile').value];
 return (!el('type').value||c.type===el('type').value)&&(!el('school').value||schoolLabel(c.school)===el('school').value)&&(!el('subject').value||c.subjects.includes(el('subject').value))&&(!el('lang').value||c.languages.includes(el('lang').value))&&(!stem||(c.type==='Liceum'&&c.profile.toLowerCase().includes(stem)))&&(!el('occupation').value||c.occupation===el('occupation').value)&&(!state.favorites||state.saved.has(key(c)))&&searchText(c).includes(el('search').value.toLocaleLowerCase('pl').trim())
}
function renderUpdates(){
 const m=catalog.monitoring||{},sources=Object.values(m.sources||{}),errors=sources.filter(s=>s.status==='error').length;
 const date=v=>new Date(v).toLocaleString('pl-PL',{timeZone:'Europe/Warsaw'});
 el('monitor-status').textContent=m.lastRunAt?'Ostatnie sprawdzenie: '+date(m.lastRunAt)+'. Sprawdzone źródła: '+sources.filter(s=>s.status==='ok').length+' z '+Object.keys(schoolLocations).length+(errors?' · Niedostępne źródła: '+errors:'')+'.':'Codzienne sprawdzanie oficjalnych stron jest przygotowane. Pierwszy odczyt tworzy punkt odniesienia.';
 const updates=(m.updates||[]).filter(u=>visibleSchools.includes(u.school));
 el('school-updates').replaceChildren();
 if(!updates.length){el('school-updates').textContent='Brak wykrytych zmian dla wybranych szkół od rozpoczęcia monitorowania. To nie potwierdza braku nowych ofert.';return}
 for(const u of updates.slice(0,15)){
 const row=document.createElement('article');row.style.cssText='border-top:1px solid #dfe7df;padding:12px 0';
 row.innerHTML='<strong>'+esc(schoolLabel(u.school))+'</strong> · '+esc(date(u.detectedAt))+'<br><a href="'+esc(u.url)+'" target="_blank" rel="noopener noreferrer">Zmieniona treść strony szkoły — sprawdź informację</a><p>'+esc(u.excerpt||'')+'</p><small>Wymaga weryfikacji. Zmiana strony nie potwierdza nowej oferty klas.</small>';
 el('school-updates').append(row)
 }
}
function scoreMarkup(c){
 const points=historicalScores[key(c)]||[];
 if(!points.length)return '<div class="score-block score-missing"><h4>Próg 2026/2027</h4>Brak potwierdzonych danych dla tego oddziału lub wariantu.</div>';
 return '<div class="score-block"><h4>Próg przyjęcia · 2026/2027'+(points.length>1?' · osobne grupy':'')+'</h4><ul>'+points.map(p=>'<li><span class="score-value">'+p.value.toLocaleString('pl-PL',{minimumFractionDigits:1,maximumFractionDigits:1})+' pkt</span> <span class="muted">/ '+p.scale+'</span><span class="score-label">'+esc(p.label)+(p.scale===300?' · oddział dwujęzyczny, dodatkowy sprawdzian':'')+'</span><a href="'+esc(p.source)+'" target="_blank" rel="noopener noreferrer">Źródło progu · WaszaEdukacja</a></li>').join('')+'</ul></div>'
}
function render(){
 const results=data.filter(matching);updateSchoolMap(results);renderUpdates();el('count').textContent='('+results.length+' z '+data.length+')';el('favcount').textContent=state.saved.size;el('favorites').classList.toggle('active',state.favorites);el('favorites').setAttribute('aria-pressed',String(state.favorites));el('cards').replaceChildren();
 const known=results.filter(c=>(historicalScores[key(c)]||[]).length).length;
 el('coverage').textContent='Dla bieżącego wyboru — pozycje z dopasowanym progiem: '+known+'. Bez potwierdzonego progu: '+(results.length-known)+'.';
 if(!results.length){el('cards').innerHTML='<div class="empty">Brak pasujących klas. Zmień filtry lub wyłącz widok zapisanych.</div>';return}
 for(const c of results){
  const card=document.createElement('article');card.className='card';
  const pills=c.subjects.length?c.subjects.map(s=>'<span class="pill">'+esc(s)+'</span>').join(''):'<span class="muted">Do weryfikacji</span>';
  card.innerHTML=`<div class="cardtop"><span class="school">${esc(schoolLabel(c.school))}</span><span class="classcode">${esc(c.code)}</span></div><span class="type-badge ${c.type==='Technikum'?'technical':''}">${c.type}${c.type==='Technikum'?' · 5 lat':c.code==='0W'?' · rok wstępny':' · 4 lata'}</span><h3>${esc(c.profile)}</h3>${c.type==='Technikum'?'<div class="school-fullname">'+esc(schoolLocations[c.school].name)+'</div>':''}<div><div class="sub">${c.school==='T12'?'Rozszerzenie — jeden do wyboru':'Przedmioty rozszerzone'}</div><div class="pills">${pills}</div></div><div><div class="sub">Języki w ofercie</div><div class="muted">${c.languages.map(esc).join(' · ')}</div></div>${c.note?'<div class="muted">ⓘ '+esc(c.note)+'</div>':''}${scoreMarkup(c)}<div class="status"><span class="dot"></span> Oferta referencyjna ${c.year}</div><div class="location-row"><address>${esc(schoolLocations[c.school].address)}</address><button class="btn secondary" data-map-school="${c.school}">Pokaż na mapie</button></div><div class="cardfoot"><a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${esc(c.sourceLabel)}</a><button class="heart ${state.saved.has(key(c))?'on':''}" aria-label="${state.saved.has(key(c))?'Usuń z zapisanych':'Dodaj do zapisanych'}" title="Zapisz klasę">${state.saved.has(key(c))?'♥':'♡'}</button></div>`;
  card.querySelector('.heart').addEventListener('click',()=>{state.saved.has(key(c))?state.saved.delete(key(c)):state.saved.add(key(c));save();render()});card.querySelector('[data-map-school]').addEventListener('click',()=>selectSchool(c.school,true));el('cards').append(card)
 }
}
const filterIds=['type','school','subject','lang','occupation','profile','search'];
for(const id of filterIds)el(id).addEventListener(id==='search'?'input':'change',()=>{
 if(id==='type'){if(el('type').value==='Liceum')el('occupation').value='';if(el('type').value==='Technikum')el('profile').value='';fillSchools()}
 if(id==='occupation'&&el(id).value){el('type').value='Technikum';el('profile').value='';fillSchools()}
 if(id==='profile'&&el(id).value){el('type').value='Liceum';el('occupation').value='';fillSchools()}
 render()
});
el('reset').onclick=()=>{for(const id of filterIds)el(id).value='';state.favorites=false;fillSchools();render()};
el('favorites').onclick=()=>{state.favorites=!state.favorites;render()};
el('export').onclick=async()=>{
 const list=data.filter(c=>state.saved.has(key(c)));if(!list.length){alert('Najpierw zapisz interesujące klasy, klikając serduszko.');return}
 const txt=list.map(c=>{const points=historicalScores[key(c)]||[];const score=points.length?points.map(p=>p.label+': '+p.value.toLocaleString('pl-PL')+'/'+p.scale+' pkt; źródło: '+p.source).join(' | '):'brak danych';return `${schoolLabel(c.school)}, ${c.code} — ${c.profile}; rozszerzenia: ${c.subjects.join(', ')||'do weryfikacji'}; próg 2026/2027: ${score}; oferta: ${c.url}`}).join('\n');
 try{await navigator.clipboard.writeText(txt);el('export').textContent='Skopiowano ✓';setTimeout(()=>el('export').textContent='Kopiuj listę',1800)}catch{prompt('Skopiuj listę:',txt)}
};render();

el('map-fit').onclick=()=>{selectedSchool=null;updateSchoolMap(data.filter(matching));schoolMap?.closePopup();el('map-selection').textContent=visibleSchools.length?'Kliknij znacznik lub nazwę szkoły, aby zobaczyć adres i dojazd.':'Zmień filtry, aby zobaczyć szkoły na mapie.';fitSchools()};
const leafletScript=document.createElement('script');
leafletScript.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
leafletScript.onload=initSchoolMap;
leafletScript.onerror=()=>{el('map-error').hidden=false};
document.head.append(leafletScript);

}
start().catch(error=>{console.error(error);document.getElementById('cards').textContent='Nie udało się wczytać danych. Odśwież stronę lub spróbuj ponownie później.';document.getElementById('monitor-status').textContent='Dane chwilowo niedostępne.';});
