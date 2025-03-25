import {BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3} from "three";
import {copyModel} from "../Utils.js";

export default class FencesAbstract extends Group {
    constructor() {
        super();
    }

    addCoin() {
        this.coin = copyModel(this.coinResource.scene);
        this.coin.rotation.z = Math.PI / 2;
        this.coin.scale.setScalar(2.5);

        this.add(this.coin);

        const size = this.getSize();
        const center = this.getCenter();

        this.coin.position.y = center.y + size.y / 2 + 0.5;
    }

    grow() {
        this.resetSteps();
        setTimeout(() => {
            this.isReadyToCollect = true;
            this.coin.visible = true;
        }, 6000);
    }

    harvest() {
        if (this.isReadyToCollect) {
            this.resetSteps();
            this.grow();
        }
    }

    resetSteps() {
        this.isReadyToCollect = false;
        this.coin.visible = false;
    }

    setBrightness(factor) {
        this.traverse((child) => {
            if (child instanceof Mesh) {
                child.material.color.multiplyScalar(factor);
            }
        });
    }

    setOnGround(vector3) {
        this.grow();
        if (vector3.x > 0) this.rotation.y = -Math.PI / 2;
        if (vector3.x < 0) this.rotation.y = Math.PI / 2;
        this.setPosition(vector3);
    }

    setBoundingMesh() {
        const size = this.getSize();

        const height = 1;
        const geometry = new BoxGeometry(size.x, height, size.z);
        geometry.translate(0, height / 2, 0);

        const material = new MeshBasicMaterial({visible: false, wireframe: true});

        const mesh = new Mesh(geometry, material);
        mesh.layers.set(1);

        this.boundingMesh = mesh;
        this.add(this.boundingMesh);
    }

    setPosition(vector3) {
        this.position.copy(vector3);
    }

    getSize() {
        return this.getBoundingBox().getSize(new Vector3());
    }

    getCenter() {
        return this.getBoundingBox().getCenter(new Vector3());
    }

    getBoundingMesh() {
        return this.boundingMesh;
    }

    update(delta) {
        if (this.coin && this.coin.visible) {
            this.coin.rotation.y += 0.01;
        }

        Object.values(this.animations).forEach((animSet) => {
            if (animSet.mixer) {
                animSet.mixer.update(delta * 0.75);
            }
        });
    }
}
