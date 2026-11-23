import copy
import importlib.util
from pathlib import Path
import unittest
spec=importlib.util.spec_from_file_location('monitor',Path(__file__).parents[1]/'scripts/check_schools.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class MonitorTests(unittest.TestCase):
 def page(self, extra=''):
  return '<main><h1>Rekrutacja 2027/2028</h1><p>Oferta klas oraz profile dostępne dla nowych uczniów. W szkole są organizowane zajęcia i spotkania dla kandydatów. Sprawdź szczegóły i regulamin w sekretariacie.</p>'+extra+'</main>'
 def test_scripts_navigation_and_counters_do_not_create_updates(self):
  a=m.extract(self.page()+'<footer>Odwiedziny: 15</footer><script>var x=1</script>','https://school.example/')
  b=m.extract(self.page()+'<footer>Odwiedziny: 99</footer><script>var x=2</script>','https://school.example/')
  self.assertEqual(a['fingerprint'],b['fingerprint'])
 def test_new_offer_link_changes_fingerprint(self):
  a=m.extract(self.page(), 'https://school.example/')
  b=m.extract(self.page('<a href="/2027.pdf">Oferta klas 2027/2028</a>'),'https://school.example/')
  self.assertNotEqual(a['fingerprint'],b['fingerprint']);self.assertIn(['Oferta klas 2027/2028','https://school.example/2027.pdf'],b['links'])
 def test_baseline_changes_errors_and_catalog_preservation(self):
  c={'classes':[{'profile':'Reviewed'}],'thresholds':{'known':125},'monitoring':{'sources':{},'updates':[]}}
  original=copy.deepcopy(c)
  r={'status':'ok','url':'https://school.example/',**m.extract(self.page(),'https://school.example/')}
  self.assertEqual(m.reconcile(c,[('S',r)],'2026-11-23T06:00:00+00:00'),(0,0))
  self.assertEqual(m.reconcile(c,[('S',r)],'2026-11-24T06:00:00+00:00'),(0,0))
  m.reconcile(c,[('S',{'status':'error','url':r['url'],'error':'403'})],'2026-11-25T06:00:00+00:00')
  self.assertEqual(m.reconcile(c,[('S',r)],'2026-11-26T06:00:00+00:00'),(0,0))
  r2={**r,**m.extract(self.page('<p>Nowy kierunek: technik programista 2027/2028</p>'),r['url'])}
  self.assertEqual(m.reconcile(c,[('S',r2)],'2026-11-27T06:00:00+00:00'),(1,0))
  self.assertEqual(c['monitoring']['updates'][0]['status'],'needs_review')
  self.assertEqual(c['classes'],original['classes']);self.assertEqual(c['thresholds'],original['thresholds'])
 def test_challenge_not_treated_as_school_update(self):
  with self.assertRaises(ValueError):m.extract('Please verify you are human captcha'*20,'https://school.example/')
 def test_school_without_website_does_not_stop_other_checks(self):
  code,result=m.fetch_source(('NEW',{'monitorUrl':None}))
  self.assertEqual(code,'NEW');self.assertEqual(result['status'],'not_configured')
  c={'classes':[],'thresholds':{}}
  self.assertEqual(m.reconcile(c,[(code,result)],'2026-11-23T06:00:00+00:00'),(0,1))
  self.assertEqual(c['monitoring']['sources']['NEW']['status'],'not_configured')
 def test_page_content_inside_server_form_is_readable(self):
  result=m.extract('<form id="aspnetForm">'+self.page()+'</form>','https://school.example/')
  self.assertTrue(result['lines'])
 def test_new_extractor_establishes_baseline_without_fake_news(self):
  c={'monitoring':{'sources':{'S':{'status':'ok','url':'https://school.example/','fingerprint':'old','extractorVersion':1}},'updates':[]}}
  r={'status':'ok','url':'https://school.example/',**m.extract(self.page(),'https://school.example/')}
  self.assertEqual(m.reconcile(c,[('S',r)],'2026-11-23T06:00:00+00:00'),(0,0))
  self.assertEqual(c['monitoring']['updates'],[])
if __name__=='__main__':unittest.main()
