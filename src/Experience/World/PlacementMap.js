import {Box3, Group, Vector3} from "three";
import Experience from "../Experience.js";
import {copyModel} from "./Utils.js";
import {WebGLRenderList as placementMarks} from "three/src/renderers/webgl/WebGLRenderLists.js";

export default class PlacementMap extends Group {
    activate;

    constructor() {
        super();

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.placementMarkResource = this.resources.items.placementMarkModel;

        this.position.set(0, 0, -3.7);

        this.placementMarks = [];
        this.placementMarkSize = null;


        this.create();
    }

    create() {
        /*const verticalGap = 6.5;
        const horizontalOffset = 9;

        const positions = [];

        for (let i = 0; i < 4; i++) {
            positions.push(new Vector3(-horizontalOffset, 0, i * verticalGap - verticalGap));
        }

        for (let i = 0; i < 4; i++) {
            positions.push(new Vector3(horizontalOffset, 0, i * verticalGap - verticalGap));
        }*/

        const positions = [
            new Vector3(-11, 0, -6.5),
            new Vector3(-11, 0, 0),
            new Vector3(-11, 0, 6.5),
            new Vector3(-11, 0, 13),
            new Vector3(9, 0, -6.5),
            new Vector3(9, 0, 0),
            new Vector3(9, 0, 6.5),
            new Vector3(9, 0, 13)
        ];

        positions.forEach((position, index) => {

            const placementMark = copyModel(this.placementMarkResource.scene);
            placementMark.position.copy(position);
            placementMark.rotation.y = -Math.PI / 2;
            placementMark.scale.setScalar(0.8);
            placementMark.visible = false;

            placementMark.name = index;

            if (!this.placementMarkSize) {
                const box = new Box3().setFromObject(placementMark, true);
                this.placementMarkSize = box.getSize(new Vector3());
            }

            this.placementMarks.push(placementMark);
            this.add(placementMark);
        });
    }

    activateMarks() {
        this.placementMarks.forEach((placementMark) => placementMark.visible = true);
    }

    deactivateMarks() {
        this.placementMarks.forEach((placementMark) => placementMark.visible = false);
    }

    removeMark(index) {
        const mark = this.placementMarks[index];
        this.remove(mark);
        this.destroyMark(mark);
        this.placementMarks.splice(index, 1);
    }

    destroyMark(mark) {
        mark.traverse(node => {
            if (node.isMesh) {
                if (node.geometry) node.geometry.dispose();
                if (node.material) {
                    const materials = Array.isArray(node.material) ? node.material : [node.material];
                    materials.forEach(material => material.dispose());
                }
            }
        });
    }


    getPlacementMarks() {
        return this.placementMarks;
    }
}
