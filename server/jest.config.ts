import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['**/*.test.ts'],
    collectCoverageFrom: ['src/**/*.ts', '!**/node_modules/**'],
    coverageDirectory: 'coverage',
    verbose: true,
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.json',
            },
        ],
    },
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
};

export default config;
