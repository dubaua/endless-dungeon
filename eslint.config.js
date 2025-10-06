import js from '@eslint/js';
import solid from 'eslint-plugin-solid';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'node:url';

const tsconfigRootDir = fileURLToPath(new URL('.', import.meta.url));

const typeAwareConfigs = tseslint.configs.recommendedTypeChecked.map((config) => ({
  ...config,
  files: ['src/**/*.{ts,tsx}'],
  languageOptions: {
    ...config.languageOptions,
    parserOptions: {
      ...(config.languageOptions?.parserOptions ?? {}),
      project: './tsconfig.json',
      tsconfigRootDir,
    },
  },
}));

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules', 'eslint.config.js'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...typeAwareConfigs,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      solid,
    },
    rules: {
      ...solid.configs['flat/typescript'].rules,
      'solid/components-return-once': 'error',
    },
  }
);
