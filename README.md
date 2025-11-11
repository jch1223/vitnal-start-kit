# VITNAL START KIT

## 개요

### 문제 및 목적

초기 프로젝트 세팅시 마다 시간이 오래 걸려 cli 명령어를 통해 초기 세팅이 되는 패키지를 만들어 시간을 줄이고 편리하게 사용할 수 있도록 합니다.

## 요구 사항 정리

- create 지시어를 통해 프로젝트가 세팅되도록 할 것
- 명령어를 친 후에 터미널에서 선택해서 폴더구조(fsd 등), 에디터(cursor 등), 스타일(tailwindcss, styled-components 등)
  - 에디터 옵션
    - 디폴트 값: cursor
  - 폴더 구조 옵션
    - 디폴트 값: fsd
    - feature
  - 스타일 옵션
    - 디폴트 값: tailwindcss
    - styled-components
  - taskmanager 옵션 (y/n)
    - 디폴트 값: taskmaster 설치
- 세팅 목록
  - 커서 룰
  - eslint 룰, prettier 룰, 에디터 설정
  - readme에 taskmanager 설정 방법 작성
  - Readme에 설정된 옵션 및 세팅 방법 작성
- 공통 스택: react, typescript, eslint, prettier, vitest, storybook

mvp는 fsd, cursor, tailwindcss, react, typescript 기준으로 진행
