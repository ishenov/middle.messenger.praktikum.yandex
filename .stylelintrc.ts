export default {
  extends: [
    "stylelint-config-standard"
  ],
  plugins: [
    "stylelint-order"
  ],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen"
        ]
      }
    ],
    "no-descending-specificity": null,
    "selector-class-pattern": null
  }
};
