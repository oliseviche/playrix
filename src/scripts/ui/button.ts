import * as PIXI from 'pixi.js';
import { IStateButton } from './interfaces/IStateButton';

export class Button<T = unknown> extends PIXI.Sprite implements IStateButton {
    activeSprite?: PIXI.Sprite;
    iconSprite: PIXI.Sprite | undefined;
    value: T | undefined;

    private _selected: boolean = false;

    constructor(public config: {
        texture: PIXI.Texture,
        defaultFrame?: PIXI.Rectangle,
        activeFrame?: PIXI.Rectangle,
        icon?: {
            texture: PIXI.Texture,
            frame: PIXI.Rectangle
        }
    }) {
        super();

        const children = [];

        this.interactive = true;
        this.texture = config.texture;

        if (this.config.defaultFrame) {
            this.texture.frame = this.config.defaultFrame;
        }

        if (this.config.activeFrame) {
            this.activeSprite = new PIXI.Sprite(new PIXI.Texture(config.texture.baseTexture));
            this.activeSprite.renderable = false;
            this.activeSprite.texture.frame = this.config.activeFrame;

            children.push(this.activeSprite);
        }

        const icon = this.config.icon
        if (icon) {
            this.iconSprite = new PIXI.Sprite(new PIXI.Texture(icon.texture.baseTexture));
            this.iconSprite.texture.frame = icon.frame;
            this.iconSprite.anchor.set(.5, .5);
            this.iconSprite.position.set(this.width * .5, this.height * .5);

            children.push(this.iconSprite);
        }

        if (children.length) {
            this.addChild(...children);
        }

        this.addListener('pointerdown', this.clickHandler, this);
    }

    get selected(): boolean {
        return this._selected;
    }

    set selected(value: boolean) {
        this._selected = value;
        this.updateView();
    }

    destroy() {
        this.removeAllListeners();
    }

    protected clickHandler() {
        this.selected = true;
    }

    protected select(): void {
        this.selected = true;
    }

    protected updateView() {
        if (this.activeSprite) {
            this.activeSprite.renderable = this.selected;
        }
    }
}