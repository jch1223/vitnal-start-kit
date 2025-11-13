import { spawn } from 'child_process';
import path from 'node:path';
import { PROJECT_ROOT, TEST_PROJECT_NAME } from '@e2e/config';
import { safeEndStdin, safeWriteStdin } from '@e2e/utils/stream';

/**
 * 프롬프트 메시지 패턴 및 응답 정의
 * inquirer가 출력하는 프롬프트 메시지를 감지하고 적절한 응답을 전송
 */
export const PROMPT_RESPONSES = [
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
 * create-vsk 명령을 실행하고 프롬프트에 자동으로 응답합니다.
 * stdout을 파싱하여 프롬프트가 실제로 표시되었을 때만 응답합니다.
 */
export const runCreateCommand = async (): Promise<void> => {
  console.log('🔨 프로젝트 생성 중...\n');

  // child_process.spawn을 사용하여 프로세스 실행
  const cliPath = path.join(PROJECT_ROOT, 'dist', 'cli.js');
  const cliProcess = spawn('node', [cliPath, TEST_PROJECT_NAME], {
    cwd: PROJECT_ROOT,
    stdio: ['pipe', 'pipe', 'pipe'],
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

    // stdout 데이터 수집, 파싱 및 실시간 출력
    cliProcess.stdout.on('data', (chunk: Buffer) => {
      const data = chunk.toString();
      stdoutBuffer += data;

      // 실시간으로 stdout 출력 (ora 스피너 등 표시)
      process.stdout.write(chunk);

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
    });

    cliProcess.stdout.on('end', () => {
      clearTimeout(timeout);
      resolve();
    });

    // stderr는 실시간으로 출력 (에러 메시지 등)
    cliProcess.stderr.on('data', (chunk: Buffer) => {
      process.stderr.write(chunk);
    });
  });

  try {
    // 프롬프트 응답 완료 대기
    await promptResponsePromise;

    // 프로세스 완료 대기
    const exitCode = await new Promise<number>((resolve) => {
      cliProcess.on('exit', (code) => {
        resolve(code ?? 0);
      });
    });

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
