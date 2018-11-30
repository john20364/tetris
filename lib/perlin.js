var perlin = (function () {
    var grad4 = [   [0,1,1,1], [0,1,1,-1], [0,1,-1,1], [0,1,-1,-1],
                    [0,-1,1,1], [0,-1,1,-1], [0,-1,-1,1], [0,-1,-1,-1],
                    [1,0,1,1], [1,0,1,-1], [1,0,-1,1], [1,0,-1,-1],
                    [-1,0,1,1], [-1,0,1,-1], [-1,0,-1,1], [-1,0,-1,-1],
                    [1,1,0,1], [1,1,0,-1], [1,-1,0,1], [1,-1,0,-1],
                    [-1,1,0,1], [-1,1,0,-1], [-1,-1,0,1], [-1,-1,0,-1],
                    [1,1,1,0], [1,1,-1,0], [1,-1,1,0], [1,-1,-1,0],
                    [-1,1,1,0], [-1,1,-1,0], [-1,-1,1,0], [-1,-1,-1,0]];
              
    // Permutaion table.
    var p = [151,160,137,91,90,15,
 131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
 190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
 88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
 77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
 102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
 135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
 5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
 223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
 129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
 251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
 49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
 138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
    
    // Eight 2D gradient vectors
    var grad2D = [[1,1], [-1,1], [1,-1], [-1,-1],
                 [1,0], [-1,0], [0,1], [0,-1]];
    
    // Twelve 3D gradient vectors
    var grad3D = [[1,1,0], [-1,1,0], [1,-1,0], [-1,-1,0],
                  [1,0,1], [-1,0,1], [1,0,-1], [-1,0,-1],
                  [0,1,1], [0,-1,1], [0,1,-1], [0,-1,-1]];
    
    // 8 slopes [-1, 1]
    slopes = [];
    for (var i = 0; i < 8; i++) {
        slopes[i] = Math.cos((Math.PI / 7) * i);
    }
    
    // Default octaves (Level Of Detail) is 4
    var octaves = 4;
    
    // To remove the need for index wrapping, double the permutation table length
    var perm = [];
    for (i = 0; i < 512; i++) {
        perm[i] = p[i & 255];
    }
    
    // Works not as correct as Math.floor();
    function fastfloor (x) {
        return (x > 0) ? x | 0 : (x - 1) | 0;
    }
    
    // dot2D product
    function dot2D (g, x, y) {
        return g[0] * x + g[1] * y;    
    }
    
    // dot3D product
    function dot3D (g, x, y, z) {
        return g[0] * x + g[1] * y + g[2] * z;    
    }
    
    function mix (a, b, t) {
        return (1.0 - t) * a + t * b;
    }
    
    function fade (t) {
        return t * t * t * (t * (t * 6.0 - 15.0 ) + 10.0);
    }
    
    function normalize_persistence () {
        var res = 0.0;
        var t = 1.0;
        
        for (var i=0; i<octaves; i++) {
            t /= 2.0;
            res += t;
        }
        return octaves > 1 ? 0.5 / res : 1.0;
    }

    return {
        // lod = level of details
        noiseDetail: function (lod) {
            if (lod > 0) octaves = lod;  
        },
        
        // Classic Perlin noise, 1D version
        noise1D: function (x) {
            // Result default = 0 
            var result = 0.0;

            // Persistence
            var persistence = normalize_persistence();

            // Save x value for calculating octaves
            var lx = x;

            for (var octave=0; octave < octaves; octave++) {
                // Find unit line interval containing x
                var ix = fastfloor(lx);

                // Get relative x coordinate within that interval
                var dx = lx - ix;

                // Wrap the line intervals at 255 (smaller integer period can be introduced here)
                ix &= 255;

                // Calculate a set of two hashed slopes indices
                var sli0 = perm[ix] % 8;
                var sli1 = perm[ix + 1] % 8;

                // Calculate noise contributions from each of the two slopes
                var nx0 = slopes[sli0] * dx;
                var nx1 = slopes[sli1] * (dx - 1);

                // Compute the fade curve value for x
                var u = fade (dx);            

                // Interpolate the slope results along x
                var nx = mix (nx0, nx1, u);

                // nx range from -0.5 to 0.5
                // for normalizing from 0 to 1, multiply nx by 2, add 1 and devide result by 2
                var temp = (nx * 2.0 + 1.0) / 2.0;
                result += temp * persistence;

                // if octaves > 1 then increase step size by 2 and
                // divide persistence by 2
                lx *= 2.0;
                persistence /= 2.0;
            }
            return result;
        },
        
        // Classic Perlin noise, 2D version
        noise2D: function (x, y) {
            // Result default = 0 
            var result = 0.0;

            // Persistence
            var persistence = normalize_persistence();

            // Save x, y values for calculating octaves
            var lx = x;
            var ly = y;

            for (var octave=0; octave < octaves; octave++) {
                // Find unit grid cell containing point
                var ix = fastfloor(lx);
                var iy = fastfloor(ly);

                // Get relative xy coordinates of point within that cell
                var dx = lx - ix;
                var dy = ly - iy;

                // Wrap the integer cells at 255 (smaller integer period can be introduced here)
                ix &= 255;
                iy &= 255;

                // Calculate a set of four hashed gradient indices
                var gi00 = perm[ix + perm[iy]] % 8;
                var gi10 = perm[ix + 1 + perm[iy]] % 8;
                var gi01 = perm[ix + perm[iy + 1]] % 8;
                var gi11 = perm[ix + 1 + perm[iy + 1]] % 8;

                // Calculate noise contributions from each of the four corners
                var n00 = dot2D (grad2D[gi00], dx, dy);
                var n10 = dot2D (grad2D[gi10], dx - 1, dy);
                var n01 = dot2D (grad2D[gi01], dx, dy - 1);
                var n11 = dot2D (grad2D[gi11], dx - 1, dy - 1);

                // Compute the fade curve value for each of x, y
                var u = fade (dx);
                var v = fade (dy);

                // Interpolate along x the contributions from each of the corners
                var nx0 = mix (n00, n10, u);
                var nx1 = mix (n01, n11, u);

                // Interpolate the two last results along y
                var nxy = mix (nx0, nx1, v);

                // nxy range from -1 to 1
                // for normalizing from 0 to 1 add 1 and devide result by 2
                var temp = (nxy + 1.0) / 2.0;
                result += temp * persistence;

                // if octaves > 1 then increase step size by 2 and
                // divide persistence by 2
                lx *= 2.0;
                ly *= 2.0;
                persistence /= 2.0;
            }
            return result;
        },
        
        // Classic Perlin noise, 3D version
        noise3D: function (x, y, z) {
            // Result default = 0 
            var result = 0.0;

            // Persistence
            var persistence = normalize_persistence();

            // Save x, y, z values for calculating octaves
            var lx = x;
            var ly = y;
            var lz = z;

            for (var octave=0; octave < octaves; octave++) {
                // Find unit grid cell containing point
                var ix = fastfloor(lx);
                var iy = fastfloor(ly);
                var iz = fastfloor(lz);

                // Get relative xyz coordinates of point within that cell
                var dx = lx - ix;
                var dy = ly - iy;
                var dz = lz - iz;

                // Wrap the integer cells at 255 (smaller integer period can be introduced here)
                ix &= 255;
                iy &= 255;
                iz &= 255;

                // Calculate a set of four hashed gradient indices
                var gi000 = perm[ix + perm[iy + perm[iz]]] % 12;
                var gi001 = perm[ix + perm[iy + perm[iz + 1]]] % 12;
                var gi010 = perm[ix + perm[iy + 1 + perm[iz]]] % 12;
                var gi011 = perm[ix + perm[iy + 1 + perm[iz + 1]]] % 12;
                var gi100 = perm[ix + 1 + perm[iy + perm[iz]]] % 12;
                var gi101 = perm[ix + 1 + perm[iy + perm[iz + 1]]] % 12;
                var gi110 = perm[ix + 1 + perm[iy + 1 + perm[iz]]] % 12;
                var gi111 = perm[ix + 1 + perm[iy + 1 + perm[iz + 1]]] % 12;

                // Calculate noise contributions from each of the eight corners
                var n000 = dot3D (grad3D[gi000], dx, dy, dz);
                var n100 = dot3D (grad3D[gi100], dx - 1, dy, dz);
                var n010 = dot3D (grad3D[gi010], dx, dy - 1, dz);
                var n110 = dot3D (grad3D[gi110], dx - 1, dy - 1, dz);
                var n001 = dot3D (grad3D[gi001], dx, dy, dz - 1);
                var n101 = dot3D (grad3D[gi101], dx - 1, dy, dz - 1);
                var n011 = dot3D (grad3D[gi011], dx, dy - 1, dz - 1);
                var n111 = dot3D (grad3D[gi111], dx - 1, dy - 1, dz - 1);

                // Compute the fade curve value for each of x, y, z
                var u = fade (dx);
                var v = fade (dy);
                var w = fade (dz);

                // Interpolate along x the contributions from each of the corners
                var nx00 = mix (n000, n100, u);
                var nx01 = mix (n001, n101, u);
                var nx10 = mix (n010, n110, u);
                var nx11 = mix (n011, n111, u);

                // Interpolate the four last results along y
                var nxy0 = mix (nx00, nx10, v);
                var nxy1 = mix (nx01, nx11, v);

                // Interpolate the two last results along z
                var nxyz = mix (nxy0, nxy1, w);

                // nxyz range from -1 to 1
                // for normalizing from 0 to 1 add 1 and devide result by 2
                var temp = (nxyz + 1.0) / 2.0;
                result += temp * persistence;

                // if octaves > 1 then increase step size by 2 and
                // divide persistence by 2
                lx *= 2.0;
                ly *= 2.0;
                lz *= 2.0
                persistence /= 2.0;
            }
            return result;
        },
        
        simpleNoise2D: function (xin, yin) {
            // Noise contributions from the three corners
            var n0, n1, n2; 
            
            // Skew the input space to determine which simplex cell we're in
            var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
            var s = (xin + yin) * F2; // Hairy factor for 2D
            var i = fastfloor(xin + s);
            var j = fastfloor(yin + s);
            var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
            var t = (i + j) * G2;
            var X0 = i - t; // Unskew the cell origin back to (x,y) space
            var Y0 = j - t;
            var x0 = xin - X0; // The x,y distances from the cell origin
            var y0 = yin - Y0;

            // For the 2D case, the simplex shape is an equilateral triangle.
            // Determine which simplex we are in.
            var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
            if(x0 > y0) {i1 = 1; j1 = 0;} // lower triangle, XY order: (0,0)->(1,0)->(1,1)
            else {i1 = 0; j1 = 1;} // upper triangle, YX order: (0,0)->(0,1)->(1,1)
            
            // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
            // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
            // c = (3-sqrt(3))/6
            var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
            var y1 = y0 - j1 + G2;
            var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
            var y2 = y0 - 1.0 + 2.0 * G2;            
            
            // Work out the hashed gradient indices of the three simplex corners
            var jj = j & 255;
            var ii = i & 255;
            var gi0 = perm[ii + perm[jj]] % 8;
            var gi1 = perm[ii + i1 + perm[jj + j1]] % 8;
            var gi2 = perm[ii + 1 + perm[jj + 1]] % 8;
            
            // Calculate the contribution from the three corners
            var t0 = 0.5 - x0 * x0 - y0 * y0;
            if(t0 < 0) n0 = 0.0;
            else {
                t0 *= t0;
                n0 = t0 * t0 * dot2D(grad2D[gi0], x0, y0); // (x,y) of grad3 used for 2D gradient
            }
            
            var t1 = 0.5 - x1 * x1 - y1 * y1;
            if(t1 < 0) n1 = 0.0;
            else {
                t1 *= t1;
                n1 = t1 * t1 * dot2D(grad2D[gi1], x1, y1);
            }
            
            var t2 = 0.5 - x2 * x2 - y2 * y2;
            if(t2 < 0) n2 = 0.0;
            else {
                t2 *= t2;
                n2 = t2 * t2 * dot2D(grad2D[gi2], x2, y2);
            }

            // Add contributions from each corner to get the final noise value.
            // The result is scaled to return values in the interval [-1,1].
            var result = 70.0 * (n0 + n1 + n2);            
            
            // convert [-1,1] to [0, 1];
            result = (result + 1.0) / 2.0;
            return result;
        },
        
        simpleNoise3D: function (x, y, z) {
            // Todo
            return 0;
        },
        
        simpleNoise4D: function (x, y, z, w) {
            // Todo
            return 0;
        }
    };
}());
