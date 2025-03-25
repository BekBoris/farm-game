import {Box3, BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3} from "three";
import Experience from "../Experience.js";
import {copyModel} from "./Utils.js";
import Actions from "./Actions.js";

export default class PlacementMap extends Group {

    constructor() {
        super();

        this.experience = new Experience();
        this.canvas = this.experience.canvas;
        this.resources = this.experience.resources;
        this.placementMarkResource = this.resources.items.placementMarkModel;
        this.actions = new Actions();

        this.placementMarks = [];
        this.placementMarksPlanes = [];
        this.placementMarkSize = null;
        this.selectedMark = null;

        this.isPlaceMentMapActive = false;

        this.mouseMove = this.mouseMove.bind(this);
        this.canvas.addEventListener("mousemove", this.mouseMove);

        this.create();
    }

    create() {
        const verticalGap = 9;
        const horizontalOffset = 9;

        const positions = [];

        for (let i = 0; i < 3; i++) {
            positions.push(new Vector3(-horizontalOffset, 0, i * verticalGap - verticalGap));
        }

        for (let i = 0; i < 3; i++) {
            positions.push(new Vector3(horizontalOffset, 0, i * verticalGap - verticalGap));
        }

        positions.forEach((position, index) => {

            const placementMark = copyModel(this.placementMarkResource.scene);
            placementMark.position.copy(position);
            placementMark.rotation.y = -Math.PI / 2;
            placementMark.updateMatrixWorld(true);
            placementMark.visible = false;

            placementMark.name = index;

            if (!this.placementMarkSize) {
                const box = new Box3().setFromObject(placementMark);
                this.placementMarkSize = box.getSize(new Vector3());
            }

            const placementMarkSize = this.placementMarkSize;
            const planeGeometry = new BoxGeometry(placementMarkSize.z, 0.5, placementMarkSize.x);
            const planeMaterial = new MeshBasicMaterial({visible: false, wireframe: true});
            const placementMarkPlane = new Mesh(planeGeometry, planeMaterial);
            placementMarkPlane.layers.set(1);
            placementMark.add(placementMarkPlane);

            placementMark.scale.setScalar(0.8);

            this.placementMarks.push(placementMark);
            this.placementMarksPlanes.push(placementMarkPlane);
            this.add(placementMark);
        });
    }

    mouseMove(event) {
        event.stopPropagation();
        const result = this.actions.raycastDetection(event, [...this.placementMarksPlanes]);
        if (!result) {
            if (this.selectedMark) this.setPlacementMarkColor(this.selectedMark, '#ffffff');
            this.selectedMark = null;
            return;
        }

        if (this.selectedMark && this.selectedMark.uuid === result.object.parent.uuid) {
            return;
        }

        if (this.selectedMark && this.selectedMark.uuid !== result.object.parent.uuid) {
            this.setPlacementMarkColor(this.selectedMark, '#ffffff');
        }

        this.selectedMark = result.object.parent;
        this.setPlacementMarkColor(this.selectedMark, '#ff0000');
    }

    activateMarks() {
        this.placementMarks.forEach((placementMark) => placementMark.visible = true);
        this.isPlaceMentMapActive = true;
    }

    deactivateMark() {
        this.placementMarks.forEach((placementMark) => placementMark.visible = false);
        this.isPlaceMentMapActive = false;
    }

    removeMark(placementMark) {
        const index = this.placementMarks.indexOf(placementMark);
        if (index === -1) return;
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

    setPlacementMarkColor(placementMark, color) {
        placementMark.traverse((child) => {
            if (child.isMesh && child.material && child.material.color) {
                child.material.color.set(color);
            }
        });
    }
}
