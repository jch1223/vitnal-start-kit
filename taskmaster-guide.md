# taskmaster 설정 방법

공식 문서 튜토리얼: https://github.com/eyaltoledano/claude-task-master/blob/main/docs/tutorial.md

## 설치 및 설정

```bash
npx task-master init
```

.env 파일 또는 .cursor/mcp.json 파일에 사용할 모델의 api key를 입력

## 계획 생성

요구 사항 생성 후 ai를 통해 `.taskmaster/templates/example_prd.txt`을 참고 하여 `.taskmaster/docs/prd.txt` 파일을 생성해달라고 요청

생성된 계획 확인 후

```bash
task-master parse-prd .taskmaster/docs/prd.txt
```

## 복작한 작업 분해(선택사항)

```bash
task-master expand --id=5 --num=3

//또는

task-master expand --all
```

## 명령어

```bash
// 계획 목록 조회
task-master list --with-subtasks

// 계획 실행
task-master next
```
