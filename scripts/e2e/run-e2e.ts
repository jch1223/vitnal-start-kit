#!/usr/bin/env bun

import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Bun 1.0.23+에서는 import.meta.dir을 지원하지만, 안정성을 위해 fileURLToPath도 함께 사용
// import.meta.dir이 undefined일 경우를 대비한 fallback
const __filename = fileURLToPath(import.meta.url);
const __dirname = (import.meta.dir as string | undefined) || path.dirname(__filename);
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
  try {
    // Bun의 Promise 기반 fs API 사용 (node:fs/promises)
    const { rm, exists } = await import('node:fs/promises');
    if (await exists(TEST_PROJECT_DIR)) {
      await rm(TEST_PROJECT_DIR, { recursive: true, force: true });
      console.log(`✓ 임시 프로젝트 디렉터리 삭제 완료: ${TEST_PROJECT_DIR}`);
    }
  } catch (error) {
    // 디렉터리가 없거나 삭제 실패 시 무시
  }
};

/**
 * 생성된 프로젝트의 파일 구조를 검증합니다.
 */
const validateProjectStructure = async () => {
  console.log('📋 생성된 프로젝트 파일 구조 검증 중...');
  console.log(`검증 대상 디렉터리: ${TEST_PROJECT_DIR}`);

  const missingFiles: string[] = [];

  for (const file of REQUIRED_FILES) {
    const filePath = path.join(TEST_PROJECT_DIR, file);

    try {
      // Bun의 Promise 기반 fs API 사용 (node:fs/promises)
      const { stat } = await import('node:fs/promises');
      const stats = await stat(filePath);

      // src는 디렉터리여야 하고, 나머지는 파일이어야 함
      if (file === 'src' && !stats.isDirectory()) {
        console.log(`  ❌ 타입 오류: ${file}는 디렉터리여야 함`);
        missingFiles.push(file);
      } else if (file !== 'src' && stats.isDirectory()) {
        console.log(`  ❌ 타입 오류: ${file}는 파일이어야 함`);
        missingFiles.push(file);
      } else {
        console.log(`  ✓ 존재: ${file}`);
      }
    } catch (error) {
      // 파일/디렉터리가 존재하지 않으면 에러 발생
      console.log(
        `  ❌ 누락: ${file} (${filePath}) - ${error instanceof Error ? error.message : String(error)}`,
      );
      missingFiles.push(file);
    }
  }

  if (missingFiles.length > 0) {
    throw new Error(`필수 파일이 누락되었습니다: ${missingFiles.join(', ')}`);
  }

  console.log('✓ 파일 구조 검증 완료\n');
};

/**
 * 프롬프트 메시지 패턴 및 응답 정의
 * inquirer가 출력하는 프롬프트 메시지를 감지하고 적절한 응답을 전송
 */
const PROMPT_RESPONSES = [
  {
    pattern: /React Query를 사용하여 서버 상태를 관리하시겠습니까/,
    response: '\n', // 기본값 true (엔터)
    delay: 100, // 응답 지연 시간 (ms)
  },
  {
    pattern: /어떤 클라이언트 상태 관리 라이브러리를 사용하시겠습니까/,
    response: '\n', // list 타입은 기본값이 있으면 엔터 한 번으로 선택
    delay: 500, // list 타입은 렌더링 시간이 더 필요하므로 더 긴 지연
    waitForRender: true, // 프롬프트가 완전히 렌더링될 때까지 대기
    renderPattern: /Use arrow keys|없음/, // 프롬프트가 완전히 렌더링되었는지 확인하는 패턴
  },
  {
    pattern: /Task Master AI를 사용하여 작업 관리를 하시겠습니까/,
    response: 'y\n', // 기본값 false이므로 'y' 입력하여 선택
    delay: 100, // 응답 지연 시간 (ms)
  },
] as const;

/**
 * 안전하게 stdin에 데이터를 전송합니다.
 */
const safeWriteStdin = async (stdin: any, data: string): Promise<void> => {
  if (!stdin) {
    return;
  }

  try {
    // Bun.spawn의 stdin은 FileSink 타입으로 write() 메서드를 가짐
    await stdin.write(data);
  } catch (error) {
    // 스트림이 이미 닫혔거나 에러가 발생한 경우 무시
  }
};

/**
 * 안전하게 stdin을 종료합니다.
 */
