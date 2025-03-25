import Experience from '../../Experience.js';
import CropsAbstract from "./CropsAbstract.js";

export default class Grapes extends CropsAbstract {

    constructor() {
        super();
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.fieldResource = this.resources.items.grapesFieldModel;

        this.create();
        this.setBrightness(1.01);
        this.setStepsModels();
        this.resetSteps();
    }

    setStepsModels() {
        this.model.traverse((child) => {
            if (child.name === 'grape_1') {
                this.step1Model = child;
            }
            if (child.name === 'grape_2') {
                this.step2Model = child;
            }
            if (child.name === 'grape_3') {
                this.step3Model = child;
            }
        });
    }
}
