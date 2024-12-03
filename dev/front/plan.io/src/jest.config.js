module.exports = {
    transform: {
      "^.+\\.m?[jt]sx?$": "babel-jest", // Ensures Babel processes modern JS
    },
    transformIgnorePatterns: [
      "/node_modules/(?!(pdfjs-dist)/)", // Allows Jest to transform `pdfjs-dist`
    ],
  };
  