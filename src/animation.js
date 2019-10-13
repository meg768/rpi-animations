var Events  = require('events');


function debug() {
}


module.exports = class Animation extends Events {

    constructor(options = {}) {
        super();

        var {renderFrequency = 0, name = 'Noname', priority = 'normal', iterations = undefined, duration = undefined} = options;

        this.name            = name;
        this.priority        = priority;
        this.cancelled       = false;
        this.duration        = duration;
        this.iterations      = iterations;
        this.renderFrequency = renderFrequency;
        this.renderTime      = 0;

        if (typeof options.debug === 'function') {
            debug = options.debug;
        }
        else if (options.debug) {
            debug = console.log;
        }


    }

    render() {
    }

    start() {
        debug('Starting animation', this.name);

        return new Promise((resolve, reject) => {

            this.cancelled  = false;
            this.renderTime = 0;
            this.iteration  = 0;

            debug('Animation', this.name, 'started.');
            resolve();

            this.emit('started');

        });

    }

    stop() {
        debug('Stopping animation', this.name);

        return new Promise((resolve, reject) => {

            debug('Animation', this.name, 'stopped.');
            resolve();

            this.emit('stopped');
        });
    }


    loop() {

        debug('Running loop', this.name);

        return new Promise((resolve, reject) => {

            var start = new Date();

            var loop = () => {

                var now = new Date();

                if (this.cancelled) {
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

                    if (self.renderFrequency == 0 || now - self.renderTime >= self.renderFrequency) {

                        self.render();
                        self.renderTime = now;
                    }

                    this.iteration++;
                    
                    setImmediate(loop);
                }
            }

            loop();
        });
    }



    cancel() {
        debug('Cancelling animation', this.name);
        this.cancelled = true;
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
                console.log(error);
            })
            .then(() => {
                resolve();
            });

        });

    }
}
