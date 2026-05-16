import * as esbuild from 'esbuild';
import { copyFileSync, mkdirSync, cpSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isWatch = process.argv.includes('--watch');
const isServe = process.argv.includes('--serve');

const shoelaceAssetsSrc = join(__dirname, 'node_modules/@shoelace-style/shoelace/dist/assets');
const shoelaceAssetsDst = join(__dirname, 'dist/shoelace/assets');

function copyAssets() {
  mkdirSync('dist', { recursive: true });
  copyFileSync('index.html', 'dist/index.html');
  if (existsSync(shoelaceAssetsSrc)) {
    cpSync(shoelaceAssetsSrc, shoelaceAssetsDst, { recursive: true });
  }
}

const buildOptions = {
  entryPoints: ['src/main.tsx'],
  bundle: true,
  outfile: 'dist/app.js',
  jsx: 'automatic',
  jsxImportSource: 'preact',
  alias: {
    'react':              'preact/compat',
    'react-dom':          'preact/compat',
    'react-dom/client':   'preact/compat/client',
    'react/jsx-runtime':  'preact/jsx-runtime',
  },
  loader: { '.css': 'css' },
  minify: !isWatch && !isServe,
  sourcemap: isWatch || isServe,
  logLevel: 'info',
};

copyAssets();

if (isServe) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  const { host, port } = await ctx.serve({ servedir: 'dist', port: 3000 });
  console.log(`Serving at http://${host}:${port}`);
} else if (isWatch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log('Watching for changes…');
} else {
  await esbuild.build(buildOptions);
  console.log('Build complete → dist/');
}
