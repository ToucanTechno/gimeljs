class Renderer {
    constructor(canvas) {
        let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        gl.enable(gl.DEPTH_TEST);
        this.gl = gl;
    }

    setClearColor(red, green, blue) {
        this.gl.clearColor(red / 255, green / 255, blue / 255, 1);
    }

    getContext() {
        return this.gl;
    }

    setShader(shader) {
        this.shader = shader;
    }

    render(camera, light, objects) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        let shader = this.shader;
        if (!shader) {
            return;
        }
        shader.use();
        light.use(shader);
        camera.use(shader);
        objects.forEach(function (mesh) {
            mesh.draw(shader);
        });
    }
}

class GLBuffer {
    constructor(gl, data, count) {
        // Creates buffer object in GPU RAM where we can store anything
        let bufferObject = gl.createBuffer();
        // Tell which buffer object we want to operate on as a VBO
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferObject);
        // Write the data, and set the flag to optimize
        // for rare changes to the data we're writing
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        this.gl = gl;
        this.size = data.length / count;
        this.count = count;
        this.data = bufferObject;
    }

    destroy() {
        // Free memory that is occupied by our buffer object
        this.gl.deleteBuffer(this.data)
    }

    bindToAttribute(attribute) {
        let gl = this.gl;
        // Tell which buffer object we want to operate on as a VBO
        gl.bindBuffer(gl.ARRAY_BUFFER, this.data);
        // Enable this attribute in the shader
        gl.enableVertexAttribArray(attribute);
        // Define format of the attribute array. Must match parameters in shader
        gl.vertexAttribPointer(attribute, this.size, gl.FLOAT, false, 0, 0);
    }
}

class MeshManager {
    constructor(gl, geometry, texture) {
        let vertexCount = geometry.vertexCount();
        this.positions = new GLBuffer(gl, geometry.positions(), vertexCount);
        this.normals = new GLBuffer(gl, geometry.normals(), vertexCount);
        this.uvs = new GLBuffer(gl, geometry.uvs(), vertexCount);
        this.texture = texture;
        this.vertexCount = vertexCount;
        this.position = new Transformation();
        this.gl = gl;
    }

    destroy() {
        this.positions.destroy();
        this.normals.destroy();
        this.uvs.destroy();
    }

    draw(shaderProgram) {
        this.positions.bindToAttribute(shaderProgram.position);
        this.normals.bindToAttribute(shaderProgram.normal);
        this.uvs.bindToAttribute(shaderProgram.uv);
        this.position.sendToGpu(this.gl, shaderProgram.model);  // Identity matrix
        this.texture.use(shaderProgram.diffuse, 0);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount);
    }

    static load(gl, modelUrl, textureUrl) {
        let geometry = Geometry.loadOBJ(modelUrl);
        let texture = Texture.load(gl, textureUrl);
        return Promise.all([geometry, texture]).then(function (params) {
            return new MeshManager(gl, params[0], params[1]);
        })
    }
}
