var Ideploy = Ideploy || {};

/**
 * Ideploy deploy job
 *
 * @param options
 * @constructor
 */
Ideploy.DeployJob = function (options) {

    this.options = {
        client: null,
        workspace: null
    };

    this.client;

    this.workspace;

    this.__initInstance = function (options) {
        this.options = options;

        this.client = this.options.client;
        this.workspace = this.options.workspace;
    };

    this.do = function (options) {
        options.success(this);
    };

    this.__initInstance(options);

};
