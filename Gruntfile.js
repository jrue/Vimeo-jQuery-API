module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // clean tasks
    clean: {
        // target all output files
        all: ['dist/*.*']
    },

    //lint tasks
    jshint: {
      files: ['Gruntfile.js', 'src/jquery.vimeo.api.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },

    concat: {
      options: {
           banner:
          '/**!\n' +
          ' * <%= pkg.title %> -- By <%= pkg.author.name %>\n' +
          ' * \n' +
          ' * Description: <%= pkg.description %>\n' +
          ' * Author: <%= pkg.author.name %>, <%= pkg.author.email %> \n' +
          ' * License: <%= pkg.license %>\n' +
          ' * Version: <%= pkg.version %>\n' +
          ' */\n'
      },

      dist: {
          src: ['src/jquery.vimeo.api.js'],
          dest: 'dist/jquery.vimeo.api.js',
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        files : {
           'dist/jquery.vimeo.api.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    //bump version up https://www.npmjs.com/package/grunt-bumpup
    bumpup: {
        files: [
            'package.json',
            'bower.json',
            'vimeoapi.jquery.json'
        ],
    }


  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-bumpup');

  // Default task(s).
  grunt.registerTask('default', ['clean','concat','jshint','uglify']);

};