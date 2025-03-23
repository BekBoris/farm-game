import Experience from '../Experience.js';
import Environment from './Environment.js';
import Farm from './Farm.js';
import TomatoesField from "./Fields/TomatoesField.js";
import CornsField from "./Fields/CornsField.js";
import GrapesField from "./Fields/GrapesField.js";
import StrawberriesField from "./Fields/StrawberriesField.js";
import {Vector3} from "three";
import CowsFence from "./Fences/CowsFence.js";
import SheepFence from "./Fences/SheepFence.js";
import ChickensFence from "./Fences/ChickensFence.js";

export default class World {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;

        this.farmAssets = [];

        // Wait for resources
        this.resources.on('ready', () => {
            //Farm
            this.farm = new Farm();
            this.environment = new Environment();

            const cornsField = new CornsField();
            cornsField.setPosition(new Vector3(0, 0, 5));
            this.farmAssets.push(cornsField);
            //this.scene.add(cornsField);

            const tomatoesField = new TomatoesField();
            tomatoesField.setPosition(new Vector3(0, 0, -5));
            this.farmAssets.push(tomatoesField);
            //this.scene.add(tomatoesField);

            const grapesField = new GrapesField();
            grapesField.setPosition(new Vector3(5, 0, 0));
            this.farmAssets.push(grapesField);
            //this.scene.add(grapesField);

            const strawberriesField = new StrawberriesField();
            strawberriesField.setPosition(new Vector3(-5, 0, 0));
            this.farmAssets.push(strawberriesField);
            //this.scene.add(strawberriesField);

            const cowsFence = new CowsFence();
            this.farmAssets.push(cowsFence);
            //this.scene.add(cowsFence);

            const sheepFence = new SheepFence();
            this.farmAssets.push(sheepFence);
            this.scene.add(sheepFence);

            const chickensFence = new ChickensFence();
            this.farmAssets.push(chickensFence);
            this.scene.add(chickensFence);


        });
    }

    update() {
        const deltaTime = this.time.getDelta();

        if (this.farmAssets.length > 0) {
            this.farmAssets.forEach(farmAsset => {
                farmAsset.update(deltaTime * 0.001);
            });
        }
    }
}
