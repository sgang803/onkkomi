# Supabase 설정 (로그인 없이 모두 공개)

이 앱은 아래 두 값을 서버에서 사용합니다.

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `SUPABASE_SERVICE_ROLE_KEY` (서비스 롤 키: 서버 API에서 업로드/조회에 사용)

## 1) Storage Bucket 생성

Supabase Storage에서 아래 버킷을 만드세요.

- Bucket ID: `share-images`
- Public read: 정책(아래 SQL 참고) 또는 설정에서 공개 읽기 허용

## 2) DB 테이블 생성

테이블 `shares` 를 생성하고, 공개 읽기 정책을 걸어주세요.

아래 SQL을 Supabase SQL Editor에 실행하세요.

## 3) SQL

```sql
-- shares 테이블
create table if not exists public.shares (
  id uuid primary key,
  nickname text not null,
  character_id text,
  image_path text not null,
  public_url text not null,
  created_at timestamptz not null default now()
);

alter table public.shares enable row level security;

-- 모두가 공유 이미지를 읽을 수 있게 함
create policy "public read shares"
on public.shares
for select
to anon
using (public_url is not null);

-- Storage: share-images 버킷의 오브젝트를 모두가 읽을 수 있게 함
alter table storage.objects enable row level security;

create policy "public read share-images"
on storage.objects
for select
to anon
using (bucket_id = 'share-images');
```

## 4) 에셋 경로 규칙(이 프로젝트 기준)

캐릭터 베이스 이미지(6명):
- `public/assets/characters/1.png` ~ `6.png`

꾸미기 아이템(25개, PNG):
- `public/assets/item/7.png` ~ `21.png` 및 `flower.png`, `green.png` 등 (파일명은 `src/game/assets.ts`의 `ITEMS`와 일치)

꾸미기 화면은 캐릭터·아이템 PNG를 원본 픽셀 비율로 표시합니다.

