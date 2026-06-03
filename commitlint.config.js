module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', [
      'propostas',
      'contratos',
      'clientes',
      'prestadores',
      'avaliacoes',
      'auth',
      'gateway',
      'infra',
      'deps',
      'ws',
      'cache',
      'resilience',
    ]],
  },
};