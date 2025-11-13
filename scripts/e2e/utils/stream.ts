import type { Writable } from 'node:stream';

/**
 * 안전하게 stdin에 데이터를 전송합니다.
 */
export const safeWriteStdin = async (stdin: Writable | null, data: string): Promise<void> => {
  if (!stdin || stdin.destroyed || stdin.writableEnded) {
    return;
  }

  try {
    stdin.write(data);
  } catch (error) {
    // 스트림이 이미 닫혔거나 에러가 발생한 경우 무시
  }
};

/**
 * 안전하게 stdin을 종료합니다.
 */
export const safeEndStdin = async (stdin: Writable | null): Promise<void> => {
  if (!stdin || stdin.destroyed || stdin.writableEnded) {
    return;
  }

  try {
    stdin.end();
  } catch (error) {
    // 스트림이 이미 닫혔거나 에러가 발생한 경우 무시
  }
};
