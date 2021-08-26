// This scene is responsible for providing presentation for cards stack

import * as PIXI from 'pixi.js';
import * as BezierEasing from 'bezier-easing';
import { Engine, VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "../../core/engine";
import { ITask } from "../../core/task-runner";
import { backPng, buttonAtlasImage, iconContinue, iconHammer, imageAustin, imageBookStand, imageCouch, imageGlobe, imagePlant1, imagePlant2, imageTable, newStair1, newStair2, newStair3, okIcon, oldStair, stairIcon1 } from '../../resources';
import { Button } from '../../ui/button';
import { ButtonGroup } from '../../ui/button-group';
import { BaseScene } from '../base-scene';

function doLadderDrop(delta: number, context: {passed: number, timeToAnimate: number, stair: PIXI.Sprite, from: number, to: number}, task: ITask) {
    context.passed += delta;

    const range = context.to - context.from;
    const step =  context.passed / context.timeToAnimate;

    context.stair.position.y = context.from +  range * step;

    if (context.passed >= context.timeToAnimate) {
        context.stair.position.y = context.to;
        task.stop();
    }
}

function doLadderFadein(delta: number, context: {passed: number, timeToAnimate: number, stair: PIXI.Sprite}, task: ITask) {
    context.passed += delta;

    context.stair.alpha = context.passed / context.timeToAnimate;

    if (context.passed >= context.timeToAnimate) {
        context.stair.alpha = 1;
        task.stop();
    }
}

function doInfiniteFloatAnimation(delta: number, context: {passed: number, timeToAnimate: number, object: PIXI.DisplayObject, from: number, to: number, dir: number}/*, task: ITask*/) {
    context.passed += delta;

    const range = context.to - context.from;
    const step =  range / context.timeToAnimate;

    context.object.position.y += step * delta * context.dir;

    if (context.passed >= context.timeToAnimate) {
        context.dir *= -1;
        context.passed = 0;
    }
}

function doScaleEasingAnimation(
    delta: number, 
    context: {passed: number, timeToAnimate: number, object: PIXI.DisplayObject, easing: BezierEasing.EasingFunction }, 
    task: ITask) {
        context.passed += delta;

        const value =  context.easing(context.passed / context.timeToAnimate);
        context.object.scale = new PIXI.Point(value, value);

        if (context.passed >= context.timeToAnimate) {
            task.stop();
        }
}

function doInfiniteHeartBeat(
    delta: number, 
    context: {passed: number, timeToAnimate: number, dir: number, object: PIXI.DisplayObject, easing: BezierEasing.EasingFunction }) {
        context.passed += delta;

        const unit = context.passed / context.timeToAnimate;
        const easingInput = context.dir === 1 ? unit : 1 - unit;
        const value = 1 + context.easing(easingInput) * .04;

        context.object.scale.x = value;
        context.object.scale.y = value;

        if (context.passed >= context.timeToAnimate) {
            context.dir *= -1;
            context.passed = 0;
        }
}

export class MainScene extends BaseScene {

    objects: {
        stair: PIXI.Sprite
    } = { 
        stair: new PIXI.Sprite()
    };

    constructor(protected engine: Engine) {
        super(engine);

        const { loader } = engine;
        loader
            .add(backPng)
            .add(oldStair)
            .add(newStair1)
            .add(newStair2)
            .add(newStair3)
            .add(buttonAtlasImage)
            .add(stairIcon1)
            .add(okIcon)
            .add(iconHammer)
            .add(iconContinue)
            .add(imageCouch)
            .add(imageGlobe)
            .add(imageTable)
            .add(imageBookStand)
            .add(imagePlant1)
            .add(imagePlant2)
            .add(imageAustin)
            .load(() => this.initializeScene());
    }

    destroy() {
        super.destroy();
    }

    private initializeScene(): void {
        super.initialized();

        const { loader } = this.engine;

        const backgroundSprite = new PIXI.Sprite(loader.resources[backPng].texture);

        backgroundSprite.position.set(0, 0);
        
        this.sceneContainer.addChild(backgroundSprite);

        this.initDecors();
        this.initHammerButton();
        this.initContinueButton();
    }

    createStairChoiceButtonGroup() {
        const { loader, taskRunner } = this.engine;
        const buttonsGroup = new ButtonGroup();
        this.uiContainer.addChild(buttonsGroup);

        const OkButton = new Button({
            texture: loader.resources[okIcon].texture,
        });
        OkButton.interactive = true;
        OkButton.addListener('pointerdown', (event: PIXI.interaction.InteractionEvent) => {
            event.stopPropagation();
            buttonsGroup.visible = false;
        }, this);

        const buttonsProps = [
            {
                frame: new PIXI.Rectangle(1, 1, 89, 80),
                position: new PIXI.Point(-140, 140)
            },
            {
                frame: new PIXI.Rectangle(90, 1, 89, 80),
                position: new PIXI.Point(-30, 10),
            },
            {
                frame: new PIXI.Rectangle(181, 1, 89, 80),
                position: new PIXI.Point(110, -70)
            }
        ];
        const buttonTexture = loader.resources[buttonAtlasImage].texture;
        const iconTexture = loader.resources[stairIcon1].texture;
        const defaultFrame = new PIXI.Rectangle(1, 1, 119, 126);
        const activeFrame = new PIXI.Rectangle(121, 1, 119, 126);
        const stairAnchorPoint = new PIXI.Point(0,0);

        this.objects.stair.position.copyTo(stairAnchorPoint);

        stairAnchorPoint.x += this.objects.stair.width * .3;
        stairAnchorPoint.y += this.objects.stair.height * .3;
        
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
            button.pivot= new PIXI.Point(button.width * .5,  button.height * .5);
            button.scale = new PIXI.Point(0);

            button.addListener('pointerdown', (event: PIXI.interaction.InteractionEvent) => {
                if (buttonsGroup.activeButton !== event.currentTarget) {
                    OkButton.position.set(0,0);
                    if (OkButton.parent) {
                        OkButton.parent.removeChild(OkButton);
                    }

                    const button = event.currentTarget as Button<number>;
                    button.addChild(OkButton);
                    OkButton.position.x = (defaultFrame.width - OkButton.width) * .5;
                    OkButton.position.y = button.height - 20;
                    
                    const sprite = this.objects.stair;
                    sprite.position.x = 900;
                    sprite.position.y = -20;
                    let to = 0;
                    switch(button.value) {
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
                    taskRunner.addTask(doLadderFadein, { passed: 0, timeToAnimate: 200, stair: sprite });
                }
            }, this);

            buttonsGroup.add(button);

            const easing = BezierEasing(0.68, -0.6, 0.32, 1.6);
            taskRunner.addTask(
                doScaleEasingAnimation, 
                { passed: 0, timeToAnimate: 600, object: button, easing }
            );
        });
    }

    initHammerButton(): void {
        const { loader, taskRunner } = this.engine;
        const p = this.objects.stair.position;

        const hammerButton = new Button({
            texture: loader.resources[iconHammer].texture
        });

        hammerButton.interactive = true;
        hammerButton.position.set(p.x + this.objects.stair.width * .5, p.y + this.objects.stair.height * .3);
        hammerButton.addListener('pointerdown', () => {
            floatAnimationTask.stop();
            hammerButton.removeAllListeners();
            this.uiContainer.removeChild(hammerButton);
            this.createStairChoiceButtonGroup();
        }, this);

        this.uiContainer.addChild(hammerButton);
        const floatAnimationTask = taskRunner.addTask(
            doInfiniteFloatAnimation, 
            { passed: 0, timeToAnimate: 1500, object: hammerButton, from: 0, to: 10, dir: 1, }
        );
    }

    initContinueButton(): void {
        const { loader, taskRunner } = this.engine;
        const continueButton = new Button({
           texture: loader.resources[iconContinue].texture
       });

       continueButton.anchor.set(.5, 0);
       
       continueButton.position.set(
           VIEWPORT_WIDTH * .5,
           VIEWPORT_HEIGHT - continueButton.height
       );

       this.uiContainer.addChild(continueButton);

       const easing = BezierEasing(0.37, 0, 0.63, 1);
       taskRunner.addTask(doInfiniteHeartBeat, {
           passed: 0,
           timeToAnimate: 1000,
           dir: 1,
           object: continueButton,
           easing
       });
    }

    initDecors(): void {
        const {loader } = this.engine;
        const couchSprite = new PIXI.Sprite(loader.resources[imageCouch].texture);
        const globeSprite = new PIXI.Sprite(loader.resources[imageGlobe].texture);
        const tableSprite = new PIXI.Sprite(loader.resources[imageTable].texture);
        const bookStandSprite = new PIXI.Sprite(loader.resources[imageBookStand].texture);
        const plant1Sprite = new PIXI.Sprite(loader.resources[imagePlant1].texture);
        const plant2Sprite = new PIXI.Sprite(loader.resources[imagePlant2].texture);
        const austinSprite = new PIXI.Sprite(loader.resources[imageAustin].texture);
        const stairSprite = new PIXI.Sprite(loader.resources[oldStair].texture);

        couchSprite.anchor.set(0, 1);
        couchSprite.position.set(0, this.sceneContainer.height);

        globeSprite.anchor.set(.2, .5);
        globeSprite.position.set(0, this.sceneContainer.height * .35);

        tableSprite.anchor.set(.5,.5);
        tableSprite.position.set(300, 300);

        bookStandSprite.anchor.set(.5,.5);
        bookStandSprite.position.set(950, 120);

        plant1Sprite.anchor.set(.5,.5);
        plant1Sprite.position.set(500, 50);

        plant2Sprite.anchor.set(.5,1);
        plant2Sprite.position.set(1300, this.sceneContainer.height);

        austinSprite.anchor.set(.5,1);
        austinSprite.position.set(1000, 350);
        austinSprite.scale.x *= -1;

        stairSprite.position.set(833, 38);
        this.objects = { stair: stairSprite }

        this.sceneContainer.addChild(couchSprite);
        this.sceneContainer.addChild(globeSprite);
        this.sceneContainer.addChild(tableSprite);
        this.sceneContainer.addChild(bookStandSprite);
        this.sceneContainer.addChild(plant1Sprite);
        this.sceneContainer.addChild(austinSprite);
        this.sceneContainer.addChild(stairSprite);
        this.sceneContainer.addChild(plant2Sprite);
    }
}