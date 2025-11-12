# <%= projectName %>

React + TypeScript + Vite 기반의 프로젝트입니다.

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

### 미리보기

```bash
npm run preview
```

## 사용된 기술 스택

- **React** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
  <% if (options.reactQuery) { -%>
- **React Query** - 서버 상태 관리
  <% } -%>
  <% if (options.stateManagement === 'jotai') { -%>
- **Jotai** - 클라이언트 상태 관리
  <% } else if (options.stateManagement === 'zustand') { -%>
- **Zustand** - 클라이언트 상태 관리
  <% } -%>
  <% if (options.taskmaster) { -%>

## Taskmaster 사용법

이 프로젝트는 Taskmaster를 사용하여 작업을 관리합니다.

### 기본 명령어

```bash
# 작업 목록 확인
task-master list

# 다음 작업 확인
task-master next

# 작업 상태 변경
task-master set-status --id=1 --status=done
```

자세한 사용법은 `taskmaster-guide.md` 파일을 참고하세요.
<% } -%>

## 스크립트

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드 결과 미리보기
- `npm run lint` - ESLint 실행
- `npm run format` - Prettier 포맷팅 확인
- `npm run format:fix` - Prettier 포맷팅 자동 수정
- `npm run test` - 테스트 실행

## 라이선스

ISC
