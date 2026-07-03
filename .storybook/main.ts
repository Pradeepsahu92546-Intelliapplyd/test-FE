import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    '@storybook/addon-designs'
  ],
  "framework": {
    "name": "@storybook/angular",
    "options": {
      "builder": {
        "name": "@storybook/builder-webpack5",
        "options": {

          "fsCache": true
        }
      },
      "styles": [
        "node_modules/ng-zorro-antd/ng-zorro-antd.css",
        "src/styles.css"
      ]
    }
  }
};
export default config;