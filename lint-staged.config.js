module.exports = {
  '*.{ts,tsx}': () => 'tsc --noEmit',
  '*.{js,ts,tsx}': 'yarn lint',
}
