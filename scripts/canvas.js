async function onPageLoad() {
    let renderer = new Renderer(document.getElementById('webgl_canvas'));
    renderer.setClearColor(100, 149, 237);
    let gl = renderer.getContext();

    let objects = [];

    MeshManager.load(gl, 'mesh/torus.obj', 'mesh/paper_crumpled_texture.jpg')
        .then(function (mesh) {
            objects.push(mesh)
        });

    ShaderProgram.load(gl,
        'shaders/vertex_shader.glsl',
        'shaders/fragment_shader.glsl')
        .then(function (shader) {
            renderer.setShader(shader);
        });

    let camera = new Camera();
    camera.setOrthographic(16, 10, 10);

    let light = new Light();

    loop();

    function loop () {
        renderer.render(camera, light, objects);
        camera.position = camera.position.rotateY(Math.PI / 120);
        requestAnimationFrame(loop);
    }
}

window.addEventListener('load', onPageLoad);
