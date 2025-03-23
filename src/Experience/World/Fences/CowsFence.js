import Experience from '../../Experience.js';
import {AnimationMixer, Box3, BoxGeometry, Group, LoopOnce, Mesh, MeshBasicMaterial, Vector3} from "three";
import {copyModel, copySkinningModel} from "../Utils.js";

export default class CowsFence extends Group {
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
        this.resetSteps();

        this.cycleRandomAnimation('left');
        this.cycleRandomAnimation('right');

        window.grow = this.setStepsAnimation.bind(this);
        window.harvest = this.harvest.bind(this);
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

    addCoin() {
        this.coin = copyModel(this.coinResource.scene);
        this.coin.rotation.z = Math.PI / 2;
        this.coin.scale.setScalar(2.5);

        this.add(this.coin);

        const size = this.getCowFenceSize();
        const center = this.getCowFenceCenter();

        this.coin.position.y = center.y + size.y / 2 + 0.5;
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

    resetSteps() {
        this.isReadyToCollect = false;
        this.coin.visible = false;
    }

    harvest() {
        if (this.isReadyToCollect) {
            this.resetSteps();
            this.setStepsAnimation();
        }
    }

    setStepsAnimation() {

        this.resetSteps();

        setTimeout(() => {
            this.isReadyToCollect = true;
            this.coin.visible = true;
        }, 6000);
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

    setBoundingMesh() {
        const size = this.getCowFenceSize();
        const center = this.getCowFenceCenter();
        const geometry = new BoxGeometry(size.x, size.y, size.z);
        const material = new MeshBasicMaterial({visible: true, wireframe: true});
        this.boundingMesh = new Mesh(geometry, material);
        this.boundingMesh.position.copy(center);
        this.add(this.boundingMesh);
    }

    getCowFenceBoundingBox() {
        const box = new Box3();
        [this.cowLeftModel, this.cowRightModel, this.cowsFenceModel].forEach((model) => {
            const modelBox = new Box3().setFromObject(model, true);
            box.union(modelBox);
        });
        return box;
    }

    getCowFenceSize() {
        return this.getCowFenceBoundingBox().getSize(new Vector3());
    }

    getCowFenceCenter() {
        return this.getCowFenceBoundingBox().getCenter(new Vector3());
    }

    update(delta) {
        if (this.coin && this.coin.visible) {
            this.coin.rotation.y += 0.01;
        }

        Object.values(this.animations).forEach((key) => {
            if (key.mixer) key.mixer.update(delta * 0.45);
        });
    }
}
