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

    // Additional rules for better code quality
    'declaration-block-no-duplicate-properties': true,
    'declaration-block-no-redundant-longhand-properties': true,
    'declaration-block-no-shorthand-property-overrides': true,
    'declaration-no-important': true,
    'function-calc-no-unspaced-operator': true,
    'function-linear-gradient-no-nonstandard-direction': true,
    'function-name-case': 'lower',
    'function-url-quotes': 'always',
    'length-zero-no-unit': true,
    'max-nesting-depth': 3,
    'no-duplicate-selectors': true,
    'no-empty-source': null,
    'no-invalid-double-slash-comments': true,
    'no-unknown-animations': true,
    'number-max-precision': 4,
    'property-no-vendor-prefix': true,
    'rule-empty-line-before': 'always-multi-line',
    'selector-attribute-quotes': 'always',
    'selector-class-pattern': '^[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$',
    'selector-id-pattern': '^[a-z]([a-z0-9-]+)?$',
    'selector-max-attribute': 1,
    'selector-max-class': 4,
    'selector-max-combinators': 3,
    'selector-max-compound-selectors': 4,
    'selector-max-id': 0,
    'selector-max-pseudo-class': 3,
    'selector-max-type': 2,
    'selector-max-universal': 1,
    'selector-no-qualifying-type': true,
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-element-colon-notation': 'double',
    'selector-pseudo-element-no-unknown': true,
    'selector-type-no-unknown': true,
    'shorthand-property-no-redundant-values': true,
    'string-no-newline': true,
    'time-min-milliseconds': 100,
    'unit-no-unknown': [
      true,
      {
        ignoreUnits: [
          'rpx',
        ],
      },
    ],
    'value-no-vendor-prefix': true,
  },
  ignoreFiles: [
    'dist/**/*',
    'node_modules/**/*',
  ],
};

export default config;
