import type { Config } from 'stylelint';

const config: Config = {
  extends: [
    'stylelint-config-standard',
  ],
  plugins: [
    'stylelint-order',
  ],
  rules: {
    // Order properties
    'order/properties-order': [
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'display',
      'float',
      'width',
      'height',
      'max-width',
      'max-height',
      'min-width',
      'min-height',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'border',
      'border-style',
      'border-width',
      'border-color',
      'border-top',
      'border-top-style',
      'border-top-width',
      'border-top-color',
      'border-right',
      'border-right-style',
      'border-right-width',
      'border-right-color',
      'border-bottom',
      'border-bottom-style',
      'border-bottom-width',
      'border-bottom-color',
      'border-left',
      'border-left-style',
      'border-left-width',
      'border-left-color',
      'border-radius',
      'background',
      'background-color',
      'background-image',
      'background-repeat',
      'background-attachment',
      'background-position',
      'background-size',
      'color',
      'font',
      'font-family',
      'font-size',
      'font-weight',
      'line-height',
      'text-align',
      'text-justify',
      'text-indent',
      'text-overflow',
      'text-decoration',
      'white-space',
      'vertical-align',
      'cursor',
      'opacity',
    ],
    
    // Disable some rules that might conflict with PostCSS
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'layer',
        ],
      },
    ],
    
    // Allow empty source
    'no-empty-source': null,
    
    // Allow unknown properties for PostCSS features
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [
          'composes',
        ],
      },
    ],
    
    // Allow unknown units for PostCSS features
    'unit-no-unknown': [
      true,
      {
        ignoreUnits: [
          'rpx',
        ],
      },
    ],
  },
  ignoreFiles: [
    'dist/**/*',
    'node_modules/**/*',
  ],
};

export default config;
