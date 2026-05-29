  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', [
      'root','desktop','web','api',
      'ui','types','utils',
      'fleet','rentals','sales','finance',
      'payroll','customers','employees',
      'documents','notifications','audit',
      'auth','settings','db','deps','ci'
    ]]
  }
};