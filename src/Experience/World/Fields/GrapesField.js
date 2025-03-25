import FieldsAbstract from "./FieldsAbstract.js";
import {Vector3} from "three";
import Grapes from "../Crops/Grapes.js";

export default class GrapesField extends FieldsAbstract {
    constructor() {
        super();
        this.crops = [];

        this.create();
        this.addCoin();
        this.setBoundingMesh();
    }

    create() {
        const positions = [
            new Vector3(-3.3, 0, -1.8),
            new Vector3(-3.3, 0, 1.8),
            new Vector3(0, 0, -1.8),
            new Vector3(0, 0, 1.8),
            new Vector3(3.3, 0, -1.8),
            new Vector3(3.3, 0, 1.8),
        ];

        positions.forEach((position) => {
            const crop = new Grapes();
            crop.setPosition(position);
            this.crops.push(crop);
            this.add(crop);
        });
    }
}