const safeEndStdin = async (stdin: any): Promise<void> => {
  if (!stdin) {
    return;
  }

  try {
    // Bun.spawn의 stdin은 FileSink 타입으로 end() 메서드를 가짐
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

  // Bun.spawn을 사용하여 프로세스 실행
  const cliProcess = Bun.spawn(['bun', '--bun', 'dist/cli.js', TEST_PROJECT_NAME], {
    cwd: PROJECT_ROOT,
    stdin: 'pipe',
    stdout: 'pipe',
    stderr: 'pipe',
  });

  let stdoutBuffer = '';
  let promptIndex = 0;
  let responsesSent = 0;
  let responseScheduled = false; // 응답이 이미 스케줄되었는지 추적
  const maxPrompts = PROMPT_RESPONSES.length;
  const PROMPT_TIMEOUT = 30000; // 30초 타임아웃

  // 프롬프트 응답을 위한 Promise
  const promptResponsePromise = new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`프롬프트 응답 타임아웃: ${responsesSent}/${maxPrompts} 프롬프트에 응답`));
    }, PROMPT_TIMEOUT);

    // stdout 데이터 수집, 파싱 및 실시간 출력
    const reader = cliProcess.stdout.getReader();
    const decoder = new TextDecoder();

    const sendResponse = async (promptConfig: (typeof PROMPT_RESPONSES)[number]) => {
      // 응답 전송
      await safeWriteStdin(cliProcess.stdin, promptConfig.response);

      responsesSent++;
      promptIndex++;
      responseScheduled = false; // 다음 프롬프트를 위해 리셋

      // 모든 프롬프트에 응답했으면 stdin 종료
      if (promptIndex >= maxPrompts) {
        clearTimeout(timeout);
        setTimeout(async () => {
          await safeEndStdin(cliProcess.stdin);
          resolve();
        }, 100);
      }
    };

    const readStdout = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const data = decoder.decode(value, { stream: true });
          stdoutBuffer += data;

          // 실시간으로 stdout 출력 (ora 스피너 등 표시)
          process.stdout.write(value);

          // 현재 기대하는 프롬프트 패턴 확인
          if (promptIndex < maxPrompts && !responseScheduled) {
            const promptConfig = PROMPT_RESPONSES[promptIndex];

            // 프롬프트 패턴이 감지되었는지 확인
            if (promptConfig.pattern.test(stdoutBuffer)) {
              // renderPattern이 있는 경우 (list 타입 등)
              if ('renderPattern' in promptConfig && promptConfig.renderPattern) {
                // renderPattern이 감지되면 즉시 응답 전송
                if (promptConfig.renderPattern.test(stdoutBuffer)) {
                  responseScheduled = true;
                  // 렌더링이 완료되었으므로 응답 전송
                  setTimeout(async () => {
                    await sendResponse(promptConfig);
                    responseScheduled = false;
                  }, 100); // 짧은 지연 후 응답
                }
                // renderPattern이 아직 감지되지 않았으면 계속 대기
              } else {
                // renderPattern이 없는 경우 (confirm 타입 등)
                responseScheduled = true;
                setTimeout(async () => {
                  await sendResponse(promptConfig);
                  responseScheduled = false;
                }, promptConfig.delay);
              }
            }
          }
        }
      } catch (error) {
        reject(error);
      }
    };

    readStdout();

    // stderr는 실시간으로 출력 (에러 메시지 등)
    const stderrReader = cliProcess.stderr.getReader();

    const readStderr = async () => {
      try {
        while (true) {
          const { done, value } = await stderrReader.read();
          if (done) break;
          process.stderr.write(value);
        }
      } catch (error) {
        // stderr 읽기 에러는 무시
      }
    };

    readStderr();
  });

  try {
    // 프롬프트 응답 완료 대기
    await promptResponsePromise;

    // 프로세스 완료 대기
    const exitCode = await cliProcess.exited;

    if (exitCode !== 0) {
      throw new Error(`프로젝트 생성 실패 (exit code: ${exitCode})`);
    }

    if (responsesSent < maxPrompts) {
      throw new Error(`일부 프롬프트에 응답하지 못함: ${responsesSent}/${maxPrompts}`);
    }

    console.log('\n✓ 프로젝트 생성 완료\n');
  } catch (error) {
    // 에러 발생 시 stdin 정리
    await safeEndStdin(cliProcess.stdin);

    // 프로세스가 아직 실행 중이면 종료
    cliProcess.kill();

    throw error;
  }
};

/**
 * 생성된 프로젝트에서 npm 명령어를 실행합니다.
 */
const runNpmCommands = async () => {
  console.log('📦 npm install 실행 중...');
  const installProcess = Bun.spawn(['npm', 'install'], {
    cwd: TEST_PROJECT_DIR,
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const installExitCode = await installProcess.exited;
  if (installExitCode !== 0) {
    throw new Error('npm install 실패');
  }
  console.log('✓ npm install 완료\n');

  // Playwright 브라우저 설치 (Storybook 테스트에 필요)
  console.log('🌐 Playwright 브라우저 설치 중...');
  const playwrightProcess = Bun.spawn(['npx', 'playwright', 'install', 'chromium'], {
    cwd: TEST_PROJECT_DIR,
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const playwrightExitCode = await playwrightProcess.exited;
  if (playwrightExitCode !== 0) {
    throw new Error('Playwright 브라우저 설치 실패');
  }
  console.log('✓ Playwright 브라우저 설치 완료\n');

  console.log('🔨 npm run build 실행 중...');
  const buildProcess = Bun.spawn(['npm', 'run', 'build'], {
    cwd: TEST_PROJECT_DIR,
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const buildExitCode = await buildProcess.exited;
  if (buildExitCode !== 0) {
    throw new Error('npm run build 실패');
  }
  console.log('✓ npm run build 완료\n');

  // 기본 프로젝트만 실행 (Storybook 프로젝트는 CI에서 별도로 실행)
  console.log('🧪 npm run test 실행 중... (기본 프로젝트만)');
  const testProcess = Bun.spawn(['npm', 'run', 'test', '--', '--project=default'], {
    cwd: TEST_PROJECT_DIR,
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const testExitCode = await testProcess.exited;
  if (testExitCode !== 0) {
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
    const buildProcess = Bun.spawn(['npm', 'run', 'build'], {
      cwd: PROJECT_ROOT,
      stdout: 'inherit',
      stderr: 'inherit',
    });

    const buildExitCode = await buildProcess.exited;
    if (buildExitCode !== 0) {
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
