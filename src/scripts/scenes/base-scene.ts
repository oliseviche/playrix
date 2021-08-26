// The second main workhorse after engine.
// Incapsulates application logic for scenery. Provides common API for concrete
// scenese like helper UI components and cleanup routines

import * as PIXI from 'pixi.js';
import { Engine } from "../core/engine";
//import { ITask } from "../core/task-runner";

// const backButtonStyle = new PIXI.TextStyle({
//     fontFamily: 'Arial',
//     fontSize: 36,
//     fontStyle: 'italic',
//     fontWeight: 'bold',
//     fill: ['#ffffff', '#00ff99'], // gradient
//     stroke: '#4a1850',
//     strokeThickness: 5,
//     dropShadow: true,
//     dropShadowColor: '#000000',
//     dropShadowBlur: 4,
//     dropShadowAngle: Math.PI / 6,
//     dropShadowDistance: 6,
//     wordWrap: true,
//     wordWrapWidth: 440,
//     lineJoin: 'round',
// });

export interface IScene {
    initialized(): void
    destroy(): void
}

export interface SceneConstructor {
    new (engine: Engine): BaseScene
}

export abstract class BaseScene implements IScene {
    protected sceneContainer: PIXI.Container;
    protected uiContainer: PIXI.Container;

    protected get screenWidth() {
        return this.engine.renderer.screen.width;
    }

    protected get screenHeight() {
        return this.engine.renderer.screen.height;
    }

    constructor(protected engine: Engine) {
        this.sceneContainer = new PIXI.Container();
        this.uiContainer = new PIXI.Container();

        this.engine.stage.addChild(this.sceneContainer);
        this.engine.stage.addChild(this.uiContainer);
    }

    initialized() {
    }

    destroy() {
        this.engine.loader.reset();
        this.engine.taskRunner.stopAll();
        this.engine.stage.removeChildren()
            .forEach(child => child.destroy());
    }
}