// Main workhorse
// Initialize PIXI and creates helper classes for orchestrating tasks, resources, scenes

import * as PIXI from 'pixi.js'
import { SceneDirector } from './scene-director';
import { TaskRunner } from "./task-runner";

export const VIEWPORT_WIDTH = 1360;
export const VIEWPORT_HEIGHT = 640;

export class Engine {
    loader: PIXI.Loader;
    renderer: PIXI.Renderer;
    stage: PIXI.Container;
    taskRunner: TaskRunner;
    sceneDirector: SceneDirector;

    private container: HTMLElement;

    constructor() {
        const pixelRatio = window.devicePixelRatio;

        this.loader = PIXI.Loader.shared;
        this.renderer = PIXI.autoDetectRenderer({
            width: VIEWPORT_WIDTH,
            height: VIEWPORT_HEIGHT,
            antialias: false,
            autoDensity: true,
            resolution: pixelRatio,
            transparent: true
        });

        this.stage = new PIXI.Container();

        this.renderer.view.style.transform  = "translate(-50%, -50%)";
        this.renderer.view.style.position = 'absolute';
        this.renderer.view.style.top = "50%";
        this.renderer.view.style.left = "50%";

        this.taskRunner = new TaskRunner();
        this.sceneDirector = new SceneDirector(this);

        this.resizeView();

        this.container = document.getElementById('game') || document.body;
        this.container.appendChild(this.renderer.view);

        window.addEventListener('resize', () => this.resizeView());
    }

    getScreenDimenions(): { width: number, height: number } {
        const rect = document.body.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
    }

    resizeView() {
        const dimensions = this.getScreenDimenions();
        const ratio = 
        Math.min(
            dimensions.width / VIEWPORT_WIDTH,
            dimensions.height / VIEWPORT_HEIGHT
        );

        this.stage.scale.x = this.stage.scale.y = ratio;
        this.renderer.resize(
            Math.ceil(VIEWPORT_WIDTH * ratio),
            Math.ceil(VIEWPORT_HEIGHT * ratio)
        );

        console.log(this.stage.width, this.stage.height)
    }
}