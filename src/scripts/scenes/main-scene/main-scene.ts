// This scene is responsible for providing presentation for cards stack

import * as PIXI from 'pixi.js';
import * as BezierEasing from 'bezier-easing';
import { Engine, VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "../../core/engine";
import { Button } from '../../ui/button';
import { ButtonGroup } from '../../ui/button-group';
import { BaseScene } from '../base/base-scene';
import { doFadeOutAnimation, doInfiniteFloatAnimation, doInfiniteHeartBeat, doLadderDrop, doFadein, doScaleEasingAnimation, showHammerTask } from './tasks/main-scene-tasks';
import { buttonAtlasImage, iconContinue, iconHammer, imageFinal, imageLogo, newStair1, newStair2, newStair3, okIcon, stairIcon1 } from '../../resources';
import { ObjectsMap, objects, sceneImages } from './scene-objects';
import { ITask } from '../../core/task-runner';

type OptionsFlags<Type> = {
    [Property in keyof Type]: PIXI.Sprite;
};

export class MainScene extends BaseScene {

    objects: OptionsFlags<Partial<ObjectsMap>> & {[index: string]: PIXI.Sprite} = {}
    okButton: Button | undefined;
    buttonsGroup: ButtonGroup<Button<number>> | undefined;

    constructor(protected engine: Engine) {
        super(engine);

        engine.loader
            .add(sceneImages)
            .load(() => this.initializeScene());
    }

    destroy() {
        super.destroy();
    }

    initializeScene(): void {
        super.initialized();

        this.initObjects();
        this.initUI();
    }

    initObjects(): void {
        const loader = this.engine.loader;

        const sprites = Object
            .keys(objects)
            .sort((a, b) => objects[a].order - objects[b].order)
            .map((key) => {
                const meta = objects[key];
                const sprite =  this.objects[key] = new PIXI.Sprite(loader.resources[meta.textureKey].texture);

                if(meta.anchor) {
                    sprite.anchor.set(...meta.anchor);
                }

                if(meta.position) {
                    sprite.position.set(...meta.position);
                }

                if (meta.scale) {
                    sprite.scale.set(...meta.scale);
                }

                return sprite;
            });

        this.sceneContainer.addChild(...sprites);
    }

    initUI(): void {
        this.initOKButton();
        this.initHammerButton();
        this.initLogo();
    }

    initOKButton(): void {
        const loader = this.engine.loader;
        const okButton = new Button({ texture: loader.resources[okIcon].texture });

        okButton.addListener('pointerdown', (event: PIXI.interaction.InteractionEvent) => {
            event.stopPropagation();
            if (this.buttonsGroup) {
                this.buttonsGroup.visible = false;
            }
            this.finishScene();
        }, this);

        this.okButton = okButton;
    }

    finishScene(): void {
        setTimeout(() => {
            const taskRunner = this.engine.taskRunner;
            const taskConfigs = { passed: 0, timeToAnimate: 1000, object: this.sceneContainer };

            taskRunner.addTask(doFadeOutAnimation, taskConfigs);

            this.initFinal();
            this.initContinueButton();
        }, 500);
    }

    initHammerButton(): void {
        const { loader, taskRunner } = this.engine;

        if (this.objects.stair) {
            const stair = this.objects.stair;
            const hammerButtonConfig = { texture: loader.resources[iconHammer].texture };
            const hammerButton = new Button(hammerButtonConfig);
            const { width:hmbW, height:hmbH } = hammerButton;

            hammerButton.anchor.set(.5, .5);
            hammerButton.scale.set(0, 0);

            taskRunner.addTask(showHammerTask, {passed: 0, wait: 1000, callback: () => {
                this.uiContainer.addChild(hammerButton);

                const animationConfig = { passed: 0, timeToAnimate: 1500, object: hammerButton, from: 0, to: 10, dir: 1 };
                const animationTask = taskRunner.addTask(doInfiniteFloatAnimation, animationConfig);

                const { width, height } = stair;
                const { x, y } = stair.position;

                hammerButton.position.set(x +  (hmbW + width) * .5, y + (height + hmbH) * .3);
                hammerButton.addListener('pointerdown', this.hammerButtonHandler, { scene: this, task: animationTask});

                const taskCongigs = { passed: 0, timeToAnimate: 600, object: hammerButton, easing: BezierEasing(0.68, -0.6, 0.32, 1.6) };
                taskRunner.addTask(doScaleEasingAnimation, taskCongigs);
            }});
        }
    }

    hammerButtonHandler(this: {scene: MainScene, task: ITask}, event: PIXI.interaction.InteractionEvent) {
        event.target.removeAllListeners();
        const { task, scene } = this;

        task.stop();
        scene.uiContainer.removeChild(event.target);
        scene.createStairChoiceButtonGroup();
    }

    initContinueButton(): void {
        const { loader, taskRunner } = this.engine;

        const config = { texture: loader.resources[iconContinue].texture };
        const continueButton = new Button(config);

        this.uiContainer.addChild(continueButton);

        continueButton.anchor.set(.5, 0);
        continueButton.position.set(
            VIEWPORT_WIDTH * .5,
            VIEWPORT_HEIGHT - continueButton.height
        );

        const taskConfig = { passed: 0, timeToAnimate: 1000, dir: 1, object: continueButton, easing: BezierEasing(0.37, 0, 0.63, 1) };
        taskRunner.addTask(doInfiniteHeartBeat, taskConfig);
        taskRunner.addTask(doFadein, { passed: 0, timeToAnimate: 1000, stair: continueButton });
    }

    initLogo(): void {
        const { loader, taskRunner } = this.engine;
        const logo =  new PIXI.Sprite(loader.resources[imageLogo].texture);

        logo.anchor.set(.5,.5);
        logo.position.set(logo.width *.5, logo.height *.5);

        this.uiContainer.addChild(logo);

        const taskCongigs = { passed: 0, timeToAnimate: 600, object: logo, easing: BezierEasing(0.68, -0.6, 0.32, 1.6) };
        taskRunner.addTask(doScaleEasingAnimation, taskCongigs);
    }

    initFinal(): void {
        const { loader, taskRunner } = this.engine;
        const finalImage =  new PIXI.Sprite(loader.resources[imageFinal].texture);

        finalImage.position.set(
            (VIEWPORT_WIDTH - finalImage.width) *.5, 
            (VIEWPORT_HEIGHT - finalImage.height * 1.4) *.5
        );

        this.uiContainer.addChild(finalImage);

        taskRunner.addTask(doFadein, { passed: 0, timeToAnimate: 1000, stair: finalImage });
    }

    createStairChoiceButtonGroup() {
        const { loader, taskRunner } = this.engine;
        const buttonsGroup = this.buttonsGroup = new ButtonGroup();
        const buttonsProps = [{
                frame: new PIXI.Rectangle(1, 1, 89, 80),
                position: new PIXI.Point(-140, 140)
            }, {
                frame: new PIXI.Rectangle(90, 1, 89, 80),
                position: new PIXI.Point(-10, 20),
            }, {
                frame: new PIXI.Rectangle(181, 1, 89, 80),
                position: new PIXI.Point(150, -70)
            }];
        const buttonTexture = loader.resources[buttonAtlasImage].texture;
        const iconTexture = loader.resources[stairIcon1].texture;
        const defaultFrame = new PIXI.Rectangle(1, 1, 119, 126);
        const activeFrame = new PIXI.Rectangle(121, 1, 119, 126);
        const stairAnchorPoint = new PIXI.Point(0, 0);

        if (this.objects.stair) {
            this.objects.stair.position.copyTo(stairAnchorPoint);
            stairAnchorPoint.x += this.objects.stair.width * .3;
            stairAnchorPoint.y += this.objects.stair.height * .3;
        }

        buttonsProps.forEach((prop, i) => {
            const button = new Button<number>({
                texture: buttonTexture,
                defaultFrame,
                activeFrame,
                icon: {
                    texture: iconTexture,
                    frame: prop.frame
                }
            });

            button.value = i;
            button.position.set(
                stairAnchorPoint.x + prop.position.x,
                stairAnchorPoint.y + prop.position.y
            );
            button.pivot = new PIXI.Point(button.width * .5, button.height * .5);
            button.scale = new PIXI.Point(0);
            button.addListener('pointerdown', this.stairPreselectHandler, { scene: this, buttonsGroup });

            buttonsGroup.add(button);

            const taskCongigs = { passed: 0, timeToAnimate: 600, object: button, easing: BezierEasing(0.68, -0.6, 0.32, 1.6) };
            taskRunner.addTask(doScaleEasingAnimation, taskCongigs);
        });

        this.uiContainer.addChild(buttonsGroup);
    }

    stairPreselectHandler(this: {scene: MainScene, buttonsGroup: ButtonGroup<Button<number>>}, event: PIXI.interaction.InteractionEvent): void {
        const { scene, buttonsGroup } = this;
        const { loader, taskRunner } = scene.engine;

        const button = event.target as Button<number>;

        if (buttonsGroup.activeButton !== event.currentTarget) {
            if (scene.okButton) {
                button.addChild(scene.okButton);
                scene.okButton.anchor.set(0, -1);
                scene.okButton.position.set((button.width - scene.okButton.width) * .5, 10)
            }
            if (scene.objects.stair) {
                const sprite = scene.objects.stair;
                sprite.position.x = 900;
                sprite.position.y = -20;

                let to = 0;

                switch (button.value) {
                    case 1:
                        sprite.texture = loader.resources[newStair2].texture
                        to = 30;
                        break;
                    case 2:
                        sprite.texture = loader.resources[newStair1].texture
                        to = 25;
                        break;
                    default:
                        sprite.texture = loader.resources[newStair3].texture
                        to = 5;
                        break;
                }

                taskRunner.addTask(doLadderDrop, { passed: 0, timeToAnimate: 200, stair: sprite, from: -20, to });
                taskRunner.addTask(doFadein, { passed: 0, timeToAnimate: 200, stair: sprite });
            }
        }
    }
}