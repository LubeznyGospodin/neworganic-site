"""Заливает тяжёлые файлы сайта в Selectel S3 (бакет packman, папка neworganic/).
Страницы, стили и шрифты живут на packman-prod.ru, а видео, кадры леса и фото идут с S3: у сервера узкий канал.
Грузит только изменившиеся файлы (сверка по md5 = ETag). Ключи берёт из окружения SELECTEL_S3_KEY / SELECTEL_S3_SECRET.

    python s3sync.py          # залить изменения
    python s3sync.py --cors   # один раз: разрешить сайту читать файлы через fetch
"""
import hashlib, mimetypes, os, sys
import boto3

BUCKET, PREFIX = 'packman', 'neworganic/'
DIRS = ['media/hero', 'media/forest', 'img/shot2', 'img/scene', 'img/founder.webp']
ORIGINS = ['https://packman-prod.ru', 'https://lubeznygospodin.github.io', 'http://localhost:5190']

os.chdir(os.path.dirname(os.path.abspath(__file__)))
s3 = boto3.client('s3', endpoint_url='https://s3.ru-7.storage.selcloud.ru', region_name='ru-7',
                  aws_access_key_id=os.environ['SELECTEL_S3_KEY'], aws_secret_access_key=os.environ['SELECTEL_S3_SECRET'])

if '--cors' in sys.argv:
    s3.put_bucket_cors(Bucket=BUCKET, CORSConfiguration={'CORSRules': [
        {'AllowedOrigins': ORIGINS, 'AllowedMethods': ['GET', 'HEAD'], 'AllowedHeaders': ['*'], 'MaxAgeSeconds': 86400}]})
    print('cors ok')
    sys.exit()

remote = {}
for page in s3.get_paginator('list_objects_v2').paginate(Bucket=BUCKET, Prefix=PREFIX):
    for o in page.get('Contents', []):
        remote[o['Key']] = o['ETag'].strip('"')

files = []
for d in DIRS:
    if os.path.isfile(d): files.append(d); continue
    for root, _, names in os.walk(d):
        files += [os.path.join(root, n) for n in names if not n.startswith('.')]

sent = 0
for f in sorted(files):
    key = PREFIX + f
    md5 = hashlib.md5(open(f, 'rb').read()).hexdigest()
    if remote.get(key) == md5: continue
    ctype = mimetypes.guess_type(f)[0] or ('image/webp' if f.endswith('.webp') else 'application/octet-stream')
    s3.upload_file(f, BUCKET, key, ExtraArgs={'ContentType': ctype, 'CacheControl': 'public, max-age=604800'})
    sent += 1
print(f's3: {len(files)} файлов, залито {sent}')
