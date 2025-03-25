import Experience from '../../Experience.js';
import {AnimationMixer, Box3, Euler, LoopOnce, Vector3} from "three";
import {copyModel, copySkinningModel} from "../Utils.js";
import FencesAbstract from "./FencesAbstract.js";

export default class ChickenFence extends FencesAbstract {
    constructor() {
        super();

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;

        this.chickensFenceResource = this.resources.items.chickensFenceModel;
        this.chickenResource = this.resources.items.chickenModel;
        this.coinResource = this.resources.items.coinModel;

        this.chickensFenceModel = null;
        this.chickens = [];
        this.boundingMesh = null;
        this.coin = null;

        this.chickensPositions = [
            {position: new Vector3(1.75, 0, -0.42), rotation: new Euler(0, 0, 0)},
            {position: new Vector3(0.6, 0, -0.42), rotation: new Euler(0, 0, 0)},
            {position: new Vector3(-0.6, 0, -0.42), rotation: new Euler(0, 0, 0)},
            {position: new Vector3(-1.75, 0, -0.42), rotation: new Euler(0, 0, 0)},
            {position: new Vector3(1.55, 0, 1.3), rotation: new Euler(0, Math.PI, 0)},
            {position: new Vector3(0.2, 0, 1.3), rotation: new Euler(0, Math.PI, 0)},
            {position: new Vector3(-0.7, 0, 1.3), rotation: new Euler(0, Math.PI, 0)},
            {position: new Vector3(-1.85, 0, 1.3), rotation: new Euler(0, Math.PI, 0)},
        ];

        this.isReadyToCollect = false;
        this.animations = [];
        this.create();
        this.addCoin();
        this.setAnimations();
        this.setBoundingMesh();
        this.resetSteps();

        this.chickens.forEach((_, index) => {
            this.cycleRandomAnimation(index);
        });
    }

    create() {
        this.chickensFenceModel = copyModel(this.chickensFenceResource.scene);
        this.add(this.chickensFenceModel);

        for (let i = 0; i < this.chickensPositions.length; i++) {
            const {position, rotation} = this.chickensPositions[i];

            const chickenMesh = copySkinningModel(this.chickenResource.scene);

            chickenMesh.position.copy(position);
            chickenMesh.rotation.copy(rotation);

            this.chickens.push(chickenMesh);
            this.add(chickenMesh);
        }
    }

    setAnimations() {
        for (let i = 0; i < this.chickens.length; i++) {
            const mixer = new AnimationMixer(this.chickens[i]);

            const idleAction = mixer.clipAction(this.chickenResource.animations[0]);
            const actionAction = mixer.clipAction(this.chickenResource.animations[1]);

            this.animations[i] = {
                mixer,
                idle: idleAction,
                action: actionAction,
                current: null
            };
        }
    }

    playChickenAnimation(chickenIndex, animationName, crossFadeDuration = 0.5, onFinish = null) {
        const animSet = this.animations[chickenIndex];
        if (!animSet) return;

        let newAction = null;
        if (animationName === 'idle') {
            newAction = animSet.idle;
        } else if (animationName === 'action') {
            newAction = animSet.action;
        }

        const oldAction = animSet.current;
        if (oldAction && oldAction !== newAction) {
            oldAction.crossFadeTo(newAction, crossFadeDuration, false);
        }

        if (newAction) {
            newAction.reset();
            newAction.setLoop(LoopOnce);
            newAction.clampWhenFinished = true;
            newAction.play();

            const handleFinish = (e) => {
                if (e.action === newAction) {
                    animSet.mixer.removeEventListener('finished', handleFinish);
                    onFinish && onFinish();
                }
            };
            animSet.mixer.addEventListener('finished', handleFinish);

            animSet.current = newAction;
        } else {
            animSet.current = null;
            onFinish && onFinish();
        }
    }

    cycleRandomAnimation(chickenIndex) {
        const states = ['idle', 'action'];
        const randomState = states[Math.floor(Math.random() * states.length)];

        this.playChickenAnimation(chickenIndex, randomState, 0.5, () => {
            this.cycleRandomAnimation(chickenIndex);
        });
    }

    getBoundingBox() {
        const box = new Box3();
        box.union(new Box3().setFromObject(this.chickensFenceModel, false));
        this.chickens.forEach((chick) => {
            const chickBox = new Box3().setFromObject(chick, false);
            box.union(chickBox);
        });
        return box;
    }
}
