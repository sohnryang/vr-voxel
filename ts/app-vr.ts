import { App } from "./app";

export class AppVR extends App {
    private button: HTMLElement;
    private disabled: boolean;
    private firstVRFrame: boolean;
    private vr: any;

    constructor() {
        super();

        this.disabled = false;
        if (typeof VRFrameData === "undefined") {
            this.disabled = true;
            console.error("WebVR not supported");
            return;
        }

        this.firstVRFrame = false;
        this.button = undefined;
        this.vr = {
            display: null,
            frameData: new VRFrameData(),
        };

        this.addVREventListeners();
        this.getDisplays();
    }

    protected render() {
        if (this.disabled || !(this.vr.display && this.vr.display.isPresenting)) {
            this.onResize();
            this.renderer.autoClear = true;
            this.scene.matrixAutoUpdate = true;
            return super.render();
        }

        if (this.firstVRFrame) {
            this.firstVRFrame = false;
            return this.vr.display.requestAnimationFrame(this.update);
        }

        const EYE_WIDTH = this.width * 0.5;
        const EYE_HEIGHT = this.height;

        this.vr.display.getFrameData(this.vr.frameData);
        this.scene.matrixAutoUpdate = false;
        this.renderer.autoClear = false;
        this.renderer.clear();

        this.renderEye(
            this.vr.frameData.leftViewMatrix,
            this.vr.frameData.leftProjectionMatrix, {
                x: 0,
                y: 0,
                w: EYE_WIDTH,
                h: EYE_HEIGHT,
            });
        this.renderer.clearDepth();
        this.renderEye(
            this.vr.frameData.rightViewMatrix,
            this.vr.frameData.rightProjectionMatrix, {
                x: EYE_WIDTH,
                y: 0,
                w: EYE_WIDTH,
                h: EYE_HEIGHT,
            });
        this.vr.display.requestAnimationFrame(this.update);
        this.vr.display.submitFrame();
    }

    private addVREventListeners() {
        window.addEventListener("vrdisplayactivate", () => {
            this.activateVR();
        });

        window.addEventListener("vrdisplaydeactivate", () => {
            this.deactivateVR();
        });
    }

    private getDisplays() {
        return navigator.getVRDisplays().then((displays) => {
            displays = displays.filter((display) => display.capabilities.canPresent);

            if (displays.length === 0) {
                console.warn("No devices available able to present.");
                return;
            }

            this.vr.display = displays[0];
            this.vr.display.depthNear = App.CAMERA_SETTINGS.near;
            this.vr.display.depthFar = App.CAMERA_SETTINGS.far;

            this.createPresentationButton();
        });
    }

    private createPresentationButton() {
        this.button = document.createElement("button");
        this.button.classList.add("vr-toggle");
        this.button.textContent = "Enable VR";
        this.button.addEventListener("click", () => {
            this.toggleVR();
        });
        document.body.appendChild(this.button);
    }

    private deactivateVR() {
        if (!this.vr.display) {
            return;
        }

        if (!this.vr.display.isPresenting) {
            return;
        }

        this.vr.display.exitPresent();
        return;
    }

    private activateVR() {
        if (!this.vr.display) {
            return;
        }

        this.vr.display.requestPresent([{
            source: this.renderer.domElement,
        }]).catch((e) => {
            console.error(`Unable to init VR: ${e}`);
        });
    }

    private toggleVR() {
        if (this.vr.display.isPresenting) {
            return this.deactivateVR();
        }

        return this.activateVR();
    }

    private renderEye(viewMatrix, projectionMatrix, viewPort) {
        this.renderer.setViewport(viewPort.x, viewPort.y, viewPort.w, viewPort.h);
        this.camera.projectionMatrix.fromArray(projectionMatrix);
        this.scene.matrix.fromArray(viewMatrix);
        this.scene.updateMatrixWorld(true);
        this.renderer.render(this.scene, this.camera);
    }
}
