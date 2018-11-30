function Gaussian(height, position, deviation) {
    this.height = height || 1;
    this.position = position || 0;
    this.deviation = deviation || 1;
    
    // f(x) = a * exp ^((x - b)^2 / 2 * c^2)
    // The parameter a is the height of the curve's peak, b is the position of the
    // center of the peak and c (the standard deviation, sometimes called the Gaussian
    // RMS width) controls the width of the "bell".
    this.f = function(x) {
        var numerator = -1 * (x - this.position) * (x - this.position);
        var dominator = 2 * this.deviation * this.deviation;
        var res = this.height * Math.exp(numerator / dominator);
        return res;
    }
    
    this.random = function() {
        var y = Math.random() * this.height;
        if (y <= 0.0000001) y = 0.0000001;

        // Inverse function
        var part = -2 * this.deviation * this.deviation * Math.log(y / this.height);
        
        var right = this.position + Math.sqrt(part);
        var left  = this.position - Math.sqrt(part);

        var range = right - left;
        // max return values between -3 * deviation and 
        // 3 * deviation)
        return Math.random() * range - range / 2;
    }
    
    return this;
}