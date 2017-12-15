import * as THREE from "three";

import { VoxelData } from "./voxel-data";
import { MATERIAL_LIST, VoxelMaterial } from "./voxel-material";

export class App {
    protected camera: THREE.PerspectiveCamera;
    protected height: number;
    protected renderer: THREE.WebGLRenderer;
    protected scene: THREE.Scene;
    protected width: number;

    private aspect: number;
    private geometry: THREE.BoxGeometry;
    private light: THREE.DirectionalLight;
    private material: THREE.MeshStandardMaterial;
    private voxels: VoxelData[];
    private voxelMaterials: THREE.MeshLambertMaterial[][];
    private voxelMesh: THREE.Mesh;
    private mergedGeometry: THREE.Geometry;
    private mergedMesh: THREE.Mesh;

    constructor(voxels: VoxelData[]) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.voxels = voxels;
        this.mergedGeometry = new THREE.Geometry();
        this.loadMaterials();
        this.initScene();
        this.update = this.update.bind(this);
        requestAnimationFrame(this.update);
    }

    protected update() {
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
        this.voxelMesh = new THREE.Mesh(this.geometry);
        this.light = new THREE.DirectionalLight(0xffffff, 2);
        this.light.position.set(50, 50, 50);
        this.scene.add(this.light);
        this.camera.position.y = 3;

        for (const voxel of this.voxels) {
            this.voxelMesh.geometry.translate(voxel.x, voxel.y, voxel.z);
            this.voxelMesh.material = this.voxelMaterials[voxel.materialType as number];
            this.voxelMesh.updateMatrix();
            this.mergedGeometry.merge(
                this.voxelMesh.geometry as THREE.Geometry, this.voxelMesh.matrix, (voxel.materialType as number) * 6,
            );
            this.voxelMesh.geometry.translate(-voxel.x, -voxel.y, -voxel.z);
        }

        this.mergedMesh = new THREE.Mesh(
            new THREE.BufferGeometry().fromGeometry(this.mergedGeometry), [].concat(...this.voxelMaterials),
        );
        this.scene.add(this.mergedMesh);
    }

    private loadMaterials() {
        this.voxelMaterials = [];

        for (const material of MATERIAL_LIST) {
            const materialFaces = [];
            for (let i = 0; i < 6; i++) {
                materialFaces.push(new THREE.MeshLambertMaterial({
                    map: new THREE.TextureLoader().load(`${material}.${i + 1}.jpg`),
                }));
            }
            this.voxelMaterials.push(materialFaces);
        }
    }
}
