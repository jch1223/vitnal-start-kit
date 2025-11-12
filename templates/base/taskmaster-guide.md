# Taskmaster 사용 가이드

프로젝트 생성 시 Taskmaster 옵션을 `예`로 선택하면 CLI가 `task-master` 패키지를 자동으로 설치하고 `task-master init --yes`를 실행해 `.taskmaster/` 디렉터리를 초기화합니다. 이후 필요에 따라 설정 파일을 수정하고 태스크를 확장하세요. 옵션을 `아니오`로 선택했다면 이 문서의 “수동 설치” 절차를 참고해 언제든지 도입할 수 있습니다.

공식 문서 튜토리얼: https://github.com/eyaltoledano/claude-task-master/blob/main/docs/tutorial.md

## 설치 및 기본 점검

자동 설치가 완료되면 추가 작업이 필요 없습니다. 수동으로 다시 설치하거나 다른 환경에 적용해야 할 때는 아래 명령을 사용하세요.

```bash
# Taskmaster CLI 설치 (전역 또는 로컬 중 택1)
npm install -g task-master-ai
# 또는 프로젝트 루트에서
npm install task-master-ai
```

자동 초기화로 생성된 설정 파일 위치:

- `.taskmaster/config.json`: 모델 프로바이더와 응답 언어 등을 프로젝트에 맞게 수정
- `.taskmaster/docs/prd.txt`: Vitnal 기본 PRD
- `.taskmaster/tasks/tasks.json`: 초기 태스크 목록

## 초기 태스크 실행 흐름

```bash
# 템플릿에서 포함된 기본 태스크 확인
task-master list --with-subtasks

# 다음에 수행할 태스크 확인
task-master next
```

## 추가 계획 생성 (선택)

새로운 요구사항이 생기면 PRD를 작성하고 파싱하여 태스크를 확장합니다.

```bash
# PRD 파일을 수정하거나 새로 작성한 뒤
task-master parse-prd .taskmaster/docs/prd.txt
```

복잡한 작업을 세분화하려면 `expand` 명령을 사용합니다.

```bash
task-master expand --all
# 또는 특정 태스크만
task-master expand --id=5 --num=3
```

## 유용한 명령어 요약

```bash
# 태스크 상태 조회
task-master list --with-subtasks

# 다음 실행할 작업 추천
task-master next

# 태스크 상태 변경 예시
task-master set-status --id=1 --status=done
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
