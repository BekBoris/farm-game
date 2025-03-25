import Experience from '../Experience.js';
import Environment from './Environment.js';
import Farm from './Farm.js';
import PlacementMap from "./PlacementMap.js";
import CornsField from "./Fields/CornsField.js";
import GrapesField from "./Fields/GrapesField.js";
import StrawberriesField from "./Fields/StrawberriesField.js";
import TomatoesField from "./Fields/TomatoesField.js";
import Actions from "./Actions.js";
import CowsFence from "./Fences/CowsFence.js";
import SheepFence from "./Fences/SheepFence.js";
import Sounds from "./Sounds.js";
import EventEmitter from "../Utils/EventEmitter.js";
import ChickenFence from "./Fences/ChickenFence.js";

export default class World extends EventEmitter {
    constructor() {
        super();
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

            this.sounds = new Sounds();

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
                    COW: CowsFence,
                    SHEEP: SheepFence,
                    CHICKEN: ChickenFence,
                };

                const AssetClass = AssetClasses[this.toAddAssetName];

                if (AssetClass) {
                    const asset = new AssetClass();
                    asset.setOnGround(placementMarkPosition);
                    this.farmAssets.push(asset);
                    this.scene.add(asset);
                }

                this.placementMap.removeMark(selectedMark);
                this.placementMap.deactivateMark();
                this.sounds.playSound('drop');
                this.toAddAssetName = null;
                return;
            }

            this.placementMap.deactivateMark();
            this.toAddAssetName = null;
            return;
        }

        const assetsBoundingMeshes = this.farmAssets.filter(asset => asset.getBoundingMesh());

        const result = this.actions.raycastDetection(event, assetsBoundingMeshes);
        if (!result) {
            this.sounds.playSound('click');
            return;
        }


        const asset = result.object.parent;

        if (asset.isReadyToCollect) {
            asset.harvest();
            this.sounds.playSound('harvest');
            this.worldMoney += 100;
            const worldMoney = this.worldMoney;
            this.trigger('collect', [worldMoney]);
            return;
        }

        if (asset instanceof SheepFence) {
            this.sounds.playSound('sheep', true);
            return;
        }

        if (asset instanceof CowsFence) {
            this.sounds.playSound('cow', true);
            return;
        }

        if (asset instanceof ChickenFence) {
            this.sounds.playSound('chicken', true);
        }


    }

    addFarmAsset(assetName) {
        this.placementMap.activateMarks();
        this.toAddAssetName = assetName;
    }

    destroy() {
        window.removeEventListener('mousemove', this.mouseClick);
    }

    muteMusic(status) {
        if (status) {
            this.sounds.stopMusic();
            return;
        }
        this.sounds.playMusic();
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

