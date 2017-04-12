module.exports = function (grunt) {
    grunt.initConfig({
        sass: {
            dist: {
                sourceMap: true,
                files: {
                    'css/main.css': 'sass/main.scss'
                }
            }
        },
        watch: {
            files: ['**/*.scss'],
            tasks: ['sass'],
            options: {
                spawn: false,
            },
        }
    });

    grunt.loadNpmTasks("grunt-contrib-sassjs");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask('default', ['sass', 'watch']);
};