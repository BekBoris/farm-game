import Experience from '../../Experience.js';
import {AnimationMixer, Box3, LoopOnce} from "three";
import {copyModel, copySkinningModel} from "../Utils.js";
import FencesAbstract from "./FencesAbstract.js";

export default class CowsFence extends FencesAbstract {
    constructor() {
        super();
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;
        this.mixer = new AnimationMixer();

        this.cowsFenceResource = this.resources.items.cowsFenceModel;
        this.cowResource = this.resources.items.cowModel;
        this.coinResource = this.resources.items.coinModel;

        this.cowsFenceModel = null;
        this.cowLeftModel = null;
        this.cowRightModel = null;
        this.boundingMesh = null;
        this.isReadyToCollect = false;

        this.animations = {
            cowLeftAnimation: {
                mixer: null,
                idle: null,
                action: null,
                current: null
            },
            cowRightAnimation: {
                mixer: null,
                idle: null,
                action: null,
                current: null
            }
        };

        this.create();
        this.addCoin();
        this.setAnimations();
        this.setBoundingMesh();
        this.setBrightness(1.01);
        this.resetSteps();

        this.cycleRandomAnimation('left');
        this.cycleRandomAnimation('right');
    }

    create() {
        this.cowsFenceModel = copyModel(this.cowsFenceResource.scene);

        this.cowLeftModel = copySkinningModel(this.cowResource.scene);
        this.cowLeftModel.position.set(1.5, 0, 0);

        this.cowRightModel = copySkinningModel(this.cowResource.scene);
        this.cowRightModel.position.set(-1.5, 0, 0);

        this.add(this.cowsFenceModel);
        this.add(this.cowLeftModel, this.cowRightModel);

    }

    playCowAnimation(cowKey, animationName, crossFadeDuration = 0.5, onFinish = null) {

        const animSet = (cowKey === 'left')
            ? this.animations.cowLeftAnimation
            : this.animations.cowRightAnimation;

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

    cycleRandomAnimation(cowKey) {

        const states = ['idle', 'action'];
        const randomState = states[Math.floor(Math.random() * states.length)];

        this.playCowAnimation(cowKey, randomState, 0.5, () => {
            this.cycleRandomAnimation(cowKey);
        });
    }

    setAnimations() {
        const leftCowMixer = new AnimationMixer(this.cowLeftModel);
        this.animations.cowLeftAnimation.mixer = leftCowMixer;

        const rightCowMixer = new AnimationMixer(this.cowRightModel);
        this.animations.cowRightAnimation.mixer = rightCowMixer;

        this.animations.cowLeftAnimation.idle = leftCowMixer.clipAction(this.cowResource.animations[0]);
        this.animations.cowLeftAnimation.action = leftCowMixer.clipAction(this.cowResource.animations[1]);

        this.animations.cowRightAnimation.idle = rightCowMixer.clipAction(this.cowResource.animations[0]);
        this.animations.cowRightAnimation.action = rightCowMixer.clipAction(this.cowResource.animations[1]);
    }

    getBoundingBox() {
        const box = new Box3();
        [this.cowLeftModel, this.cowRightModel, this.cowsFenceModel].forEach((model) => {
            const modelBox = new Box3().setFromObject(model, true);
            box.union(modelBox);
        });
        return box;
    }
}
