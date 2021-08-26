import * as PIXI from 'pixi.js';
import { IStateButton } from './interfaces/IStateButton';

export class ButtonGroup<T extends IStateButton & PIXI.DisplayObject> extends PIXI.Container {
    buttons: T[] = [];
    activeButton: T | undefined;

    constructor() {
        super();
        this.interactive = true;
        this.addListener('pointerdown', this.itemSelectedHandler, this);
    }

    add(button: T): void {
        this.buttons.push(button);
        this.addChild(button);
    }

    itemSelectedHandler(event: PIXI.interaction.InteractionEvent) {
        const selectedButton = this.buttons.find(v => v === event.target);

        if (selectedButton) {
            if (this.activeButton) {
                this.activeButton.selected = false;
            }
            this.activeButton = selectedButton;
            this.activeButton.selected = true;
        }
    }

    destroy() {
        this.removeListener('pointerdown', this.itemSelectedHandler, this);
        super.destroy();
    }
}