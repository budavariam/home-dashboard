module.exports = {
  input: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
    '!src/i18n.ts',
    '!**/node_modules/**'
  ],
  output: './',
  options: {
    debug: false,
    removeUnusedKeys: false,
    sort: true,
    func: {
      list: ['t'],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    lngs: ['en', 'hu'],
    ns: ['translation'],
    defaultLng: 'en',
    defaultNs: 'translation',
    defaultValue: (lng, ns, key) => {
      if (lng === 'en') {
        return key;
      }
      return '';
    },
    resource: {
      loadPath: 'src/locales/{{lng}}/{{ns}}.json',
      savePath: 'src/locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2,
      lineEnding: '
'
    },
    keySeparator: '.',
    nsSeparator: false,
    context: true,
    contextFallback: true,
    contextSeparator: '_',
    plural: true,
    pluralSeparator: '_'
  }
};
