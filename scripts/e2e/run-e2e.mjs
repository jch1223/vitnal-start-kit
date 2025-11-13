#!/usr/bin/env node

import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const TEST_PROJECT_NAME = 'vitnal-e2e-test';
const TEST_PROJECT_DIR = path.join(PROJECT_ROOT, TEST_PROJECT_NAME);

/**
 * 필수 파일 및 디렉터리 목록
 */
const REQUIRED_FILES = [
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'src',
  'src/main.tsx',
  'src/App.tsx',
  'index.html',
];

/**
 * 임시 프로젝트 디렉터리를 정리합니다.
 */
const cleanup = async () => {
  if (await fs.pathExists(TEST_PROJECT_DIR)) {
    await fs.remove(TEST_PROJECT_DIR);
    console.log(`✓ 임시 프로젝트 디렉터리 삭제 완료: ${TEST_PROJECT_DIR}`);
  }
};

/**
 * 생성된 프로젝트의 파일 구조를 검증합니다.
 */
const validateProjectStructure = async () => {
  console.log('📋 생성된 프로젝트 파일 구조 검증 중...');

  const missingFiles = [];

  for (const file of REQUIRED_FILES) {
    const filePath = path.join(TEST_PROJECT_DIR, file);
    if (!(await fs.pathExists(filePath))) {
      missingFiles.push(file);
    }
  }

  if (missingFiles.length > 0) {
    throw new Error(`필수 파일이 누락되었습니다: ${missingFiles.join(', ')}`);
  }

  console.log('✓ 파일 구조 검증 완료\n');
};

/**
 * create-vitnal-start-kit 명령을 실행하고 프롬프트에 자동으로 응답합니다.
 */
const runCreateCommand = async () => {
  console.log('🔨 프로젝트 생성 중...\n');

  // Bun 사용으로 더 빠른 실행 (Node.js 대비 2-3배 빠름)
  // --bun 플래그로 Bun 런타임 강제 사용 (Node.js 호환 모드 비활성화)
  const cliProcess = execa('bun', ['--bun', 'dist/cli.js', TEST_PROJECT_NAME], {
    cwd: PROJECT_ROOT,
    stdio: ['pipe', 'inherit', 'inherit'], // stdout/stderr는 실시간 출력하여 ora 스피너 표시
  });

  // 프롬프트에 엔터 키를 보내 기본값으로 응답
  // 프롬프트 순서: React Query (기본: true), State Management (기본: None), Taskmaster (기본: true)
  const sendEnter = () => {
    if (!cliProcess.stdin.destroyed) {
      cliProcess.stdin.write('\n');
    }
  };

  // 각 프롬프트에 대해 엔터 키 전송 (더 긴 간격으로)
  setTimeout(sendEnter, 1000);
  setTimeout(sendEnter, 2000);
  setTimeout(sendEnter, 3000);
  setTimeout(() => {
    if (!cliProcess.stdin.destroyed) {
      cliProcess.stdin.end();
    }
  }, 4000);

  const cliResult = await cliProcess;

  if (cliResult.exitCode !== 0) {
    throw new Error(`프로젝트 생성 실패 (exit code: ${cliResult.exitCode})`);
  }

  console.log('\n✓ 프로젝트 생성 완료\n');
};

/**
 * 생성된 프로젝트에서 npm 명령어를 실행합니다.
 */
const runNpmCommands = async () => {
  console.log('📦 npm install 실행 중...');
  const installResult = await execa('npm', ['install'], {
    cwd: TEST_PROJECT_DIR,
    stdio: 'inherit',
  });

  if (installResult.exitCode !== 0) {
    throw new Error('npm install 실패');
  }
  console.log('✓ npm install 완료\n');

  // Playwright 브라우저 설치 (Storybook 테스트에 필요)
  console.log('🌐 Playwright 브라우저 설치 중...');
  const playwrightInstallResult = await execa('npx', ['playwright', 'install', 'chromium'], {
    cwd: TEST_PROJECT_DIR,
    stdio: 'inherit',
  });

  if (playwrightInstallResult.exitCode !== 0) {
    throw new Error('Playwright 브라우저 설치 실패');
  }
  console.log('✓ Playwright 브라우저 설치 완료\n');

  console.log('🔨 npm run build 실행 중...');
  const buildResult = await execa('npm', ['run', 'build'], {
    cwd: TEST_PROJECT_DIR,
    stdio: 'inherit',
  });

  if (buildResult.exitCode !== 0) {
    throw new Error('npm run build 실패');
  }
  console.log('✓ npm run build 완료\n');

  console.log('🧪 npm run test 실행 중...');
  const testResult = await execa('npm', ['run', 'test'], {
    cwd: TEST_PROJECT_DIR,
    stdio: 'inherit',
  });

  if (testResult.exitCode !== 0) {
    throw new Error('npm run test 실패');
  }
  console.log('✓ npm run test 완료\n');
};

/**
 * E2E 테스트를 실행합니다.
 */
const runE2ETest = async () => {
  console.log('🚀 E2E 테스트 시작...\n');

  // E2E 테스트 환경임을 표시 (taskmaster init이 비대화형 모드로 실행되도록)
  process.env.E2E_TEST = 'true';

  try {
    // 1. 기존 테스트 프로젝트 디렉터리 정리
    await cleanup();

    // 2. CLI 빌드 확인
    console.log('📦 CLI 빌드 확인 중...');
    const buildResult = await execa('npm', ['run', 'build'], {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
    });

    if (buildResult.exitCode !== 0) {
      throw new Error('CLI 빌드 실패');
    }

    console.log('✓ CLI 빌드 완료\n');

    // 3. create-vitnal-start-kit 명령 실행
    await runCreateCommand();

    // 4. 생성된 프로젝트 파일 구조 검증
    await validateProjectStructure();

    // 5. npm install, build, test 실행
    await runNpmCommands();

    console.log('✅ 모든 E2E 테스트 통과!');
  } catch (error) {
    console.error('❌ E2E 테스트 실패:', error.message);
    throw error;
  } finally {
    // 테스트 후 정리
    await cleanup();
  }
};

runE2ETest().catch((error) => {
  console.error('E2E 테스트 실행 중 오류 발생:', error);
  process.exit(1);
});
