import * as THREE from 'three';
import Experience from '../Experience.js';

export default class Farm {

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.resource = this.resources.items.farmModel;
        this.farmMap = null;

        this.create();
        this.brightUp(1.01);
        this.setFarmMap();
    }

    create() {
        this.model = this.resource.scene;
        this.model.position.y = -4.6;
        this.scene.add(this.model);
    }

    brightUp(factor) {
        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material.color.multiplyScalar(factor);
            }
        });
    }

    setFarmMap() {
        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                this.farmMap = child;
            }
        });
    }

    getFarmMap() {
        return this.farmMap;
    }
}
