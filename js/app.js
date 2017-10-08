import * as THREE from 'three'

class App {
    constructor() {
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this._renderer.domElement);
        let geometry = new THREE.BoxGeometry( 1, 1, 1 );
        let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        let cube = new THREE.Mesh(geometry, material);
        this._scene.add(cube);
        this._camera.position.z = 5;
        this.animate = () => {
            requestAnimationFrame(this.animate);
            cube.rotation.x += 0.1;
            cube.rotation.y += 0.1;
            this._renderer.render(this._scene, this._camera);
        }
        this.animate();
    }
}

window.App = App;