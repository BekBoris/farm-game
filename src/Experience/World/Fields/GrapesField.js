import Experience from '../../Experience.js';
import FieldsAbstract from "./FieldsAbstract.js";

export default class GrapesField extends FieldsAbstract {

    constructor() {
        super();
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.fieldResource = this.resources.items.grapesFieldModel;
        this.coinResource = this.resources.items.coinModel;

        this.create();
        this.addCoin();
        this.setBoundingMesh();
        this.setBrightness(1.01);
        this.setStepsModel();
        this.resetSteps();
    }

    setStepsModel() {
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
