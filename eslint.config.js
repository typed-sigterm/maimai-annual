import ts from '@typed-sigterm/eslint-config';

export default ts({}, {
  files: ['**/assets/songs.json'],
  rules: {
    'autocorrect/issue': 'off',
    'no-irregular-whitespace': 'off',
    'style/eol-last': 'off',
  },
});
