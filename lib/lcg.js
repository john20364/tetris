// linear congruential generator
var lcg = (function() {
    var _seed = Date.now();
    var a = 1664525;
    var c = 1013904223;
    var m = Math.pow(2, 32);
    
    return {
        setSeed: function(seed) {
            _seed = seed;
        },

        nextInt: function() {
            // range [0, 2^32)
            _seed = (_seed * a + c) % m;
            return _seed;
        },

        nextFloat: function() {
            // range [0, 1)
            return this.nextInt() / m;
        },

        nextBool: function(percent) {
            // percent is change of getting true
            if (percent == null) {
                percent = 0.5;
            }
            return this.nextFloat() < percent;
        },

        nextFloatRange: function(min, max) {
            if (min == null) return 0;
            
            if (max == null) {
                max = min;
                min = 0;
            }
            
            if (max < min) {
                var temp = max;
                max = min;
                min = temp;
            }
            
            // range [min, max)
            return min + this.nextFloat() * (max - min);
        },

        nextIntRange: function(min, max) {
            // range [min, max)
            return Math.floor(this.nextFloatRange(min, max));
        },

        nextColor: function() {
            // range [#000000, #FFFFFF]
            var c = this.nextIntRange(0, Math.pow(2, 24)).toString(16).toUpperCase();
            while (c.length < 6) {
                c = "0" + c;
            }
            return "#" + c;
        }
        
    };
    
}());