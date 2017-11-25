import { App } from "./app";
import { AppVR } from "./app-vr";

if (navigator.hasOwnProperty("getVRDisplays")) {
    const app = new AppVR();
} else {
    const app = new App();
}
