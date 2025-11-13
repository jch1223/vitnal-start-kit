# 기여 가이드 (Contributing Guide)

Vitnal Start Kit에 기여해주셔서 감사합니다! 이 문서는 프로젝트에 기여하는 방법을 안내합니다.

## 🚀 시작하기

### 개발 환경 설정

1. 저장소를 클론하세요:
```bash
git clone https://github.com/jch1223/vitnal-start-kit.git
cd vitnal-start-kit
```

2. 의존성을 설치하세요:
```bash
npm install
```

3. 프로젝트를 빌드하세요:
```bash
npm run build
```

### 개발 워크플로우

1. **브랜치 생성**: 새로운 기능이나 버그 수정을 위한 브랜치를 생성하세요
   ```bash
   git checkout -b feature/your-feature-name
   # 또는
   git checkout -b fix/your-bug-fix
   ```

2. **변경사항 작성**: 코드를 작성하고 테스트하세요

3. **코드 품질 확인**:
   ```bash
   npm run lint        # 린팅 확인
   npm run format      # 포맷팅 확인
   npm run test        # 유닛 테스트 실행
   npm run test:e2e    # E2E 테스트 실행
   ```

4. **커밋**: [Conventional Commits](https://www.conventionalcommits.org/) 형식을 따르세요
   ```bash
   git commit -m "feat: Add new feature"
   git commit -m "fix: Fix bug in template copying"
   git commit -m "docs: Update README"
   ```

5. **푸시 및 PR 생성**: 브랜치를 푸시하고 Pull Request를 생성하세요

## 📝 커밋 메시지 규칙

[Conventional Commits](https://www.conventionalcommits.org/) 형식을 따릅니다:

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅, 세미콜론 누락 등 (코드 변경 없음)
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가 또는 수정
- `chore`: 빌드 프로세스 또는 보조 도구 변경

예시:
```
feat(scaffold): Add support for custom template directory
fix(filesystem): Handle edge case in directory copying
docs(readme): Update installation instructions
```

## 🧪 테스트

### 유닛 테스트

```bash
npm run test          # 테스트 실행
npm run test:watch    # 감시 모드
npm run test:ui       # UI 모드
npm run test:coverage # 커버리지 리포트
```

### E2E 테스트

```bash
npm run test:e2e
```

E2E 테스트는 실제로 프로젝트를 생성하고 빌드/테스트를 실행합니다.

## 🏗️ 프로젝트 구조

```
vitnal-start-kit/
├── src/              # 소스 코드
│   ├── cli.ts       # CLI 진입점
│   └── lib/         # 핵심 로직
├── templates/        # 프로젝트 템플릿
│   └── base/        # 기본 템플릿
├── scripts/         # 유틸리티 스크립트
│   └── e2e/         # E2E 테스트
└── dist/            # 빌드 산출물
```

## 🔍 코드 스타일

- **TypeScript**: 엄격한 타입 체크 사용
- **ESLint**: 코드 품질 검사
- **Prettier**: 코드 포맷팅
- **명명 규칙**: 
  - 파일: kebab-case 또는 PascalCase (컴포넌트)
  - 함수/변수: camelCase
  - 상수: UPPER_SNAKE_CASE

## 🐛 버그 리포트

버그를 발견하셨나요? [이슈를 생성](https://github.com/jch1223/vitnal-start-kit/issues)해주세요.

버그 리포트에는 다음 정보를 포함해주세요:

- 버그 설명
- 재현 단계
- 예상 동작
- 실제 동작
- 환경 정보 (Node.js 버전, OS 등)

## 💡 기능 제안

새로운 기능을 제안하고 싶으신가요? [이슈를 생성](https://github.com/jch1223/vitnal-start-kit/issues)하고 `enhancement` 레이블을 추가해주세요.

기능 제안에는 다음을 포함해주세요:

- 기능 설명
- 사용 사례
- 예상되는 이점

## 📦 배포 프로세스

배포는 GitHub Actions를 통해 자동화되어 있습니다:

1. 버전 태그 생성: `git tag v1.0.0`
2. 태그 푸시: `git push origin v1.0.0`
3. GitHub Actions가 자동으로 테스트, 빌드, 배포를 실행합니다

## ❓ 질문이 있으신가요?

질문이나 제안사항이 있으시면 [이슈를 생성](https://github.com/jch1223/vitnal-start-kit/issues)해주세요.

감사합니다! 🎉

