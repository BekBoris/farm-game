import {Box3, BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3} from "three";
import {copyModel} from "../Utils.js";

export default class FieldsAbstract extends Group {
    constructor() {
        super();
        this.model = null;
        this.coin = null;
        this.step1Model = null;
        this.step2Model = null;
        this.step3Model = null;
        this.boundingMesh = null;
        this.isReadyToCollect = false;


        window.grow = this.setStepsAnimation.bind(this);
        window.harvest = this.harvest.bind(this);
    }

    create() {
        this.model = copyModel(this.fieldResource.scene);
        this.add(this.model);
    }

    resetSteps() {
        if (this.step1Model) this.step1Model.visible = true;
        if (this.step2Model) this.step2Model.visible = false;
        if (this.step3Model) this.step3Model.visible = false;
        this.isReadyToCollect = false;
        this.coin.visible = false;
    }

    harvest() {
        if (this.isReadyToCollect) {
            this.resetSteps();
            this.setStepsAnimation();
        }
    }

    copyModel(original) {
        const clone = original.clone(true);

        const originalMeshes = [];
        const clonedMeshes = [];

        original.traverse(child => {
            if (child.isMesh) {
                originalMeshes.push(child);
            }
        });

        clone.traverse(child => {
            if (child.isMesh) {
                clonedMeshes.push(child);
            }
        });

        if (originalMeshes.length !== clonedMeshes.length) {
            console.warn('Mesh count mismatch between original and clone.');
        }

        for (let i = 0; i < originalMeshes.length; i++) {
            const origMesh = originalMeshes[i];
            const cloneMesh = clonedMeshes[i];

            if (origMesh.geometry) {
                cloneMesh.geometry = origMesh.geometry.clone();
            }

            if (origMesh.material) {
                if (Array.isArray(origMesh.material)) {
                    cloneMesh.material = origMesh.material.map(mat => mat.clone());
                } else {
                    cloneMesh.material = origMesh.material.clone();
                }
            }
        }

        return clone;
    }

    addCoin() {
        this.coin = this.copyModel(this.coinResource.scene);
        this.coin.rotation.z = Math.PI / 2;
        this.coin.scale.setScalar(2.5);

        this.add(this.coin);

        const size = this.getModelSize();
        const center = this.getModelCenter();

        this.coin.position.y = center.y + size.y / 2 + 0.5;
    }

    setBrightness(factor) {
        this.traverse((child) => {
            if (child instanceof Mesh) {
                child.material.color.multiplyScalar(factor);
            }
        });
    }

    setBoundingMesh() {
        const size = this.getModelSize();
        const center = this.getModelCenter();
        const geometry = new BoxGeometry(size.x, size.y, size.z);
        const material = new MeshBasicMaterial({visible: true, wireframe: true});
        this.boundingMesh = new Mesh(geometry, material);
        this.boundingMesh.position.copy(center);
        this.add(this.boundingMesh);
    }

    setStepsAnimation() {

        this.resetSteps();

        this.step1Model.visible = true;

        setTimeout(() => {
            this.step1Model.visible = false;
            this.step2Model.visible = true;
        }, 2000);

        setTimeout(() => {
            this.step2Model.visible = false;
            this.step3Model.visible = true;
            this.isReadyToCollect = true;
            this.coin.visible = true;
        }, 4000);
    }

    setPosition(vector3) {
        this.position.copy(vector3);
    }

    setOnGround() {
        this.setStepsAnimation();
    }

    getBoundingMesh() {
        return this.boundingMesh;
    }

    getModelSize() {
        return this.getModelBoundingBox().getSize(new Vector3());
    }

    getModelCenter() {
        return this.getModelBoundingBox().getCenter(new Vector3());
    }

    getModelBoundingBox() {
        return new Box3().setFromObject(this.model, true);
    }

    update() {
        if (this.coin && this.coin.visible) {
            this.coin.rotation.y += 0.01;
        }
    }
}


