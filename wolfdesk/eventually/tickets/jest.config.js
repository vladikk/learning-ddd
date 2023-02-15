/* eslint-disable no-undef */
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*spec.ts"],
  coveragePathIgnorePatterns: [
    "node_modules",
    "dist",
    "__tests__",
    "__mocks__",
  ],
};
