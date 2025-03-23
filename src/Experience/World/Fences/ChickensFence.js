import Experience from '../../Experience.js';
import {AnimationMixer, Box3, BoxGeometry, Euler, Group, LoopOnce, Mesh, MeshBasicMaterial, Vector3} from "three";
import {copyModel, copySkinningModel} from "../Utils.js";

export default class ChickensFence extends Group {
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

        window.grow = this.setStepsAnimation.bind(this);
        window.harvest = this.harvest.bind(this);
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

    addCoin() {
        this.coin = copyModel(this.coinResource.scene);
        this.coin.rotation.z = Math.PI / 2;
        this.coin.scale.setScalar(2.5);

        this.add(this.coin);

        const size = this.getChickensFenceSize();
        const center = this.getChickensFenceCenter();
        this.coin.position.y = center.y + size.y / 2 + 0.5;
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

    resetSteps() {
        this.isReadyToCollect = false;
        if (this.coin) {
            this.coin.visible = false;
        }
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
            if (this.coin) {
                this.coin.visible = true;
            }
        }, 6000);
    }

    setBoundingMesh() {
        const size = this.getChickensFenceSize();
        const center = this.getChickensFenceCenter();

        const geometry = new BoxGeometry(size.x, size.y, size.z);
        const material = new MeshBasicMaterial({visible: true, wireframe: true});
        this.boundingMesh = new Mesh(geometry, material);
        this.boundingMesh.position.copy(center);
        this.add(this.boundingMesh);
    }

    getChickensFenceBoundingBox() {
        const box = new Box3();
        box.union(new Box3().setFromObject(this.chickensFenceModel, false));
        this.chickens.forEach((chick) => {
            const chickBox = new Box3().setFromObject(chick, false);
            box.union(chickBox);
        });
        return box;
    }

    getChickensFenceSize() {
        return this.getChickensFenceBoundingBox().getSize(new Vector3());
    }

    getChickensFenceCenter() {
        return this.getChickensFenceBoundingBox().getCenter(new Vector3());
    }

    update(delta) {
        if (this.coin && this.coin.visible) {
            this.coin.rotation.y += 0.01;
        }

        this.animations.forEach((animSet) => {
            if (animSet.mixer) {
                animSet.mixer.update(delta);
            }
        });
    }
}
