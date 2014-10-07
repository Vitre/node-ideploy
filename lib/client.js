/**
 * Ideploy client object
 *
 * @param options
 * @constructor
 */
'use strict';

var JSFtp = require('JSFtp');
var Workspace = require('./Workspace.js');
var DeployJob = require('./DeployJob.js');
var BackupJob = require('./BackupJob.js');

module.exports = function Client(options) {

    /**
     * Options
     *
     * @type {{}}
     */
    this.options = {
        host: null,
        username: null,
        password: null,
        port: 21,
        src: null,
        target: null,
        verbose: false,
        debug: false,
        workspace: '.ideploy'
    };

    /**
     * Log storage
     *
     * @type {{items: Array, files: Array, folders: Array}}
     */
    this.log = {
        items: [],
        files: [],
        folders: []
    };

    /**
     * Client instance
     *
     * @type {object}
     */
    this.ftp;

    /**
     * Verbose flag
     *
     * @type {boolean}
     */
    this.verbose = false;

    /**
     * Debug flag
     * @type {boolean}
     */
    this.debug = false;

    /**
     * Local CWD
     *
     * @type {string}
     */
    this.lcwd;

    /**
     * Remote CWD
     *
     * @type {string}
     */
    this.rcwd;

    /**
     * Async done handler
     */
    this.doneHandler = function () {
    };

    /**
     * Workspace object
     *
     * @type {object}
     */
    this.workspace;

    /**
     * Init instance
     * @param options
     */
    this.__initInstance = function (options) {
        this.options = options;

        // CLI
        if (typeof this.options.debug != 'undefined') {
            this.debug = this.options.debug;
        }

        if (typeof this.options.verbose != 'undefined') {
            this.verbose = this.options.verbose;
        }

        // Workspace
        this.initWorkspace(this.options.workspace || '.ideploy');

    };

    this.initWorkspace = function (workspace) {
        this.workspace = new Workspace({
            name: workspace.name,
            path: workspace.path
        });
        this.workspace.init();
    };

    /**
     * Options validator
     *
     * @returns {Array}
     */
    this.validate = function () {
        var errors = [];
        if (typeof this.options.host == 'undefined' || this.options.host.length == 0) {
            errors.push('Undefined host');
        }
        if (typeof this.options.username == 'undefined' || this.options.username.length == 0) {
            errors.push('Undefined username');
        }
        if (typeof this.options.password == 'undefined' || this.options.password.length == 0) {
            errors.push('Undefined password');
        }
        if (typeof this.options.port == 'undefined' || this.options.port.length == 0) {
            errors.push('Undefined port');
        }

        return errors;
    };

    /**
     * Options validation getter
     *
     * @returns {boolean}
     */
    this.isValid = function () {
        this.errors = this.validate();

        return this.errors.length === 0;
    }

    /**
     * Begin event
     */
    this.begin = function (success, fail) {
        return this.connectSftp(success, fail);
    };

    /**
     * End event
     */
    this.end = function () {
        this.setDone(true);
    };

    /**
     * Done setter
     *
     * @param value
     */
    this.setDone = function (value) {
        this.doneHandler(true);
    };

    /**
     * Deploy call
     */
    this.deploy = function () {
        (function (_this) {
            _this.begin(function () {

                var job = new DeployJob({
                    client: _this,
                    workspace: _this.workspace
                });

                job.do({
                    success: function () {
                        _this.end();
                    },
                    fail: function () {
                        _this.end();
                    }
                });

            }, function () {
                _this.end();
            });

        })(this);
    };

    /**
     * Client connector
     */
    this.connectSftp = function (success, failed) {

        var options = {
            host: this.options.host,
            port: this.options.port || 21,
            user: this.options.username,
            pass: this.options.password,
            debugMode: this.debug
        };

        console.info('JSFtp connecting...');

        var c = this.ftp = new JSFtp(options);

        if (this.verbose) {
            this.ftp.on('jsftp_debug', function (eventType, data) {
                console.log('DEBUG: ', eventType);
                console.log(JSON.stringify(data, null, 2));
            });
        }

        this.ftp.on('error', function (err) {
            console.error(err.code);
        });

        console.info('JSFtp auth...'/*, this.options.username + ':' + this.options.password*/);

        this.ftp.auth(this.options.username, this.options.password, function (err, data) {
            if (err) {
                console.error('JSFtp auth failed'['red'], err);

                return failed();

            } else {
                console.info('JSFtp auth successful'['green']);

                return success();
            }
        });


    };

    /**
     * Done handler setter
     *
     * @param handler
     */
    this.setDoneHandler = function (handler) {
        this.doneHandler = handler;
    };

    this.__initInstance(options);
};
