/**
 * Ideploy workspace object
 *
 * @param options
 * @constructor
 */
module.exports = function Workspace(options) {

    /**
     * Workspace options
     * @type {{name: string, path: null}}
     */
    this.options = {
        name: 'unnamed',
        path: null
    };

    /**
     * Workspace name
     */
    this.name;

    /**
     * FS path
     */
    this.path;

    /**
     * Instance init
     *
     * @param options
     * @private
     */
    this.__initInstance = function (options) {
        this.options = options;

        this.name = this.options.name;
        this.path = this.options.path;
    };

    /**
     * Workspace init
     */
    this.init = function () {
        console.log('Workspace init.', this.name, this.path);
        if (!fss.isDir(this.path)) {
            console.log('Creating workspace dir.', this.name, this.path);
            fss.mkdir(this.path);
        }
    };

    this.__initInstance(options);
};
