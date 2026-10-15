from bs4 import BeautifulSoup
from pathlib import Path
import re, json

IGNORE = {'LAVÉRA','☰','☾','EN','AR','•','%','×','✓','—','...','↗','01','02','03','0','A','L','S','M','XL','−'}
DYNAMIC = {'Silk Élan Set','Maison Lace Set','Soft Muse Set','Soft Muse Set','1,299 EGP','1,149 EGP','999 EGP','+20 100 000 0000 ↗','hello@lavera.example ↗','@lavera.eg','★★★★★ — 5','★★★★☆ — 4','★★★☆☆ — 3','★★☆☆☆ — 2','★☆☆☆☆ — 1'}

report={'pages':{},'missing':[],'summary':{}}
for p in sorted(Path('.').rglob('*.html')):
    soup=BeautifulSoup(p.read_text(encoding='utf-8',errors='ignore'),'html.parser')
    missing=[]
    for e in soup.find_all(['span','a','p','h1','h2','h3','h4','h5','h6','button','label','small','strong','b','option','summary','li']):
        if e.find_parent(['script','style','template']) or e.has_attr('data-i18n-ignore'): continue
        if e.has_attr('data-ar') and e.has_attr('data-en'): continue
        if e.find(['span','b','strong','i','svg','input','button','select','textarea']): continue
        text=' '.join(e.get_text(' ',strip=True).split())
        if not text or len(text)>160 or text in IGNORE or text in DYNAMIC: continue
        if re.fullmatch(r'[0-9,.+@★☆\s\-/:A-Za-z_]+',text):
            # Pure data/branding is not UI copy.
            continue
        missing.append(text)
    report['pages'][str(p)]=missing
    report['missing'] += [(str(p),x) for x in missing]
report['summary']={'html_pages':len(report['pages']),'missing_translations':len(report['missing'])}
Path('tests/i18n-audit-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(report['summary'],ensure_ascii=False))
for f,x in report['missing']: print(f, '::', x)
raise SystemExit(1 if report['missing'] else 0)
