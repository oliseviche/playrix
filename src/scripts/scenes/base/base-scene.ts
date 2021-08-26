// The second main workhorse after engine.
// Incapsulates application logic for scenery. Provides common API for concrete
// scenese like helper UI components and cleanup routines

import * as PIXI from 'pixi.js';
import { Engine } from "../../core/engine";

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