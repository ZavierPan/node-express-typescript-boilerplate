module.exports = {
  // Parser: Specifies the parser to use for analyzing TypeScript code
  parser: '@typescript-eslint/parser',
  
  // Parser Options: Configuration for the parser
  parserOptions: {
    ecmaVersion: 2022,        // ECMAScript version to support (ES2022)
    sourceType: 'module',     // Type of JavaScript modules (ES modules)
  },
  
  // Plugins: Additional ESLint plugins to load
  plugins: [
    '@typescript-eslint',     // TypeScript-specific linting rules
    'prettier'                // Prettier formatting rules integration
  ],
  
  // Extends: Base configurations to extend from
  extends: [
    'eslint:recommended',     // ESLint's recommended rules
    'prettier',               // Prettier configuration (disables conflicting ESLint rules)
  ],
  
  // Root: Indicates this is the root configuration file
  root: true,
  
  // Environment: Specifies which environments the code will run in
  env: {
    node: true,               // Node.js global variables and scoping
    es2022: true,             // ES2022 global variables
  },
  
  // Ignore Patterns: Files and directories to ignore during linting
  ignorePatterns: [
    '.eslintrc.js',           // Ignore this configuration file itself
    'dist/**/*',              // Ignore all files in the dist directory
    'src/__tests__/**/*',      // Ignore test files
    'jest.config.js'          // Ignore Jest configuration file
  ],
  
  // Rules: Specific linting rules configuration
  rules: {
    // Basic ESLint Rules
    'no-unused-vars': 'off',          // Disable basic unused vars rule (TypeScript handles this better)
    'no-undef': 'off',                // Disable undefined variable rule (TypeScript handles this)
    'no-console': 'off',              // Allow console.log statements
    
    // TypeScript-specific Rules
    '@typescript-eslint/no-unused-vars': [
      'error', 
      { argsIgnorePattern: '^_' }     // Error on unused vars, but ignore those starting with underscore
    ],
    '@typescript-eslint/no-explicit-any': 'warn',  // Warn when using 'any' type
    
    // Prettier Integration
    'prettier/prettier': 'error',     // Treat Prettier formatting issues as ESLint errors
  },
};