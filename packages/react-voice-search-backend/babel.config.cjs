module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: { node: "current" },
        modules: "auto"  // Transpile ESM import/export to CommonJS
      }
    ]
  ],
};
