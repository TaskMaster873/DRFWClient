global.IS_REACT_ACT_ENVIRONMENT = true;

// In your test setup file
// eslint-disable-next-line no-undef
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const config = {
  verbose: true,
  automock: true,
  preset: 'ts-jest/presets/default-esm', // or other ESM presets
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    "^.+\\.(css|less|scss)$": "identity-obj-proxy",
  },
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};

module.exports = config;
