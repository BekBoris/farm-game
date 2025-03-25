import Experience from '../../Experience.js';
import CropsAbstract from "./CropsAbstract.js";

export default class Strawberries extends CropsAbstract {

    constructor() {
        super();
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.fieldResource = this.resources.items.strawberriesFieldModel;

        this.create();
        this.setBrightness(1.01);
        this.setStepsModels();
        this.resetSteps();
    }

    setStepsModels() {
        this.model.traverse((child) => {
            if (child.name === 'strawberry_1') {
                this.step1Model = child;
            }
            if (child.name === 'strawberry_2') {
                this.step2Model = child;
            }
            if (child.name === 'strawberry_3') {
                this.step3Model = child;
            }
        });
    }
}
