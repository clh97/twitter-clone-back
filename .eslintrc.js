module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    rules: {
        '@typescript-eslint/no-namespace': 0,
        '@typescript-eslint/quotes': [
            'error',
            'single',
            {
                "avoidEscape": true,
                "allowTemplateLiterals": true
            }
        ]
    },
};
