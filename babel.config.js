const assumptions = {
  setPublicClassFields: true
};

const plugins = [
  ['@babel/plugin-proposal-decorators', {decoratorsBeforeExport: true}],
  ['@babel/plugin-proposal-class-properties']
];

const presets = ['@babel/preset-env', '@babel/preset-typescript'];

const transform = {
  '^.+\\.(ts|tsx)?$': 'ts-jest',
  '^.+\\.(js|jsx)$': 'babel-jest'
};

module.exports = {presets, assumptions, plugins, transform};
// module.exports = {assumptions, plugins};
