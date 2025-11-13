#!/usr/bin/env bun

import { PROJECT_ROOT, TEST_PROJECT_NAME } from '@e2e/config';
import { safeEndStdin, safeWriteStdin } from '@e2e/utils/stream';

/**
 * 상수 정의
 */
const DELAYS = {
  DEFAULT_RESPONSE: 100, // 기본 응답 지연 시간 (ms)
  LIST_RENDER: 500, // list 타입 프롬프트 렌더링 대기 시간 (ms)
  STDIN_CLOSE: 100, // stdin 종료 전 대기 시간 (ms)
} as const;

const TIMEOUTS = {
  PROMPT_RESPONSE: 30000, // 프롬프트 응답 타임아웃 (30초)
} as const;

/**
 * 프롬프트 메시지 패턴 및 응답 정의
 * inquirer가 출력하는 프롬프트 메시지를 감지하고 적절한 응답을 전송
 */
export const PROMPT_RESPONSES = [
  {
    pattern: /React Query를 사용하여 서버 상태를 관리하시겠습니까/,
    response: '\n',
    delay: DELAYS.DEFAULT_RESPONSE,
  },
  {
    pattern: /어떤 클라이언트 상태 관리 라이브러리를 사용하시겠습니까/,
    response: '\n',
    delay: DELAYS.LIST_RENDER,
    waitForRender: true,
    renderPattern: /Use arrow keys|없음/,
  },
  {
    pattern: /Task Master AI를 사용하여 작업 관리를 하시겠습니까/,
    response: 'y\n',
    delay: DELAYS.DEFAULT_RESPONSE,
  },
] as const;

/**
 * create-vsk 명령을 실행하고 프롬프트에 자동으로 응답합니다.
 * stdout을 파싱하여 프롬프트가 실제로 표시되었을 때만 응답합니다.
 */
export const runCreateCommand = async (): Promise<void> => {
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
  let responseScheduled = false;
  const maxPrompts = PROMPT_RESPONSES.length;

  // 프롬프트 응답을 위한 Promise
  const promptResponsePromise = new Promise<void>((resolve, reject) => {
    const reader = cliProcess.stdout.getReader();
    const decoder = new TextDecoder();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let stderrReader: any = null;

    /**
     * 리소스 정리 함수
     * 스트림 reader와 프로세스를 안전하게 정리합니다.
     */
    const cleanupResources = async (): Promise<void> => {
      try {
        if (reader) {
          try {
            await reader.cancel();
          } catch {
            // 이미 취소되었거나 에러가 발생한 경우 무시
          }
        }

        if (stderrReader) {
          try {
            await stderrReader.cancel();
          } catch {
            // 이미 취소되었거나 에러가 발생한 경우 무시
          }
        }

        await safeEndStdin(cliProcess.stdin);
        cliProcess.kill();
      } catch (error) {
        console.error('리소스 정리 중 에러 발생:', error);
      }
    };

    /**
     * 타임아웃 핸들러
     * 타임아웃 발생 시 리소스를 정리하고 Promise를 reject합니다.
     */
    const handleTimeout = async (): Promise<void> => {
      await cleanupResources();
      reject(new Error(`프롬프트 응답 타임아웃: ${responsesSent}/${maxPrompts} 프롬프트에 응답`));
    };

    const timeout = setTimeout(() => {
      handleTimeout().catch((error) => {
        console.error('타임아웃 핸들러 실행 중 에러:', error);
        reject(error);
      });
    }, TIMEOUTS.PROMPT_RESPONSE);

    /**
     * 프롬프트에 응답을 전송하고 상태를 업데이트합니다.
     */
    const sendResponse = async (promptConfig: (typeof PROMPT_RESPONSES)[number]): Promise<void> => {
      await safeWriteStdin(cliProcess.stdin, promptConfig.response);

      responsesSent++;
      promptIndex++;
      responseScheduled = false;

      if (promptIndex >= maxPrompts) {
        clearTimeout(timeout);
        setTimeout(async () => {
          await safeEndStdin(cliProcess.stdin);
          resolve();
        }, DELAYS.STDIN_CLOSE);
      }
    };

    /**
     * 프롬프트 패턴이 감지되었을 때 응답을 스케줄합니다.
     */
    const scheduleResponse = (promptConfig: (typeof PROMPT_RESPONSES)[number]): void => {
      responseScheduled = true;

      // renderPattern이 있는 경우, renderPattern이 감지되면 짧은 지연 후 응답
      // renderPattern이 없는 경우, 설정된 지연 시간 후 응답
      const delay =
        'renderPattern' in promptConfig && promptConfig.renderPattern
          ? DELAYS.DEFAULT_RESPONSE
          : promptConfig.delay;

      setTimeout(async () => {
        await sendResponse(promptConfig);
      }, delay);
    };

    /**
     * stdout 스트림을 읽고 프롬프트를 감지하여 응답합니다.
     */
    const readStdout = async (): Promise<void> => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const data = decoder.decode(value, { stream: true });
          stdoutBuffer += data;
          process.stdout.write(value);

          if (promptIndex >= maxPrompts || responseScheduled) {
            continue;
          }

          const promptConfig = PROMPT_RESPONSES[promptIndex];
          if (!promptConfig.pattern.test(stdoutBuffer)) {
            continue;
          }

          // renderPattern이 있는 경우, renderPattern이 감지될 때까지 대기
          if (
            'renderPattern' in promptConfig &&
            promptConfig.renderPattern &&
            !promptConfig.renderPattern.test(stdoutBuffer)
          ) {
            continue;
          }

          scheduleResponse(promptConfig);
        }
      } catch (error) {
        await cleanupResources();
        reject(error);
      }
    };

    /**
     * stderr 스트림을 읽고 실시간으로 출력합니다.
     * stderr 읽기 실패는 전체 프로세스를 중단시키지 않습니다.
     */
    const readStderr = async (): Promise<void> => {
      if (!stderrReader) {
        return;
      }

      try {
        while (true) {
          const { done, value } = await stderrReader.read();
          if (done) break;
          process.stderr.write(Buffer.from(value));
        }
      } catch (error) {
        console.error('stderr 읽기 중 에러 발생:', error);
      }
    };

    stderrReader = cliProcess.stderr.getReader();
    const stdoutPromise = readStdout();
    const stderrPromise = readStderr().catch((error) => {
      console.error('stderr 읽기 작업 실패:', error);
    });

    // 두 비동기 작업을 추적하여 unhandled rejection 방지
    Promise.allSettled([stdoutPromise, stderrPromise]);
  });

  try {
    await promptResponsePromise;

    const exitCode = await cliProcess.exited;

    if (exitCode !== 0) {
      throw new Error(`프로젝트 생성 실패 (exit code: ${exitCode})`);
    }

    if (responsesSent < maxPrompts) {
      throw new Error(`일부 프롬프트에 응답하지 못함: ${responsesSent}/${maxPrompts}`);
    }

    console.log('\n✓ 프로젝트 생성 완료\n');
  } catch (error) {
    await safeEndStdin(cliProcess.stdin);
    cliProcess.kill();
    throw error;
  }
};
