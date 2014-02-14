'use strict';

var request = require('request');

module.exports = function (grunt) {
  var target = grunt.option('target') || 'develop';
  var config = {
      'rootdir': 'public'
  };
  // show elapsed time at the end
  //require('time-grunt')(grunt);
  // load all grunt tasks
  //require('load-grunt-tasks')(grunt);

 // var reloadPort = 35729, files;

  grunt.initConfig({
    config: config,
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'app.js'
      }
    },

    compass: {                  // Task
      develop: {                   // Target
        options: {              // Target options
          httpPath:'/',
          sassDir: config.rootdir + '/css/scss',
          cssDir: config.rootdir + '/css',
          imagesDir: config.rootdir + '/images/sprites',
          httpGeneratedImagesPath:'/images/sprites'
        }
      },

      production: {                   // Target
        options: {              // Target options
          httpPath:'/',
          sassDir: config.rootdir + '/css/scss',
          cssDir: config.rootdir + '/css',
          imagesDir: config.rootdir + '/images/sprites',
          httpGeneratedImagesPath:'/images/sprites',
          outputStyle: 'compressed'
        }
      }
    },
    watch: {
      options: {
        nospawn: true,
       // livereload: reloadPort
      },

      css: {
        files: ['<%= config.rootdir %>/css/scss/*.{sass,scss}', '<%= config.rootdir %>/css/scss/**/*.{sass,scss}' ],
        tasks: ['compass:'+ target]
      }
    }
  });

  //grunt.config.requires('watch.js.files');
  //files = grunt.config('watch.js.files');
  //files = grunt.file.expand(files);

  /*grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function(err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded)
            grunt.log.ok('Delayed live reload successful.');
          else
            grunt.log.error('Unable to make a delayed live reload.');
          done(reloaded);
        });
    }, 500);
  });*/

  grunt.loadNpmTasks('grunt-develop');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');

 // grunt.registerTask('default', ['develop', 'watch']);
  grunt.registerTask('default', [
    'compass:' + target,
    'watch'
    ]);
};
