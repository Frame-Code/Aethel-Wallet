// Configuracion ESLint para apps/web (Next.js + React)
// Hereda las reglas de la raiz (.eslintrc.js con root:true)
// NOTA: Agregar 'next/core-web-vitals' al extends cuando eslint-config-next este instalado:
//   npm install -D eslint-config-next  (correr desde apps/web en Windows)

module.exports = {
  rules: {
    // React con TypeScript: los tipos ya validan las props
    'react/prop-types': 'off',
    // En Next.js App Router no es necesario importar React
    'react/react-in-jsx-scope': 'off',
    // Los componentes del servidor pueden usar async sin problema
    '@typescript-eslint/require-await': 'off',
  },
};
