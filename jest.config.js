global.IS_REACT_ACT_ENVIRONMENT = true;

// In your test setup file
// eslint-disable-next-line no-undef
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const config = {
    verbose: false,
    automock: false,
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    transform: {
        ".(ts|tsx)": [
            'ts-jest',
            {
                diagnostics: {
                    ignoreCodes: [1343]
                },
                astTransformers: {
                    before: [
                        {
                            path: 'node_modules/ts-jest-mock-import-meta',  // or, alternatively, 'ts-jest-mock-import-meta' directly, without node_modules.
                            //options: { metaObjectReplacement: { url: 'https://www.url.com' } }
                        }
                    ]
                }
            }
        ]
    },

    maxConcurrency: 8,
    maxWorkers: '85%',

    setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
    testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
    moduleNameMapper: {
        '^.+\\.(bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp)$': '<rootDir>/src/__mocks__/fileMock.js',
        "^.+\\.(css|less|sass|scss)$": "<rootDir>/src/__mocks__/styleMock.js",
    },
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js"
    ]
};

export default config;
