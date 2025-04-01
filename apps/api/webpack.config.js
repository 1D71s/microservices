const { NxWebpackPlugin } = require('@nx/webpack');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/api'),
  },
  plugins: [
    new NxWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: [
        {
          input: './src/assets',
          glob: '**/*',
          output: 'assets',
        },
      ],
      outputPath: 'dist/apps/api',
      sourceRoot: 'apps/api/src',
    }),
  ],
};
