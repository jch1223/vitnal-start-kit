import { spawn } from 'node:child_process';
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
import path from 'node:path';

export const runCreateCommand = async (): Promise<void> => {
  console.log('🔨 프로젝트 생성 중...\n');

  const cliPath = path.join(PROJECT_ROOT, 'dist', 'cli.js');
  const cliProcess = spawn('node', [cliPath, TEST_PROJECT_NAME], {
    cwd: PROJECT_ROOT,
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  let stdoutBuffer = '';
  let promptIndex = 0;
  let responsesSent = 0;
  let responseScheduled = false;
  const maxPrompts = PROMPT_RESPONSES.length;
  let stderrBuffer = '';

  const promptResponsePromise = new Promise<void>((resolve, reject) => {
    const decoder = new TextDecoder();
    const stderrDecoder = new TextDecoder();

    const cleanupResources = (): void => {
      try {
        if (cliProcess.stdin && !cliProcess.stdin.destroyed) {
          cliProcess.stdin.destroy();
        }
        if (!cliProcess.killed) {
          cliProcess.kill();
        }
      } catch (error) {
        console.error('리소스 정리 중 에러 발생:', error);
      }
    };

    const handleTimeout = (): void => {
      cleanupResources();
      reject(new Error(`프롬프트 응답 타임아웃: ${responsesSent}/${maxPrompts} 프롬프트에 응답`));
    };

    const timeout = setTimeout(() => {
      try {
        handleTimeout();
      } catch (error) {
        console.error('타임아웃 핸들러 실행 중 에러:', error);
        reject(error);
      }
    }, TIMEOUTS.PROMPT_RESPONSE);

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

    cliProcess.stdout.on('data', (chunk: Buffer) => {
      const data = chunk.toString();
      stdoutBuffer += data;
      process.stdout.write(chunk);

      if (promptIndex >= maxPrompts || responseScheduled) {
        return;
      }

      const promptConfig = PROMPT_RESPONSES[promptIndex];
      if (!promptConfig.pattern.test(stdoutBuffer)) {
        return;
      }

      if (
        'renderPattern' in promptConfig &&
        promptConfig.renderPattern &&
        !promptConfig.renderPattern.test(stdoutBuffer)
      ) {
        return;
      }
      responseScheduled = true;
      const delay =
        'renderPattern' in promptConfig && promptConfig.renderPattern
          ? DELAYS.DEFAULT_RESPONSE
          : promptConfig.delay;
      setTimeout(async () => {
        await sendResponse(promptConfig);
      }, delay);
    });

    cliProcess.stdout.on('end', () => {
      clearTimeout(timeout);
      resolve();
    });

    cliProcess.stderr.on('data', (chunk: Buffer) => {
      const data = chunk.toString();
      stderrBuffer += data;
      process.stderr.write(chunk);
    });
  });

  try {
    await promptResponsePromise;

    const exitCode = await new Promise<number>((resolve) => {
      cliProcess.on('exit', (code) => {
        resolve(code ?? 0);
      });
    });

    if (exitCode !== 0) {
      const errorMessage = stderrBuffer.trim()
        ? `프로젝트 생성 실패 (exit code: ${exitCode})\n\nstderr:\n${stderrBuffer}`
        : `프로젝트 생성 실패 (exit code: ${exitCode})`;
      throw new Error(errorMessage);
    }

    if (responsesSent < maxPrompts) {
      throw new Error(`일부 프롬프트에 응답하지 못함: ${responsesSent}/${maxPrompts}`);
    }

    console.log('\n✓ 프로젝트 생성 완료\n');
  } catch (error) {
    await safeEndStdin(cliProcess.stdin);
    if (!cliProcess.killed) {
      cliProcess.kill();
    }
    throw error;
  }
};
