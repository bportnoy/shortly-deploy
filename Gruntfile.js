module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist:{
        src: ['public/client/app.js','public/client/link.js','public/client/links.js',
        'public/client/linkView.js','public/client/linksView.js',
        'public/client/createLinkView.js','public/client/router.js'],
        dest: 'public/dist/shortlyd.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      my_target:{
        files:{
          'public/dist/shortlyd.min.js': ['public/dist/shortlyd.js']
        }
      }
    },

    git_deploy: {
    your_target: {
      options: {
        url: 'https://bportnoy@shortlyd.scm.azurewebsites.net:443/shortlyd.git'
      },
      src: './'
    },
  },


    jshint: {
      // files: {
        beforeconcat: ['public/client/*.js','app/**/*.js','lib/*.js','./*.js'],
        afterconcat: ['public/dist/shortlyd.min.js','public/dist/shortlyd.js'],
      // },
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-git-deploy');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', ['jshint:beforeconcat','concat','uglify','jshint:afterconcat']);

  grunt.registerTask('deploy', function(n) {
    if(grunt.option('prod')) {
      grunt.task.run([  'mochaTest',
                        'jshint:beforeconcat',
                        'concat',
                        'uglify',
                        'git_deploy' ]);}
     else {
      grunt.task.run([  'mochaTest',
                        'jshint:beforeconcat',
                        'concat',
                        'uglify',
                        'server-dev' ]);
    }
  });

  // grunt.registerTask('deploy', ['mochaTest',
  //                               'jshint:beforeconcat',
  //                               'concat',
  //                               'uglify',
  //   ]
  // );


};
