class Geometry {
    constructor(faces) {
        this.faces = faces || [];
    }

    // Parses an OBJ file, passed as a string
    static parseOBJ(src) {
        let POSITION = /^v\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/;
        let NORMAL = /^vn\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/;
        let UV = /^vt\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/;
        let FACE = /^f\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+)\/(-?\d+))?/;

        const lines = src.split('\n');
        let positions = [];
        let uvs = [];
        let normals = [];
        let faces = [];
        lines.forEach(function (line) {
            // Match each line of the file against various RegEx-es
            let result;
            if ((result = POSITION.exec(line)) != null) {
                // Add new vertex position
                positions.push(new Vector3(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3])));
            } else if ((result = NORMAL.exec(line)) != null) {
                // Add new vertex normal
                normals.push(new Vector3(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3])));
            } else if ((result = UV.exec(line)) != null) {
                // Add new texture mapping point
                uvs.push(new Vector2(parseFloat(result[1]), 1 - parseFloat(result[2])));
            } else if ((result = FACE.exec(line)) != null) {
                // Add new face
                let vertices = [];
                // Create three vertices from the passed one-indexed indices
                for (let i = 1; i < 10; i += 3) {
                    let part = result.slice(i, i + 3);
                    let position = positions[parseInt(part[0]) - 1];
                    let uv = uvs[parseInt(part[1]) - 1];
                    let normal = normals[parseInt(part[2]) - 1];
                    vertices.push(new Vertex(position, normal, uv))
                }
                faces.push(new Face(vertices))
            }
        });

        return faces;
    }

    // Loads an OBJ file from the given URL, and returns it as a promise
    static loadOBJ(url) {
        return new Promise(function (resolve) {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    resolve(new Geometry(Geometry.parseOBJ(xhr.responseText)));
                }
            };
            xhr.open('GET', url, true);
            xhr.send(null);
        })
    };

    vertexCount() {
        return this.faces.length * 3;
    }

    positions() {
        let answer = [];
        this.faces.forEach(function (face) {
            face.vertices.forEach(function (vertex) {
                let v = vertex.position;
                answer.push(v.x, v.y, v.z);
            });
        });
        return answer;
    }

    normals() {
        let answer = [];
        this.faces.forEach(function (face) {
            face.vertices.forEach(function (vertex) {
                let v = vertex.normal;
                answer.push(v.x, v.y, v.z);
            });
        });
        return answer;
    }

    uvs() {
        let answer = [];
        this.faces.forEach(function (face) {
            face.vertices.forEach(function (vertex) {
                let v = vertex.uv;
                answer.push(v.x, v.y);
            });
        });
        return answer;
    }
}

class Face {
    constructor(vertices) {
        this.vertices = vertices || [];
    }
}

class Vertex {
    constructor(position, normal, uv) {
        this.position = position || new Vector3();
        this.normal = normal || new Vector3();
        this.uv = uv || new Vector2();
    }
}

class Vector3 {
    constructor(x, y, z) {
        this.x = Number(x) || 0;
        this.y = Number(y) || 0;
        this.z = Number(z) || 0;
    }
}

class Vector2 {
    constructor(x, y) {
        this.x = Number(x) || 0;
        this.y = Number(y) || 0;
    }
}
