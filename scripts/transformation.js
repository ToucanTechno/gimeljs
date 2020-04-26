class Transformation {
    /* Column major representation for 4x4 matrices */
    constructor() {
        // Create an identity transformation
        this.fields = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }

    // Multiply matrices, to chain transformations
    mult(t) {
        let output = new Transformation();
        for (let row = 0; row < 4; ++row) {
            for (let col = 0; col < 4; ++col) {
                let sum = 0;
                for (let k = 0; k < 4; ++k) {
                    sum += this.fields[k * 4 + row] * t.fields[col * 4 + k];
                }
                output.fields[col * 4 + row] = sum;
            }
        }
        return output;
    }

    // Multiply by translation matrix
    translate(x, y, z) {
        let mat = new Transformation();
        mat.fields[12] = Number(x) || 0;
        mat.fields[13] = Number(y) || 0;
        mat.fields[14] = Number(z) || 0;
        return this.mult(mat);
    }

    // Multiply by scaling matrix
    scale(x, y, z) {
        let mat = new Transformation();
        mat.fields[0] = Number(x) || 0;
        mat.fields[5] = Number(y) || 0;
        mat.fields[10] = Number(z) || 0;
        return this.mult(mat);
    }

    // Multiply by rotation matrix around X axis
    rotateX(angle) {
        angle = Number(angle) || 0;
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let mat = new Transformation();
        mat.fields[5] = c;
        mat.fields[10] = c;
        mat.fields[9] = -s;
        mat.fields[6] = s;
        return this.mult(mat);
    }

    // Multiply by rotation matrix around Y axis
    rotateY(angle) {
        angle = Number(angle) || 0;
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let mat = new Transformation();
        mat.fields[0] = c;
        mat.fields[10] = c;
        mat.fields[2] = -s;
        mat.fields[8] = s;
        return this.mult(mat);
    }

    // Multiply by rotation matrix around Z axis
    rotateZ(angle) {
        angle = Number(angle) || 0;
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let mat = new Transformation();
        mat.fields[0] = c;
        mat.fields[5] = c;
        mat.fields[4] = -s;
        mat.fields[1] = s;
        return this.mult(mat);
    }

    sendToGpu(gl, uniform, transpose) {
        gl.uniformMatrix4fv(uniform, transpose || false, new Float32Array(this.fields))
    }
}
