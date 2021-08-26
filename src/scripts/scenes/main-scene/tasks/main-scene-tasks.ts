import * as PIXI from 'pixi.js';
import { ITask } from "../../../core/task-runner";

export function doLadderDrop(delta: number, context: {passed: number, timeToAnimate: number, stair: PIXI.Sprite, from: number, to: number}, task: ITask) {
    context.passed += delta;

    const range = context.to - context.from;
    const step =  context.passed / context.timeToAnimate;

    context.stair.position.y = context.from +  range * step;

    if (context.passed >= context.timeToAnimate) {
        context.stair.position.y = context.to;
        task.stop();
    }
}

export function doFadein(delta: number, context: {passed: number, timeToAnimate: number, stair: PIXI.Sprite}, task: ITask) {
    context.passed += delta;

    context.stair.alpha = context.passed / context.timeToAnimate;

    if (context.passed >= context.timeToAnimate) {
        context.stair.alpha = 1;
        task.stop();
    }
}

export function doInfiniteFloatAnimation(delta: number, context: {passed: number, timeToAnimate: number, object: PIXI.DisplayObject, from: number, to: number, dir: number}/*, task: ITask*/) {
    context.passed += delta;

    const range = context.to - context.from;
    const step =  range / context.timeToAnimate;

    context.object.position.y += step * delta * context.dir;

    if (context.passed >= context.timeToAnimate) {
        context.dir *= -1;
        context.passed = 0;
    }
}

export function doScaleEasingAnimation(
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

export function doInfiniteHeartBeat(
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

export function showHammerTask(delta: number, context: {passed: 0, wait: number, callback: () => void }, task: ITask) {
    context.passed += delta;

    if (context.passed >= context.wait) {
        task.stop();
        context.callback();
    }
}

export function doFadeOutAnimation(delta: number, context: { passed: number, timeToAnimate: number, object: PIXI.DisplayObject }, task: ITask) {
    context.passed += delta;

    context.object.alpha =  Math.max(.3, 1 - context.passed / context.timeToAnimate);

    if (context.passed >= context.timeToAnimate) {
        task.stop();
    }
};