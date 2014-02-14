var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'responsive-tool'
    },
    port: 3000,
    db: 'mongodb://localhost/responsive-tool-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'responsive-tool'
    },
    port: 3000,
    db: 'mongodb://localhost/responsive-tool-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'responsive-tool'
    },
    port: 3000,
    db: 'mongodb://localhost/responsive-tool-production'
  }
};

module.exports = config[env];
