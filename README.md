# Vitnal Start Kit

> 빠르고 편리하게 React + TypeScript 프로젝트를 시작하세요

[![npm version](https://img.shields.io/npm/v/create-vitnal-start-kit.svg)](https://www.npmjs.com/package/create-vitnal-start-kit)

Vitnal Start Kit은 Vite 기반의 React + TypeScript 프로젝트를 몇 초 만에 생성할 수 있는 CLI 도구입니다. TailwindCSS, Vitest, Storybook 등이 포함된 opinionated한 기본 설정을 제공합니다.

📦 [npm 패키지](https://www.npmjs.com/package/create-vitnal-start-kit) | 🐛 [이슈 리포트](https://github.com/jch1223/vitnal-start-kit/issues)

## ✨ 주요 기능

- ⚡ **Vite 기반**: 빠른 개발 서버와 최적화된 빌드
- ⚛️ **React 19 + TypeScript**: 최신 React와 타입 안정성
- 🎨 **TailwindCSS**: 유틸리티 우선 CSS 프레임워크
- 🧪 **Vitest**: 빠르고 현대적인 테스트 프레임워크
- 📚 **Storybook**: 컴포넌트 개발 및 문서화 도구
- 🔧 **ESLint + Prettier**: 코드 품질 및 포맷팅 자동화
- 📦 **선택적 패키지**: React Query, Jotai, Zustand, Taskmaster 지원

## 🚀 빠른 시작

### 설치

```bash
npm create vitnal-start-kit@latest my-app
```

또는

```bash
npx create-vitnal-start-kit my-app
```

### 사용 방법

1. 위 명령어를 실행하면 대화형 프롬프트가 표시됩니다
2. 원하는 옵션을 선택하세요:
   - **React Query**: 서버 상태 관리
   - **상태 관리 라이브러리**: Jotai 또는 Zustand
   - **Taskmaster**: AI 기반 작업 관리 도구

3. 프로젝트가 생성되면:

```bash
cd my-app
npm install
npm run dev
```

## 📋 생성되는 프로젝트 구조

```
my-app/
├── src/
│   ├── App.tsx          # 메인 앱 컴포넌트
│   ├── main.tsx         # 진입점
│   ├── test/            # 테스트 설정
│   └── stories/         # Storybook 스토리
├── public/              # 정적 파일
├── vite.config.ts       # Vite 설정
├── tsconfig.json        # TypeScript 설정
└── package.json         # 프로젝트 메타데이터
```

## 🛠️ 사용 가능한 스크립트

생성된 프로젝트에서 사용할 수 있는 명령어:

- `npm run dev` - 개발 서버 시작
- `npm run build` - 프로덕션 빌드
- `npm run test` - 테스트 실행
- `npm run test:watch` - 테스트 감시 모드
- `npm run test:ui` - Vitest UI 실행
- `npm run lint` - 코드 린팅
- `npm run format` - 코드 포맷팅
- `npm run storybook` - Storybook 실행

## 🎯 옵션 설명

### React Query

서버 상태 관리를 위한 TanStack Query를 추가합니다. API 데이터 페칭과 캐싱을 쉽게 관리할 수 있습니다.

### 상태 관리 라이브러리

- **Jotai**: 원자 기반 상태 관리 (경량)
- **Zustand**: 간단하고 직관적인 상태 관리
- **None**: 기본 React 상태만 사용

### Taskmaster

AI 기반 작업 관리 도구를 자동으로 설치하고 초기화합니다. 프로젝트 작업을 체계적으로 관리할 수 있습니다.

## 📖 문서

- [npm 패키지](https://www.npmjs.com/package/create-vitnal-start-kit)
- [기여 가이드](./CONTRIBUTING.md)
- [이슈 리포트](https://github.com/jch1223/vitnal-start-kit/issues)

## 🤝 기여하기

기여를 환영합니다! 자세한 내용은 [CONTRIBUTING.md](./CONTRIBUTING.md)를 참고하세요.

1. 이 저장소를 포크하세요
2. 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'feat: Add amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 열어주세요

## 📝 라이선스

ISC

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들에 기반합니다:

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/)
- [Storybook](https://storybook.js.org/)
