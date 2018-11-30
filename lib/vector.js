// 2D Vector class
// VERSION: 0.1
// AUTHOR : John Boelee
// DATE   : 18-03-2017
function Vector2D (x, y) {
    this.x = x || 0;
    this.y = y || 0;
    
    this.dot = function (v) {
        return v.x * this.x + v.y * this.y;
    }
    
    this.magnitude = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
    this.setMagnitude = function (magnitude) {
        var mag = this.magnitude();
        this.scale(magnitude / mag);
    }
    
    this.normalize = function () {
        var mag = this.magnitude();
        this.x /= mag;
        this.y /= mag;
    }
    
    this.add = function (v) {
        this.x += v.x;
        this.y += v.y;
    }
    
    this.subtract = function (v) {
        this.x -= v.x;
        this.y -= v.y;
    }

    this.scale = function (scale) {
        this.x *= scale;
        this.y *= scale;
    }
    
    this.multiply = function (v) {
        this.x *= v.x;
        this.y *= v.y;
    }
    
    this.angle = function (v) {
        return Math.acos(
            this.dot(v) / (this.magnitude() * v.magnitude()));     
    }
    
    this.rotate = function (angle) {
        var m = this.magnitude();
        var a = Math.acos(this.x / m);
        
        a += angle;
        this.x = Math.cos(a) * m;
        this.y = Math.sin(a) * m;
    }
    
    this.setAngle = function (angle) {
        var m = this.magnitude();
        
        this.x = Math.cos(angle) * m;
        this.y = Math.sin(angle) * m;
    }
    
    this.heading = function () {
        return Math.acos(this.x / this.magnitude());
    }
    
    this.limit = function (max) {
        var m = this.magnitude();
        if (m > max) {
            this.scale(max/m);
        }
    }
    
    this.copy = function () {
        return new Vector2D(this.x, this.y);
    }
    
    this.set = function (v) {
        this.x = v.x;
        this.y = v.y;
    }
    
    return this;
}

// 3D Vector class
// VERSION: 0.1
// AUTHOR : John Boelee
// DATE   : 20-07-2017
function Vector3D (x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    
    this.dot = function (v) {
        return  v.x * this.x + 
                v.y * this.y +
                v.z * this.z;
    }
    
    this.magnitude = function () {
        return Math.sqrt(
            this.x * this.x + 
            this.y * this.y +
            this.z * this.z);
    }
    
    this.setMagnitude = function (magnitude) {
        var mag = this.magnitude();
        this.scale(magnitude / mag);
        return this;
    }
    
    this.normalize = function () {
        var mag = this.magnitude();
        this.x /= mag;
        this.y /= mag;
        this.z /= mag;
        return this;
    }
    
    this.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }
    
    this.subtract = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    this.scale = function (scale) {
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        return this;
    }
    
    this.multiply = function (v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    }
    
    this.angle = function (v) {
        return Math.acos(
            this.dot(v) / (this.magnitude() * v.magnitude()));     
    }
    
//    this.rotate = function (angle) {
//        var m = this.magnitude();
//        var a = Math.acos(this.x / m);
//        
//        a += angle;
//        this.x = Math.cos(a) * m;
//        this.y = Math.sin(a) * m;
//    }
    
//    this.setAngle = function (angle) {
//        var m = this.magnitude();
//        
//        this.x = Math.cos(angle) * m;
//        this.y = Math.sin(angle) * m;
//    }
    
//    this.heading = function () {
//        return Math.acos(this.x / this.magnitude());
//    }
    
    this.limit = function (max) {
        var m = this.magnitude();
        if (m > max) {
            this.scale(max/m);
        }
        return this;
    }
    
    this.copy = function () {
        return new Vector3D(this.x, this.y, this.z);
    }
    
    this.set = function (v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }
    
    this.rotateZ = function (angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        // cos -sin 0
        // sin  cos 0
        // 0    0   1
        var x = this.x * cos - this.y * sin;
        var y = this.x * sin + this.y * cos;
        this.x = x;
        this.y = y;
        return this;
    }

    this.rotateY = function (angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        // cos  0 sin
        // 0    1 0
        // -sin 0 cos
        var x = this.x * cos + this.z * sin;
        var z = this.x * -sin + this.z * cos;
        this.x = x;
        this.z = z;
        return this;
    }

    this.rotateX = function (angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        // 1 0    0
        // 0 cos -sin 
        // 0 sin  cos
        var y = this.y * cos - this.z * sin;
        var z = this.y * sin + this.z * cos;
        this.y = y;
        this.z = z;
        return this;
    }

    return this;
}

