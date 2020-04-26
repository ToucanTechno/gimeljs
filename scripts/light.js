class Light {
    constructor() {
        this.lightDirection = new Vector3(-1, -1, -1);
        this.ambientLight = 0.3;
    }

    use(shaderProgram) {
        let dir = this.lightDirection;
        let gl = shaderProgram.gl;
        gl.uniform3f(shaderProgram.lightDirection, dir.x, dir.y, dir.z);
        gl.uniform1f(shaderProgram.ambientLight, this.ambientLight);
    }
}
