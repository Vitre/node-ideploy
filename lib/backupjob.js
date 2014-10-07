/**
 * Ideploy backub job
 *
 * @param options
 * @constructor
 */
module.exports = function BackupJob(options) {

    this.options = {
        success: function () {
        }
    };

    this.__initInstance = function (options) {
        this.options = options;
    };

    this.do = function (options) {
        options.success(this);
    };

    this.__initInstance(options);

};
