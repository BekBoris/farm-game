import Experience from '../Experience.js';
import Environment from './Environment.js';
import Farm from './Farm.js';
import PlacementMap from "./PlacementMap.js";
import CornsField from "./Fields/CornsField.js";
import GrapesField from "./Fields/GrapesField.js";
import StrawberriesField from "./Fields/StrawberriesField.js";
import TomatoesField from "./Fields/TomatoesField.js";
import Actions from "./Actions.js";

export default class World {
    constructor() {
        this.experience = new Experience();
        this.canvas = this.experience.canvas;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.actions = new Actions();

        this.farmAssets = [];
        this.toAddAssetName = null;
        this.worldMoney = 0;

        this.mouseClick = this.mouseClick.bind(this);

        this.resources.on('ready', () => {
            //Farm
            this.farm = new Farm();
            this.scene.add(this.farm);

            this.placementMap = new PlacementMap();
            this.scene.add(this.placementMap);

            this.environment = new Environment();

            this.canvas.addEventListener("click", this.mouseClick);
        });
    }

    mouseClick(event) {
        event.stopPropagation();

        if (this.placementMap.isPlaceMentMapActive) {
            const selectedMark = this.placementMap.selectedMark;

            if (selectedMark && this.toAddAssetName) {
                const placementMarkPosition = selectedMark.position;

                const AssetClasses = {
                    CORN: CornsField,
                    GRAPE: GrapesField,
                    STRAWBERRY: StrawberriesField,
                    TOMATO: TomatoesField,
                };

                const AssetClass = AssetClasses[this.toAddAssetName];

                if (AssetClass) {
                    const asset = new AssetClass();
                    asset.grow();
                    asset.position.copy(placementMarkPosition);
                    this.farmAssets.push(asset);
                    this.scene.add(asset);
                }

                this.placementMap.removeMark(selectedMark);
                this.placementMap.deactivateMark();
                this.toAddAssetName = null;
                return;
            }

            this.placementMap.deactivateMark();
            this.toAddAssetName = null;
            return;
        }

        const assetsBoundingBoxes = this.farmAssets.filter(asset => asset.getBoundingBox());

        const result = this.actions.raycastDetection(event, assetsBoundingBoxes);
        if (!result) return;

        const asset = result.object.parent;
        asset.harvest();
        this.worldMoney += 100;
    }

    addFarmAsset(assetName) {
        this.placementMap.activateMarks();
        this.toAddAssetName = assetName;
    }

    destroy() {
        window.removeEventListener('mousemove', this.mouseClick);
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
