// See
// https://eslint.org/docs/user-guide/configuring/ and
// https://eslint.org/docs/user-guide/configuring/configuration-files#extending-configuration-files
module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "ignorePatterns": ["**/__tests__/*.js"],
    "rules": {
    }
}
