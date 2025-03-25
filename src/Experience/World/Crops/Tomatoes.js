import Experience from '../../Experience.js';
import CropsAbstract from "./CropsAbstract.js";

export default class Tomatoes extends CropsAbstract {

    constructor() {
        super();
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.cropResource = this.resources.items.tomatoesFieldModel;

        this.create();
        this.setBrightness(1.01);
        this.setStepsModels();
        this.resetSteps();
    }

    setStepsModels() {
        this.model.traverse((child) => {
            if (child.name === 'tomato_1') {
                this.step1Model = child;
            }
            if (child.name === 'tomato_2') {
                this.step2Model = child;
            }
            if (child.name === 'tomato_3') {
                this.step3Model = child;
            }
        });
    }
}
