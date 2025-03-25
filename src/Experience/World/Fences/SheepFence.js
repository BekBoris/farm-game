import Experience from '../../Experience.js';
import {AnimationMixer, Box3, LoopOnce} from "three";
import {copyModel, copySkinningModel} from "../Utils.js";
import FencesAbstract from "./FencesAbstract.js";

export default class SheepFence extends FencesAbstract {
    constructor() {
        super();

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;

        this.sheepFenceResource = this.resources.items.sheepFenceModel;
        this.sheepResource = this.resources.items.sheepModel;
        this.coinResource = this.experience.resources.items.coinModel;

        this.sheepFenceModel = null;
        this.sheepLeftModel = null;
        this.sheepMiddleModel = null;
        this.sheepRightModel = null;
        this.boundingMesh = null;
        this.coin = null;
        this.isReadyToCollect = false;

        this.animations = {
            sheepLeftAnimation: {
                mixer: null,
                idle: null,
                action: null,
                current: null
            },
            sheepMiddleAnimation: {
                mixer: null,
                idle: null,
                action: null,
                current: null
            },
            sheepRightAnimation: {
                mixer: null,
                idle: null,
                action: null,
                current: null
            }
        };

        this.create();
        this.addCoin();
        this.setSheepAnimations();
        this.setBoundingMesh();
        this.setBrightness(1.01);
        this.resetSteps();

        this.cycleRandomAnimation('left');
        this.cycleRandomAnimation('middle');
        this.cycleRandomAnimation('right');
    }

    create() {
        this.sheepFenceModel = copyModel(this.sheepFenceResource.scene);

        this.sheepLeftModel = copySkinningModel(this.sheepResource.scene);
        this.sheepLeftModel.position.set(1.5, 0, 0);

        this.sheepMiddleModel = copySkinningModel(this.sheepResource.scene);
        this.sheepMiddleModel.position.set(0, 0, 0);

        this.sheepRightModel = copySkinningModel(this.sheepResource.scene);
        this.sheepRightModel.position.set(-1.5, 0, 0);

        this.add(this.sheepFenceModel);
        this.add(this.sheepLeftModel, this.sheepMiddleModel, this.sheepRightModel);
    }

    setSheepAnimations() {
        const leftSheepMixer = new AnimationMixer(this.sheepLeftModel);
        this.animations.sheepLeftAnimation.mixer = leftSheepMixer;
        this.animations.sheepLeftAnimation.idle =
            leftSheepMixer.clipAction(this.sheepResource.animations[0]);
        this.animations.sheepLeftAnimation.action =
            leftSheepMixer.clipAction(this.sheepResource.animations[1]);

        const middleSheepMixer = new AnimationMixer(this.sheepMiddleModel);
        this.animations.sheepMiddleAnimation.mixer = middleSheepMixer;
        this.animations.sheepMiddleAnimation.idle =
            middleSheepMixer.clipAction(this.sheepResource.animations[0]);
        this.animations.sheepMiddleAnimation.action =
            middleSheepMixer.clipAction(this.sheepResource.animations[1]);

        const rightSheepMixer = new AnimationMixer(this.sheepRightModel);
        this.animations.sheepRightAnimation.mixer = rightSheepMixer;
        this.animations.sheepRightAnimation.idle =
            rightSheepMixer.clipAction(this.sheepResource.animations[0]);
        this.animations.sheepRightAnimation.action =
            rightSheepMixer.clipAction(this.sheepResource.animations[1]);
    }

    playSheepAnimation(sheepKey, animationName, crossFadeDuration = 0.5, onFinish = null) {
        let animSet;
        if (sheepKey === 'left') {
            animSet = this.animations.sheepLeftAnimation;
        } else if (sheepKey === 'middle') {
            animSet = this.animations.sheepMiddleAnimation;
        } else {
            animSet = this.animations.sheepRightAnimation;
        }

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

    cycleRandomAnimation(sheepKey) {
        const states = ['idle', 'action'];
        const randomState = states[Math.floor(Math.random() * states.length)];

        this.playSheepAnimation(sheepKey, randomState, 0.5, () => {
            this.cycleRandomAnimation(sheepKey);
        });
    }

    getBoundingBox() {
        const box = new Box3();
        [this.sheepFenceModel, this.sheepLeftModel, this.sheepMiddleModel, this.sheepRightModel].forEach((model) => {
            const modelBox = new Box3().setFromObject(model, true);
            box.union(modelBox);
        });
        return box;
    }
}
