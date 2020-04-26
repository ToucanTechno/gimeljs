class ShaderProgram {
    constructor(gl, vertex_shader_source, fragment_shader_source) {
        let vertex_shader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertex_shader, vertex_shader_source);
        gl.compileShader(vertex_shader);
        if (!gl.getShaderParameter(vertex_shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(vertex_shader));
            throw new Error('Failed to compile shader');
        }

        let fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragment_shader, fragment_shader_source);
        gl.compileShader(fragment_shader);
        if (!gl.getShaderParameter(fragment_shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(fragment_shader));
            throw new Error('Failed to compile shader');
        }

        let program = gl.createProgram();
        gl.attachShader(program, vertex_shader);
        gl.attachShader(program, fragment_shader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            throw new Error('Failed to link program');
        }

        this.gl = gl;
        this.position = gl.getAttribLocation(program, 'position');
        this.normal = gl.getAttribLocation(program, 'normal');
        this.uv = gl.getAttribLocation(program, 'uv');
        this.model = gl.getUniformLocation(program, 'model');
        this.view = gl.getUniformLocation(program, 'view');
        this.projection = gl.getUniformLocation(program, 'projection');
        this.ambientLight = gl.getUniformLocation(program, 'ambientLight');
        this.lightDirection = gl.getUniformLocation(program, 'lightDirection');
        this.diffuse = gl.getUniformLocation(program, 'diffuse');
        this.vertex_shader = vertex_shader;
        this.fragment_shader = fragment_shader;
        this.program = program;
    }

    // Loads shader files from the given URLs, and returns a program as a promise
    static load(gl, vertex_shader_url, fragment_shader_url) {
        return Promise.all([loadFile(vertex_shader_url), loadFile(fragment_shader_url)]).then(
            function (files) {
                return new ShaderProgram(gl, files[0], files[1])
            });

        function loadFile (url) {
            return new Promise(function (resolve) {
                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == XMLHttpRequest.DONE) {
                        resolve(xhr.responseText);
                    }
                };
                xhr.open('GET', url, true);
                xhr.send(null);
            })
        }
    }

    use() {
        this.gl.useProgram(this.program)
    }
}
