global.IS_REACT_ACT_ENVIRONMENT = true;

// In your test setup file
// eslint-disable-next-line no-undef
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const config = {
  verbose: false,
  automock: true,
  setupFiles: ["./test_setup_files/setup.js"],
  moduleNameMapper: {
    "^.+\\.(css|less|scss)$": "identity-obj-proxy",
  },
};

module.exports = config;
