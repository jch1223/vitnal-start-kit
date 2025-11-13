### CommonJS 선택 이유

- **Node CLI 호환성**: npm 생태계에서 배포되는 대부분의 CLI가 여전히 CommonJS(CommonJS)를 기본으로 사용합니다. `#!/usr/bin/env node`로 실행되는 스크립트가 어떤 환경에서도 바로 동작하도록 하기 위함입니다.
- **의존성 호환**: Commander, ESLint, Prettier 등과 연동할 때 CommonJS가 초기 설정이 단순하며, 번들러 없이도 작업을 진행할 수 있습니다.
- **점진적 확장성**: 나중에 Bun · Deno 같은 ESM-only 환경이 필요해지면 tsconfig와 package.json만 조정하여 전환할 수 있도록 구조를 단순하게 유지했습니다. 현재는 CLI를 빠르게 완성하는 것이 우선입니다.
- **패키지 배포 편의성**: npm 배포 시 CommonJS 구조가 기본값이라 추가 번들링 없이 `dist/cli.js`를 그대로 배포할 수 있습니다.
- **서드파티 도구 호환**: Taskmaster, ESLint, Vitest 등 다른 개발 도구들도 아직 CommonJS 기반 설정 예제가 풍부해서 참고하기 쉽습니다.

### e2e 테스트 Node.js 사용

- E2E 테스트는 Node.js와 `execa`를 사용하여 작성됨
- `tsx`를 통해 TypeScript 파일을 직접 실행
- `child_process.spawn`을 사용하여 프로세스 실행 및 스트림 처리
