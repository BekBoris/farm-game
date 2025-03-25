import {Group, Mesh} from "three";
import {copyModel} from "../Utils.js";

export default class CropsAbstract extends Group {
    constructor() {
        super();
        this.model = null;
        this.step1Model = null;
        this.step2Model = null;
        this.step3Model = null;
    }

    create() {
        this.model = copyModel(this.cropResource.scene);
        this.add(this.model);
    }

    resetSteps() {
        if (this.step1Model) this.step1Model.visible = true;
        if (this.step2Model) this.step2Model.visible = false;
        if (this.step3Model) this.step3Model.visible = false;
    }

    setGrowStep(step) {
        this.resetSteps();

        if (step === 1) {
            this.step1Model.visible = true;
            return;
        }

        if (step === 2) {
            this.step1Model.visible = false;
            this.step2Model.visible = true;
            return;
        }

        if (step === 3) {
            this.step2Model.visible = false;
            this.step3Model.visible = true;
            this.isReadyToCollect = true;
        }
    }

    setBrightness(factor) {
        this.traverse((child) => {
            if (child instanceof Mesh) {
                child.material.color.multiplyScalar(factor);
            }
        });
    }

    setPosition(vector3) {
        this.position.copy(vector3);
    }
}


