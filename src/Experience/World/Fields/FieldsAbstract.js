import {Box3, BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3} from "three";
import Experience from "../../Experience.js";
import {copyModel} from "../Utils.js";

export default class FieldsAbstract extends Group {
    constructor() {
        super();
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.coinResource = this.resources.items.coinModel;
        this.boundingMesh = null;
        this.isReadyToHarvest = false;
    }

    addCoin() {
        this.coin = copyModel(this.coinResource.scene);
        this.coin.visible = false;
        this.coin.rotation.z = Math.PI / 2;
        this.coin.scale.setScalar(2.5);

        this.add(this.coin);

        const size = this.getSize();
        const center = this.getCenter();

        this.coin.position.y = center.y + size.y / 2 + 0.5;
    }

    grow() {

        this.crops.forEach(crop => crop.setGrowStep(1));

        setTimeout(() => {
            this.crops.forEach(crop => crop.setGrowStep(2));
        }, 2000);

        setTimeout(() => {
            this.crops.forEach(crop => crop.setGrowStep(3));
            this.isReadyToHarvest = true;
            this.coin.visible = true;
        }, 4000);
    }

    harvest() {
        if (this.isReadyToHarvest) {
            this.isReadyToHarvest = false;
            this.coin.visible = false;
            this.crops.forEach(crop => crop.resetSteps());
            this.grow();
        }
    }

    setBoundingMesh() {
        const size = this.getSize();
        const center = this.getCenter();
        const geometry = new BoxGeometry(size.x, size.y, size.z);
        const material = new MeshBasicMaterial({visible: false, wireframe: true});
        const mesh = new Mesh(geometry, material);
        mesh.layers.set(1);
        this.boundingMesh = mesh;
        this.boundingMesh.position.copy(center);
        this.add(this.boundingMesh);
    }

    setOnGround(vector3) {
        this.grow();
        this.setPosition(vector3);
    }

    getBoundingMesh() {
        return this.boundingMesh;
    }

    getBoundingBox() {
        return new Box3().setFromObject(this, true);
    }

    getSize() {
        return this.getBoundingBox().getSize(new Vector3());
    }

    getCenter() {
        return this.getBoundingBox().getCenter(new Vector3());
    }

    setPosition(vector3) {
        this.position.copy(vector3);
    }

    setScale(scale) {
        this.scale.copy(scale);
    }

    update() {
        if (this.coin && this.coin.visible) {
            this.coin.rotation.y += 0.01;
        }
    }
}
