// Scene director is responsible for correct scene managment,
// theirs 'in' and 'out' lifecycles 

import { Engine } from "./engine";
import { BaseScene, SceneConstructor } from "../scenes/base/base-scene";

export class SceneDirector {
    private scenes: SceneConstructor[] = [];
    private activeScene : BaseScene | undefined;

    constructor(private engine: Engine) {}

    push(constructor: SceneConstructor) {
        this.activeScene?.destroy();
        this.scenes.unshift(constructor);
        this.activeScene = new constructor(this.engine);
    }

    pop() {
        this.activeScene?.destroy();
        this.scenes.shift();

        if (this.scenes.length) {
            this.activeScene = new this.scenes[0](this.engine);
        }
    }
}