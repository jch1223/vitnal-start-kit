// @ts-ignore - Bun의 빌드 API는 런타임에 내장되어 있음
import { build } from 'bun';

/**
 * CLI 빌드 설정
 * CommonJS 형식으로 번들링하여 dist/cli.js 생성
 * tsconfig.json의 경로 별칭(@/*)을 자동으로 처리합니다
 */
await build({
  entrypoints: ['src/cli.ts'],
  outdir: './dist',
  target: 'node',
  format: 'cjs', // CommonJS 형식 (package.json의 type: "commonjs"와 일치)
  minify: false, // 디버깅을 위해 minify 비활성화
  sourcemap: 'external', // 소스맵 별도 파일로 생성
  // tsconfig.json의 paths 설정을 자동으로 읽습니다
  // baseUrl: "src", paths: { "@/*": ["*"] } 처리됨
  external: [
    // 번들에 포함하지 않을 패키지들 (런타임 의존성)
    'commander',
    'ejs',
    'inquirer',
    'ora',
  ],
});
