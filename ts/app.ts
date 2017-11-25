import * as THREE from "three";

import { VoxelData } from "./voxel-data";

export class App {
    protected camera: THREE.PerspectiveCamera;
    protected height: number;
    protected renderer: THREE.WebGLRenderer;
    protected scene: THREE.Scene;
    protected width: number;

    private aspect: number;
    private cube: THREE.Mesh;
    private geometry: THREE.BoxGeometry;
    private light: THREE.PointLight;
    private material: THREE.MeshStandardMaterial;
    private voxels: VoxelData[];
    private mergedGeometry: THREE.Geometry;

    constructor(voxels: VoxelData[]) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.voxels = voxels;
        this.initScene();
        this.update = this.update.bind(this);
        requestAnimationFrame(this.update);
    }

    protected update() {
        this.cube.rotation.x += 0.1;
        this.cube.rotation.y += 0.1;
        this.render();
    }

    protected render() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.update);
    }

    protected static get CAMERA_SETTINGS() {
        return {
            far: 10000,
            near: 0.1,
            viewAngle: 45,
        };
    }

    protected onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.aspect = this.width / this.height;
        this.renderer.setSize(this.width, this.height);

        if (!this.camera) { return; }

        this.camera.aspect = this.aspect;
        this.camera.updateProjectionMatrix();
    }

    private initScene() {
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshStandardMaterial({color: 0x00ff00});
        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.cube);
        this.light = new THREE.PointLight(0xffffff, 2, 100);
        this.light.position.set(50, 50, 50);
        this.scene.add(this.light);
        this.camera.position.z = 5;
    }
}
