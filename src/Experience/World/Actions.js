import {Raycaster, Vector2} from "three";
import Experience from "../Experience.js";

export default class Actions {
    constructor() {
        this.experience = new Experience();
        this.camera = this.experience.camera;

        this.pointer = new Vector2();

        this.rayCaster = new Raycaster();
        this.rayCaster.layers.set(1);
        this.rayCaster.params = {Line: {threshold: 0}};
        this.rayCaster.firstHitOnly = true;

    }

    raycastDetection(event, objects) {
        const arr = Array.isArray(objects) ? objects : [objects];

        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.rayCaster.setFromCamera(this.pointer, this.camera.instance);
        const intersects = this.rayCaster.intersectObjects(arr, true);

        if (intersects[0]) {
            const point = intersects[0].point;
            const object = intersects[0].object;

            return {object, point};
        }

        return null;
    }
}

