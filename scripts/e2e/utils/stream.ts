#!/usr/bin/env bun

/**
 * 안전하게 stdin에 데이터를 전송합니다.
 */
export const safeWriteStdin = async (stdin: any, data: string): Promise<void> => {
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
export const safeEndStdin = async (stdin: any): Promise<void> => {
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
