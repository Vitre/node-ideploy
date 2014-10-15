var sync = require('synchronize')

/**
 * Ideploy backub job
 *
 * @param options
 * @constructor
 */
module.exports = function BackupJob(options) {

    this.options = {
        client: null,
        workspace: null,
        src: null,
        target: null,
        fail: function () {
        },
        success: function () {
        }
    };

    this.client;

    this.workspace;

    this.src;

    this.target;

    this.__initInstance = function (options) {
        this.options = options;

        this.client = this.options.client;
        this.workspace = this.options.workspace;

        this.src = this.options.src;
        this.target = this.options.target;
    };

    this.do = function (options) {

        var src = this.src;
        var target = this.target;
        var client = this.client;

        console.info('Backup job started.', src, target);

        var fetchFile = function (src, target) {
            client.ftp.ls(src, function (err, res) {
                res.forEach(function (file) {

                    if (file.type == 0) {

                        var fileSrc = src + '/' + file.name;
                        var fileTarget = 'test.txt';

                        console.log('Fetching file:', fileSrc, fileTarget);

                        client.ftp.get(fileSrc, fileTarget, function (hadErr) {
                            if (!hadErr) {

                                console.log('File fetched:', fileSrc, fileTarget);
                            }
                        });

                    } else if (file.type == 1) {

                        src += '/' + file.name;
                        target += '/' +  + file.name;

                        fetchFile(src, target);
                    }

                });

            });
        };

        fetchFile(src, target);

        //options.success(this);
    };

    this.__initInstance(options);

};
