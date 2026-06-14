// Configuracion ESLint para apps/api (NestJS)
// Extiende la config raiz y agrega reglas especificas de NestJS

module.exports = {
  // No ponemos root:true — deja que ESLint suba y encuentre el .eslintrc.js de la raiz
  parserOptions: {
    // NestJS usa decoradores: @Injectable(), @Controller(), etc.
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
  },
  rules: {
    // En NestJS los parametros de decoradores a veces no se usan directamente
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    // Los servicios de NestJS suelen tener metodos async que retornan Promise
    '@typescript-eslint/require-await': 'off',
  },
};
