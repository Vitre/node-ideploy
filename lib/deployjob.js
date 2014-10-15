/**
 * Ideploy deploy job
 *
 * @param options
 * @constructor
 */
module.exports = function DeployJob(options) {

    this.options = {
        client: null,
        workspace: null,
        fail: function () {
        },
        success: function () {
        }
    };

    this.client;

    this.workspace;

    this.__initInstance = function (options) {
        this.options = options;

        this.client = this.options.client;
        this.workspace = this.options.workspace;
    };

    this.do = function (options) {
        console.info('Deploy job started.');

        options.success(this);
    };

    this.__initInstance(options);

};
