# 작업 규칙 (Workflow)

## 코드 편집 시 (중요)
코드를 편집하면 **항상** 다음 순서를 지킨다:
1. 변경 사항 적용 후 `npx tsc --noEmit`로 타입 체크
2. **로컬 dev 서버를 실행/유지**해서 사용자가 오른쪽 미리보기 패널(`http://localhost:5173`)에서
   변경점을 직접 보게 한다. (스크린샷을 찍어 보여주는 게 아님 — 사용자가 패널에서 확인)
3. 사용자가 확인하면 그때 커밋 & 푸시한다

> 화면 확인 없이 바로 푸시하지 않는다.

## 프로젝트 개요
- Vite + React + TypeScript 모바일 청첩장
- 배포: Vercel (GitHub `parksunglasses/wedding-card` 푸시 시 자동 배포)
  - 라이브: https://wedding-card-eosin-two.vercel.app
- 데이터: Supabase `wedding_data` 테이블 (id=1, jsonb `data` 컬럼에 전체 저장)
  - **DB 값이 코드 기본값(`defaultWeddingData`)보다 우선**됨. 화면에 반영하려면 DB도 함께 갱신해야 함.
- 이미지/오디오: Cloudinary (cloud `dgpszvzrb`, unsigned preset `wedding_card`)
- 공유/지도: 카카오 JS SDK (`src/lib/kakao.ts`), 키는 공개 키라 기본값으로 코드에 포함
- 패키지 매니저: pnpm

## 주의
- `.env`는 git 미포함 → 배포에는 반영 안 됨. 배포용 값은 코드 기본값 또는 Vercel 환경변수로.
- 카카오 공유 카드 버튼 링크는 **등록된 도메인**이어야 표시됨 (외부 도메인은 우리 도메인 경유 리디렉트로 처리: `?to=map`).
