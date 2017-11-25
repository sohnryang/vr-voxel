import { VoxelMaterial } from "./voxel-material";

export class VoxelData {
    private _x: number;
    private _y: number;
    private _z: number;
    private _materialType: VoxelMaterial;

    constructor(x, y, z, materialType) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._materialType = materialType;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get z(): number {
        return this._z;
    }

    get materialType(): VoxelMaterial {
        return this._materialType;
    }
}
