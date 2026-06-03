# Wedding Card 💌

내 모바일 청첩장 프로젝트

## 기술 스택

- React 18 + TypeScript
- Vite (빌드)
- Tailwind CSS (스타일)
- Framer Motion (애니메이션)
- React Router (라우팅)
- Supabase (방명록/RSVP)
- Cloudinary (사진 업로드)

## 페이지 구조

```
/              청첩장 (하객용)
/edit/login    편집 비밀번호 입력
/edit          편집 화면 (인증 후)
```

## 테마 (5종)

- **엘레강트** - 고급스럽고 우아한 (베이지 + 다크브라운)
- **미니멀** - 깔끔하고 모던한 (화이트 + 블랙)
- **플라워** - 로맨틱한 꽃 테마 (로즈 핑크)
- **다크** - 세련되고 시크한 (블랙 + 골드)
- **내추럴** - 자연스럽고 편안한 (세이지 그린)

## 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 외부 서비스 가입 (무료)

- **Supabase** (https://supabase.com) - DB
- **Cloudinary** (https://cloudinary.com) - 사진 호스팅

### 3. 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일 편집:

```env
VITE_EDIT_PASSWORD=비밀번호
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=...
VITE_CLOUDINARY_CLOUD_NAME=...
VITE_CLOUDINARY_UPLOAD_PRESET=wedding_card
```

### 4. Supabase 설정

`wedding_schema.sql` 파일을 Supabase SQL Editor에서 실행

### 5. Cloudinary 설정

1. Dashboard → Settings → Upload
2. Upload presets → Add upload preset
3. Signing Mode: **Unsigned** 선택
4. Preset name 복사해서 .env에 추가

### 6. 개발 서버 실행

```bash
pnpm dev
```

## 디렉토리 구조

```
src/
├── pages/
│   ├── Invitation.tsx      청첩장 페이지
│   ├── EditLogin.tsx       비밀번호 입력
│   └── Edit.tsx            편집 화면
│
├── components/
│   ├── ImageUploader.tsx       단일 사진 업로드
│   ├── MultiImageUploader.tsx  다중 사진 업로드
│   └── sections/               청첩장 섹션 11개
│       ├── Intro.tsx
│       ├── Greeting.tsx
│       ├── Calendar.tsx
│       ├── Gallery.tsx
│       ├── Location.tsx
│       ├── Transport.tsx
│       ├── Account.tsx
│       ├── Flower.tsx
│       ├── Guestbook.tsx
│       ├── RSVP.tsx
│       └── Share.tsx
│
├── themes/
│   ├── index.ts                테마 정의 (5종)
│   └── ThemeProvider.tsx       CSS 변수 주입
│
├── lib/
│   ├── date.ts                 날짜 유틸
│   ├── supabase.ts             Supabase 클라이언트
│   └── cloudinary.ts           Cloudinary 업로드
│
├── data/
│   └── wedding.ts              기본 데이터 + localStorage
│
└── types/
    └── index.ts                타입 정의
```

## 사용 흐름

1. `/edit/login`에서 비밀번호 입력
2. `/edit`에서 청첩장 편집
   - **기본정보**: 신랑신부, 예식 정보
   - **테마**: 5종 중 선택
   - **컨텐츠**: 사진 업로드, 인사말, 계좌번호 등
3. **저장** → localStorage에 저장
4. **미리보기** → `/`에서 실제 청첩장 확인

## 배포

Vercel 추천:

```bash
pnpm build
```

도메인 연결 후 환경변수 설정하면 끝!

## TODO

- [ ] 카카오맵 SDK 연동
- [ ] 카카오톡 공유 SDK 연동
- [ ] 캘린더 등록 (구글/애플/네이버)
- [ ] BGM 재생 컨트롤
