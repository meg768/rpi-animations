var Events = require('events');

module.exports = class Animation extends Events {

    constructor(options = {}) {
        super();

        var {debug, renderFrequency, name = 'Noname', priority = 'normal', iterations = undefined, duration = undefined} = options;

        this.name            = name;
        this.priority        = priority;
        this.cancelled       = false;
        this.duration        = duration;
        this.iterations      = iterations;
        this.renderFrequency = renderFrequency;
        this.renderTime      = 0;
        this.debug           = () => {};

        if (typeof debug === 'function') {
            this.debug = debug;
        }
        else if (debug) {
            this.debug = console.log;
        }

    }

    render() {
    }

    start() {
        this.debug('Starting animation', this.name);

        return new Promise((resolve, reject) => {

            this.cancelled  = false;
            this.renderTime = 0;
            this.iteration  = 0;

            this.debug('Animation', this.name, 'started.');
            resolve();

            this.emit('started');
        });

    }

    stop() {
        this.debug('Stopping animation', this.name);

        return new Promise((resolve, reject) => {
            this.debug('Animation', this.name, 'stopped.');

            resolve();
            this.emit('stopped');
        });
    }


    loop() {
        this.debug('Running loop', this.name);
        var start = new Date();

        return new Promise((resolve, reject) => {

            var render = () => {
                this.debug('Rendering...');
                this.render();
                this.renderTime = new Date();
            };

            var loop = () => {
                var now = new Date();

                if (this.cancelled) {
                    this.emit('cancelled');
                    this.emit('canceled');
            
                    resolve();
                }
                else if (this.duration != undefined && (this.duration >= 0 && now - start > this.duration)) {
                    resolve();
                }
                else if (this.iterations != undefined && (this.iteration >= this.iterations)) {
                    resolve();
                }
                else {
                    var now = new Date();

                    if (this.iterations || this.renderFrequency == undefined || this.renderFrequency == 0 || now - this.renderTime >= this.renderFrequency) {
                        render();
                    }

                    this.iteration++;

                    setImmediate(loop);
                }
            }

            loop();
        });
    }

    cancel() {
        this.debug('Cancelling animation', this.name);
        this.cancelled = true;
        this.emit('cancelling');
        this.emit('canceling');
    }

    run(options) {

        if (options) {
            var {priority = this.priority, duration = this.duration} = options;

            this.priority  = priority;
            this.duration  = duration;
    
        }

        return new Promise((resolve, reject) => {

            this.start().then(() => {
                return this.loop();
            })
            .then(() => {
                return this.stop();
            })
            .catch((error) => {
                this.debug(error);
            })
            .then(() => {
                resolve();
            });

        });

    }
}
