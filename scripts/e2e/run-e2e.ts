#!/usr/bin/env bun

import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Writable } from 'node:stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const TEST_PROJECT_NAME = 'vitnal-e2e-test';
const TEST_PROJECT_DIR = path.join(PROJECT_ROOT, TEST_PROJECT_NAME);

/**
 * 필수 파일 및 디렉터리 목록
 */
const REQUIRED_FILES: string[] = [
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

  const missingFiles: string[] = [];

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
 * 프롬프트 메시지 패턴 정의
 * inquirer가 출력하는 프롬프트 메시지를 감지하기 위한 패턴
 */
const PROMPT_PATTERNS = [
  /React Query를 사용하여 서버 상태를 관리하시겠습니까/,
  /어떤 클라이언트 상태 관리 라이브러리를 사용하시겠습니까/,
  /Task Master AI를 사용하여 작업 관리를 하시겠습니까/,
] as const;

/**
 * 안전하게 stdin에 데이터를 전송합니다.
 */
const safeWriteStdin = (stdin: Writable | null, data: string): boolean => {
  if (!stdin) {
    return false;
  }

  // stream.Writable의 상태 확인
  if (stdin.destroyed) {
    return false;
  }
  if (stdin.writableEnded || stdin.writable === false) {
    return false;
  }

  try {
    return stdin.write(data) !== false;
  } catch (error) {
    // 스트림이 이미 닫혔거나 에러가 발생한 경우
    return false;
  }
};

/**
 * 안전하게 stdin을 종료합니다.
 */
const safeEndStdin = (stdin: Writable | null): void => {
  if (!stdin) {
    return;
  }

  // stream.Writable의 상태 확인
  if (stdin.destroyed || stdin.writableEnded) {
    return;
  }

  try {
    stdin.end();
  } catch (error) {
    // 스트림이 이미 닫혔거나 에러가 발생한 경우 무시
  }
};

/**
 * create-vsk 명령을 실행하고 프롬프트에 자동으로 응답합니다.
 * stdout을 파싱하여 프롬프트가 실제로 표시되었을 때만 응답합니다.
 */
const runCreateCommand = async () => {
  console.log('🔨 프로젝트 생성 중...\n');

  // Bun 사용으로 더 빠른 실행 (Node.js 대비 2-3배 빠름)
  // --bun 플래그로 Bun 런타임 강제 사용 (Node.js 호환 모드 비활성화)
  const cliProcess = execa('bun', ['--bun', 'dist/cli.js', TEST_PROJECT_NAME], {
    cwd: PROJECT_ROOT,
    stdio: ['pipe', 'pipe', 'pipe'], // stdout/stderr를 캡처하여 파싱 및 출력
  });

  let stdoutBuffer = '';
  let promptIndex = 0;
  let responsesSent = 0;
  const maxPrompts = PROMPT_PATTERNS.length;
  const PROMPT_TIMEOUT = 30000; // 30초 타임아웃
  const RESPONSE_DELAY = 100; // 프롬프트 감지 후 응답 지연 (ms)

  // 프롬프트 응답을 위한 Promise
  const promptResponsePromise = new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`프롬프트 응답 타임아웃: ${responsesSent}/${maxPrompts} 프롬프트에 응답`));
    }, PROMPT_TIMEOUT);

    // stdout 데이터 수집, 파싱 및 실시간 출력
    cliProcess.stdout?.on('data', (chunk: Buffer) => {
      const data = chunk.toString();
      stdoutBuffer += data;

      // 실시간으로 stdout 출력 (ora 스피너 등 표시)
      process.stdout.write(chunk);

      // 현재 기대하는 프롬프트 패턴 확인
      if (promptIndex < maxPrompts) {
        const pattern = PROMPT_PATTERNS[promptIndex];
        if (pattern.test(stdoutBuffer)) {
          // 프롬프트가 감지되었으므로 응답 전송
          setTimeout(() => {
            if (safeWriteStdin(cliProcess.stdin, '\n')) {
              responsesSent++;
              promptIndex++;

              // 모든 프롬프트에 응답했으면 stdin 종료
              if (promptIndex >= maxPrompts) {
                clearTimeout(timeout);
                setTimeout(() => {
                  safeEndStdin(cliProcess.stdin);
                  resolve();
                }, RESPONSE_DELAY);
              }
            }
          }, RESPONSE_DELAY);
        }
      }
    });

    // stderr는 실시간으로 출력 (에러 메시지 등)
    cliProcess.stderr?.on('data', (chunk: Buffer) => {
      process.stderr.write(chunk);
    });
  });

  try {
    // 프롬프트 응답 완료 대기
    await promptResponsePromise;

    // 프로세스 완료 대기
    const cliResult = await cliProcess;

    if (cliResult.exitCode !== 0) {
      throw new Error(`프로젝트 생성 실패 (exit code: ${cliResult.exitCode})`);
    }

    if (responsesSent < maxPrompts) {
      throw new Error(`일부 프롬프트에 응답하지 못함: ${responsesSent}/${maxPrompts}`);
    }

    console.log('\n✓ 프로젝트 생성 완료\n');
  } catch (error) {
    // 에러 발생 시 stdin 정리
    safeEndStdin(cliProcess.stdin);

    // 프로세스가 아직 실행 중이면 종료
    if (!cliProcess.killed) {
      cliProcess.kill();
    }

    throw error;
  }
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

  // 기본 프로젝트만 실행 (Storybook 프로젝트는 CI에서 별도로 실행)
  console.log('🧪 npm run test 실행 중... (기본 프로젝트만)');
  const testResult = await execa('npm', ['run', 'test', '--', '--project=default'], {
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

    // 3. create-vsk 명령 실행
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
