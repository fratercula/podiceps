module.exports = {
  '*.{ts,tsx}': () => 'lerna exec -- tsc -p tsconfig.json --noEmit',
  '*.{js,ts,tsx}': 'yarn lint',
}
