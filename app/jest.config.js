module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transformIgnorePatterns: [
    "node_modules/(?!chess\\.js)",
  ],
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};
