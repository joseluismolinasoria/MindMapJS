module.exports = function(grunt) {
    var config = {
	pkg: grunt.file.readJSON('package.json'),

	concat: {
	    options: {
		separator: ';'
	    },
	    source: {
		src:  ['src/*.js'],
		dest: 'dist/<%= pkg.name %>-v<%= pkg.version %>.js'
	    }
	},

	replace: {
	    dev: {
		options: {
		    variables: {
			version: '<%= pkg.version %>',
			date: '<%= grunt.template.today("yyyy-mm-dd") %>'
		    },
		    prefix: '@@'
		},
		
		files: [{
		    src: ['dist/<%= pkg.name %>-v<%= pkg.version %>.js'], 
		    dest: 'dist/<%= pkg.name %>-v<%= pkg.version %>.js'
		}]
	    },
	    prod: {
		options: {
		    variables: {
			version: '<%= pkg.version %>'
		    },
		    prefix: '@@'
		},
		files: [{
		    src: ['dist/<%= pkg.name %>-v<%= pkg.version %>.min.js'], 
		    dest: 'dist/<%= pkg.name %>-v<%= pkg.version %>.min.js'
		}]
	    }
	},

	uglify: {
	    options: {
		banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> Por José Luis Molina Soria */\n'
	    },
	    build: {
		files: {
		    'dist/<%= pkg.name %>-v<%= pkg.version %>.min.js': 'dist/<%= pkg.name %>-v<%= pkg.version %>.js'
		}
	    }
	},

	clean: {
	    build: ['dist/*']
	},

	jshint: {
	    options: {
		laxbreak: true,
		curly: true,
		eqnull: true,
		eqeqeq: true,
		undef: true,
		browser: true, 
//		immed: true,
		latedef: true,
		newcap: true,
		noarg: true,
		sub: true,
		boss: true,
		globals: {
		    console: true,
		    window : true,
		    module: true,
		    MM : true,
		    Kinetic : true,
		    require : true,
		    ActiveXObject : true,
		    FileReader : true,
		    DOMParser : true,
		    Blob : true,
		    alert : true
		}		
	    },
	    all : ['src/*.js']
	},

	jsdoc : {
            dist : {
		src: ['src/*.js'], 
		options: {
                    destination: 'docs/jsdocs/'
		}
            }
	},
	
	mochaTest: {
	    test: {
		options: {
		    reporter: 'spec',
		    require: 'should'
		},
		src: ['test/**/*-test.js']
	    }
	}

    };
    
    grunt.initConfig(config);
    
    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-mocha-test');

    // Tasks
    grunt.registerTask('dev', ['clean', 'concat:source', 'replace:dev']);
    grunt.registerTask('full', ['clean', 'concat:source', 'replace:dev', 'uglify', 'replace:prod']);
    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('hint', ['jshint']);
    grunt.registerTask('jsdoc', ['jsdoc']); // no funca :(( utilizar el script "jsdoc.sh"
};
