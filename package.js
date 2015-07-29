/* jshint ignore:start */
Package.describe({
  name: 'mjbecze:ethereumjs-tx',
  version: '0.4.0',
  summary: 'An simple module for creating, manipulating and signing ethereum transactions',
  git: 'https://github.com/ethereum/ethereumjs-tx',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.2');

  api.export(['EthTx'], ['client']);

  api.addFiles('dist/ethereumjs-tx.js', 'client');
  api.addFiles('package-init.js', 'client');
});
