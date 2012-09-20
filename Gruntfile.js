module.exports = function( grunt ) {
  'use strict';



    //
  // Grunt configuration:
  //
  // https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
  //
  // grunt.log.writeln("dsfsdsdfsdf");

  grunt.initConfig({

    // Project configuration
    // ---------------------

    // specify an alternate install location for Bower
    bower: {
      dir: 'app/scripts/vendor'
    },

      test:{},
    // Coffee to JS compilation
    coffee: {
      dist: {
        src: 'app/scripts-stage/**/*.coffee',
        dest: 'app/scripts-stage'
      }
    },

    // compile .scss/.sass to .css using Compass
    compass: {
      dist: {
        // http://compass-style.org/help/tutorials/configuration-reference/#configuration-properties
        options: {
          css_dir: 'temp/styles',
          sass_dir: 'app/styles',
          images_dir: 'app/images',
          javascripts_dir: 'temp/scripts',
          force: true
        }
      }
    },

    // generate application cache manifest
    manifest:{
      dest: ''
    },

    // headless testing through PhantomJS
    mocha: {
      all: ['test/**/*.html']
    },

    // default watch configuration
    watch: {
      coffee: {
        files: '<config:coffee.dist.src>',
        tasks: 'coffee reload'
      },
      compass: {
        files: [
          'app/styles/**/*.{scss,sass}'
        ],
        tasks: 'compass reload'
      },
      reload: {
        files: [
          'app/*.html',
          'app/styles/**/*.css',
          'app/scripts/**/*.js',
          'app/images/**/*'
        ],
        tasks: 'reload'
      }
    },

    // default lint configuration, change this to match your setup:
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#lint-built-in-task
    lint: {
      files: [
        'Gruntfile.js',
        'script-stage/**/*.js'
      ]
    },

    // specifying JSHint options and globals
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#specifying-jshint-options-and-globals
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },

    // Build configuration
    // -------------------

    // the staging directory used during the process
    staging: 'temp',
    // final build output
    output: 'dist',

    mkdirs: {
      staging: 'app/'
    },

    // Below, all paths are relative to the staging directory, which is a copy
    // of the app/ directory. Any .gitignore, .ignore and .buildignore file
    // that might appear in the app/ tree are used to ignore these values
    // during the copy process.

    // concat css/**/*.css files, inline @import, output a single minified css
    css: {
      'styles/main.css': ['styles/**/*.css']
    },

    // renames JS/CSS to prepend a hash of their contents for easier
    // versioning
    rev: {
      js: 'scripts/**/*.js',
      css: 'styles/**/*.css',
      img: 'images/**'
    },

    // usemin handler should point to the file containing
    // the usemin blocks to be parsed
    'usemin-handler': {
      html: 'index.html'
    },

    // update references in HTML/CSS to revved files
    usemin: {
      html: ['**/*.html'],
      css: ['**/*.css']
    },

    // HTML minification
    html: {
      files: ['**/*.html']
    },

    // Optimizes JPGs and PNGs (with jpegtran & optipng)
    img: {
      dist: '<config:rev.img>'
    },

    // rjs configuration. You don't necessarily need to specify the typical
    // `path` configuration, the rjs task will parse these values from your
    // main module, using http://requirejs.org/docs/optimization.html#mainConfigFile
    //
    // name / out / mainConfig file should be used. You can let it blank if
    // you're using usemin-handler to parse rjs config from markup (default
    // setup)
    rjs: {
      // no minification, is done by the min task
      optimize: 'none',
      baseUrl: './scripts',
      wrap: true,
      name: 'main'
    },

    // While Yeoman handles concat/min when using
    // usemin blocks, you can still use them manually
    concat: {
      dist: ''
    },

    min: {
      dist: ''
    },

    purge: {
        js: {
            dirs: ['scripts-stage/']
        }
    }

  });

    // Alias the `test` task to run the `mocha` task instead
    grunt.registerTask('test', 'mocha');

    grunt.renameTask('copy', 'oldCopy');
    var path = require('path'),
        fs = require('fs');

    grunt.registerMultiTask('purge', 'purge unneeded files', function() {
        grunt.log.writeln("this is purge");
        var dirs = this.data.dirs;
        var files = this.data.files;
        var existsSync = fs.existsSync || path.existsSync;

        var fileArr, filePath, dlen, flen;
        var i, j = 0;

        grunt.log.writeln("+++");
        grunt.log.writeln(JSON.stringify(dirs));
        grunt.log.writeln(JSON.stringify(files));
        grunt.log.writeln("---");

        grunt.log.writeln("*** tick ***");
        if (dirs && dirs.length > 0) {
            for (i = 0, dlen = dirs.length; i < dlen; i += 1) {


                if (existsSync(dirs[i])) {
                    grunt.log.writeln("*** tock ***");
                    try {
                        fileArr = fs.readdirSync(dirs[i]);
                        grunt.log.writeln("*** grind ***");
                    } catch(e) {
                        grunt.log.writeln('cant read directoty. cause by error message :', e);
                        return;
                    }
                    if (fileArr.length > 0) {
                        for(j = 0, flen = fileArr.length; j < flen; j += 1) {
                            filePath = dirs[i] + fileArr[j];
                            if (fs.statSync(filePath).isFile()) {
                                fs.unlinkSync(filePath);
                            }
                        }
                    }
                    grunt.log.writeln("*** boom ***");
                    fs.rmdirSync(dirs[i]);
                    grunt.log.writeln(dirs[i],'has been deleted.');
                }
            }
        }

        if (files && files.length > 0) {
            for (i = 0, flen = files.length; i < flen; i += 1) {
                try {
                    if (fs.statSync(files[i]).isFile()) {
                        fs.unlinkSync(files[i]);
                    }
                } catch (er) {	// if there is no such file or directory
                    if (er.code === "ENOENT") {
                        return;
                    }
                    throw er;
                }
                grunt.log.writeln(files[i], 'has been deleted.');
            }
        }


        grunt.log.writeln('exit purge');
    });

    grunt.registerTask('copy', 'purge oldCopy');
};
