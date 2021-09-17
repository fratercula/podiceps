module.exports = {
  '*.{ts,tsx}': () => 'tsc --noEmit',
  '*.{js,ts,tsx}': 'eslint . --ext .ts,.tsx,.js',
}
