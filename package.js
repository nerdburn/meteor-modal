Package.describe({
  name: 'nerdburn:modal',
  version: '0.0.1',
  summary: 'Dynamically insert any Meteor template into a modal window.',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use(['templating', 'less'], 'client');
  api.addFiles(['modal.less', 'modal.html', 'modal.js'], 'client');
  api.export('Modal', ['client']);
});
