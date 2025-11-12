# taskmaster 설정 방법

공식 문서 튜토리얼: https://github.com/eyaltoledano/claude-task-master/blob/main/docs/tutorial.md

## 설치 및 설정

설치:

```bash
# 글로벌 설치
npm install -g task-master-ai

# 프로젝트 내부 설치
npm install task-master-ai
```

초기화:

```bash
npx task-master init
```

설정:
.env 파일 또는 .cursor/mcp.json 파일에 사용할 모델의 api key를 입력

## 계획 생성

요구 사항 생성 후 ai를 통해 `.taskmaster/templates/example_prd.txt`을 참고 하여 `.taskmaster/docs/prd.txt` 파일을 생성해달라고 요청

생성된 계획 확인 후

```bash
task-master parse-prd .taskmaster/docs/prd.txt
```

## 복잡한 작업 분해(선택사항)

```bash
task-master expand --all

#또는

task-master expand --id=5 --num=3
```

## 명령어

```bash
# 계획 목록 조회
task-master list --with-subtasks

# 계획 실행
task-master next
```

## 모델 설정 방법

모델 설정:

```bash
task-master models --setup
```

현재 모델 확인:

```bash
task-master models
```
