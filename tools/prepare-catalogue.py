"""Build a dated catalogue snapshot from verified Beatport rows and Apple's public lookup.
Run with --refresh to refresh Apple metadata. Preview audio is never downloaded.
"""
import json, pathlib, sys, urllib.request
root = pathlib.Path(__file__).resolve().parents[1]
source = root / 'tmp/apple-catalogue.json'
if '--refresh' in sys.argv:
    source.parent.mkdir(exist_ok=True)
    source.write_bytes(urllib.request.urlopen('https://itunes.apple.com/lookup?id=1512000242&entity=song&limit=200', timeout=45).read())
rows = [line.split('|') for line in (root/'tools/beatport-source.tsv').read_text(encoding='utf-8').strip().splitlines()]
art = '''653c2c09-2ed4-49bc-8805-471b7ce0e543
52109491-b37e-4742-9f70-50a0a411d2dd
22862ee6-f697-4d50-9639-5d9fe907df7e
6dfe90eb-c5ea-45b7-b156-52aad611819c
d24c7300-fa68-45e7-87f8-62d52bb2357f
689bde01-119a-4d68-85c4-ed1b43c29c11
2c1ebf72-a0ae-4e11-8c0a-7f3164ec7b7b
32f36be7-4774-4aab-8b4a-43c30140f01e
ff3a2ce9-3cac-4ff4-8346-108f397b15ca
57207642-4d70-4047-8f9e-e6014603d372
9ce53dda-390c-4987-8257-1e79899320bf
b794ac7d-abbf-4383-bbdf-4f6aab0f4988
adc8d11a-b3f4-4ca1-8ece-6927b8d3786b
85cb9c18-96f4-447f-b43b-651537234105
2ba8582e-a1b0-47dc-9f35-24b24fdef040
9a29b4a6-6f2e-414c-949f-610a28aab09b
21f3ee9b-4cbd-459b-bb7e-a5bfc4198638
5573655d-4fef-41a5-a54a-42a8977572b8'''.splitlines()
releases = [dict(title=r[0], url='https://www.beatport.com/release/'+r[1],label=r[2],date=r[3],image=('https://geo-media.beatport.com/image_size/250x250/'+art[i]+'.jpg') if i<len(art) else None) for i,r in enumerate(rows)]
tracks=[]; seen=set()
for s in sorted(json.loads(source.read_text(encoding='utf-8'))['results'],key=lambda s:s.get('releaseDate',''),reverse=True):
    if s.get('kind')!='song' or not s.get('previewUrl'): continue
    key=(s['trackName'].casefold(),s['artistName'].casefold())
    if key in seen: continue
    seen.add(key)
    tracks.append(dict(title=s['trackName'],artist=s['artistName'],album=s.get('collectionName',''),date=s.get('releaseDate','')[:10],preview=s['previewUrl'],url=s['trackViewUrl'],image=s.get('artworkUrl100'),id=s['trackId']))
data=dict(checked='2026-09-07',source='https://www.beatport.com/artist/ver-dikt/582610/releases?page=1&per_page=150',releases=releases,tracks=tracks)
(root/'src/catalogue.js').write_text('window.VA_CATALOGUE = '+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print(f'{len(releases)} Beatport releases, {len(tracks)} unique Apple previews')
