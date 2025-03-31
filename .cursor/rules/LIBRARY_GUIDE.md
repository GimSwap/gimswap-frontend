---
description:
globs:
alwaysApply: false
---

# Rule Name: library-guide.mdc

# Description:

# 프로젝트 라이브러리 가이드

## 핵심 라이브러리

### 리액트 기본

- React 18: 앱의 기본 프레임워크
- React DOM: 웹 DOM 렌더링

### Next.js 프레임워크

- Next.js 14: React 기반 프레임워크, 앱 라우터 사용
- next-intl: 국제화(i18n) 관리 라이브러리

### 스타일링

- TailwindCSS: 유틸리티 기반 CSS 프레임워크
- tailwind-scrollbar-hide: 스크롤바 숨김 기능

### 상태 관리

- Zustand: 간단하고 강력한 상태 관리 라이브러리
- @tanstack/react-query: 서버 상태 관리 및 데이터 페칭

### Web3 / 블록체인

- wagmi: 이더리움 React Hook 라이브러리
- viem: 타입스크립트 이더리움 RPC 클라이언트
- ethers: 이더리움 유틸리티 라이브러리
- caver-js: 클레이튼 블록체인 상호작용
- @binance/w3w-wagmi-connector-v2: 바이낸스 지갑 연결
- @walletconnect/ethereum-provider: 월렛커넥트 통합
- @web3modal/ethers: 월렛 연결 모달

### UI 컴포넌트

- react-slick: 캐러셀/슬라이더 컴포넌트
- lottie-react: Lottie 애니메이션 통합
- qrcode.react: QR 코드 생성 컴포넌트

### 유틸리티

- dayjs: 날짜 및 시간 관리
- decimal.js: 정확한 십진수 계산
- sharp: 이미지 최적화 및 처리
- change-case: 문자열 케이스 변환
- circular-json: 순환 참조가 있는 데이터 직렬화

### 분석 및 모니터링

- mixpanel-browser: Mixpanel 사용자 분석 통합

## 개발 도구

### 타입스크립트

- TypeScript 5: 정적 타입 지원

### 코드 포맷팅

- Prettier: 코드 포맷팅
- prettier-plugin-tailwindcss: Tailwind CSS 클래스 정렬

### SVG 처리

- @svgr/webpack: SVG 파일을 React 컴포넌트로 변환

## 라이브러리 사용 가이드

### 상태 관리

- 로컬 컴포넌트 상태: React의 useState 사용
- 전역 상태: Zustand 사용
- 서버 데이터: React Query 사용

### 슬라이더 컴포넌트

- 기본적인 슬라이더: react-slick 사용
- 커스텀 슬라이더: 직접 구현된 KeyVisualSlider 사용

### Web3 연결

- 지갑 연결 및 상호작용: wagmi 훅 사용
- 트랜잭션 실행 및 스마트 계약 호출: viem 또는 ethers 사용

### 국제화(i18n)

- next-intl 사용하여 다국어 지원
- 경로 기반 로케일([locales]) 사용

### 이미지 최적화

- Next.js Image 컴포넌트 사용
- sharp를 통한 이미지 최적화 지원

## 모범 사례

### 성능 최적화

- React.memo()로 불필요한 리렌더링 방지
- React Query의 캐싱 기능 활용
- Next.js의 이미지 최적화 활용
- 컴포넌트 레이지 로딩 활용

### 안정적인 Web3 통합

- 오류 처리 및 폴백 UI 제공
- 지갑 연결 상태 지속성 유지
- 트랜잭션 상태 관리 및 피드백 제공

### UI/UX 고려사항

- 슬라이더에 접근성 속성 추가
- 모바일 및 데스크탑 환경 모두 최적화
- 다크 모드 지원 (Tailwind 클래스 활용)

이러한 접근 방식을 사용하면 커서가 프로젝트의 라이브러리 가이드를 적극 활용하여 일관되고 최적화된 코드를 제안할 가능성이 높아집니다.
