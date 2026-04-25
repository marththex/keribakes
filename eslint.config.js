import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...eslintPluginAstro.configs['flat/recommended'],
  {
    ignores: ['dist/**', '.astro/**'],
  },
);
