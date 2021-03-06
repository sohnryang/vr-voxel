import { App } from "./app";
import { AppVR } from "./app-vr";
import { VoxelData } from "./voxel-data";
import { VoxelMaterial } from "./voxel-material";

// generate the floor
const voxels = [];
for (let i = -10; i < 10; i++) {
    for (let j = -10; j < 10; j++) {
        voxels.push(new VoxelData(i, 0, j, VoxelMaterial.Grass));
    }
}

if (navigator.getVRDisplays !== undefined) {
    const app = new AppVR(voxels);
    console.log("using AppVR");
} else {
    const app = new App(voxels);
    console.log("using App");
}
