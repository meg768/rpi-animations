var Color = require('color');

function debug() {
}

module.exports = class Pixels {

        constructor(options) {

			options = options || {};

			if (options.width == undefined || options.height == undefined)
	            throw new Error('Width and height must be specified.');

			this.width  = options.width;
			this.height = options.height;
			this.pixels = new Uint32Array(this.width * this.height);

			if (typeof options.debug === 'function') {
				debug = options.debug;
			}
			else if (options.debug) {
				debug = console.log;
			}
	
        }


        RGB(red, green, blue) {        
            return ((red << 16) | (green << 8) | blue);
        }

        HSL(h, s, l) {
            return Color.hsl(h, s, l).rgbNumber();
        }

		color(name) {
			return Color(name).rgbNumber();
		}

        fill(color) {
            if (typeof color == 'string')
                color = Color(color).rgbNumber();
    
            for (var i = 0; i < this.pixels.length; i++)
                this.pixels[i] = color;
        }

        clear() {
            this.fill(0);
        }

		setPixel(x, y, color) {
            this.pixels[y * this.width + x] = color;
        }

        getPixel(x, y) {
            return this.pixels[y * this.width + x];
		}
		
        setPixelColor(x, y, color) {
            this.pixels[y * this.width + x] = color;
        }

        getPixelColor(x, y) {
            return this.pixels[y * this.width + x];
        }
    
        setPixelRGB(x, y, red, green, blue) {
            this.pixels[y * this.width + x] = this.RGB(red, green, blue);
        }
 
        setPixelHSL(x, y, h, s, l) {
            this.pixels[y * this.width + x] = this.HSL(h, s, l);
        }
 
}
