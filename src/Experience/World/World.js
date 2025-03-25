import Experience from '../Experience.js';
import Environment from './Environment.js';
import Farm from './Farm.js';
import PlacementMap from "./PlacementMap.js";

export default class World {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;

        this.farmAssets = [];

        this.resources.on('ready', () => {
            //Farm
            this.farm = new Farm();
            this.scene.add(this.farm);

            this.placementMap = new PlacementMap();
            this.scene.add(this.placementMap);

            this.environment = new Environment();
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

/*
    FARM ASSETS

    const cornsField = new CornsField();
    this.farmAssets.push(cornsField);
    //this.scene.add(cornsField);

    const grapesField = new GrapesField();
    this.farmAssets.push(grapesField);
    //this.scene.add(grapesField);

    const tomatoesField = new TomatoesField();
    this.farmAssets.push(tomatoesField);
    //this.scene.add(tomatoesField);

    const strawberriesField = new StrawberriesField();
    this.farmAssets.push(strawberriesField);
    //this.scene.add(strawberriesField);

    const cowsFence = new CowsFence();
    this.farmAssets.push(cowsFence);
    //this.scene.add(cowsFence);

    const sheepFence = new SheepFence();
    this.farmAssets.push(sheepFence);
    //this.scene.add(sheepFence);

    const chickensFence = new ChickensFence();
    this.farmAssets.push(chickensFence);
    //this.scene.add(chickensFence);
*/
