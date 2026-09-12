// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // Existing selectors (e.g. `[lb-content]`, `demo`) predate this convention;
      // renaming them is a separate, larger effort.
      '@angular-eslint/directive-selector': 'off',
      '@angular-eslint/component-selector': 'off',
      // These push a standalone/inject()/OnPush migration across the whole library,
      // which is out of scope for swapping the lint tool itself.
      '@angular-eslint/prefer-standalone': 'off',
      '@angular-eslint/prefer-inject': 'off',
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      // Intentional `this` aliasing to reach the component instance from a
      // plain `function` callback where `this` is rebound to the DOM element.
      '@typescript-eslint/no-this-alias': 'off'
    }
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended],
    rules: {}
  }
);
