import { VIEWPORT_HEIGHT } from "../../core/engine";
import { backPng, buttonAtlasImage, iconContinue, iconHammer, imageAustin, imageBookStand, imageCouch, imageFinal, imageGlobe, imageLogo, imagePlant1, imagePlant2, imageTable, newStair1, newStair2, newStair3, okIcon, oldStair, stairIcon1 } from "../../resources";

export type ObjectMeta = {
    order: number,
    textureKey: string
} & Partial<{
    anchor: [number, number],
    position: [number, number],
    scale: [number, number]
}>;

export type ObjectsMap = {
    background: ObjectMeta,
    couch: ObjectMeta
    globe: ObjectMeta
    table: ObjectMeta
    bookStand: ObjectMeta
    plant1: ObjectMeta
    austin: ObjectMeta
    stair: ObjectMeta
    plant2: ObjectMeta
}

export const sceneImages = [backPng, oldStair, newStair1, newStair2, newStair3, buttonAtlasImage, stairIcon1, okIcon, iconHammer, iconContinue, imageCouch, imageGlobe, imageTable, imageBookStand, imagePlant1, imagePlant2, imageAustin, imageLogo, imageFinal];

export const objects: {[index: string]: ObjectMeta} & ObjectsMap = {
    background: {
        order: 0,
        textureKey: backPng,
    },
    couch: {
        order: 1,
        textureKey: imageCouch,
        anchor: [0, 1],
        position: [0, VIEWPORT_HEIGHT]
    },
    globe: {
        order: 2,
        textureKey: imageGlobe,
        anchor: [.2, .5],
        position: [0, VIEWPORT_HEIGHT * .35]
    },
    table: {
        order: 3,
        textureKey: imageTable,
        anchor: [.5, .5],
        position: [300, 300]
    },
    bookStand: {
        order: 4,
        textureKey: imageBookStand,
        anchor: [.5, .5],
        position: [950, 120]
    },
    plant1: { 
        order: 5,
        textureKey: imagePlant1,
        anchor: [.5, .5],
        position: [500, 50]
    },
    austin: { 
        order: 6,
        textureKey: imageAustin,
        anchor: [.5, 1],
        position: [1050, 350],
        scale: [-1, 1]
    },
    stair: { 
        order: 7,
        textureKey: oldStair,
        position: [833, 38]
    },
    plant2: {
        order: 8,
        textureKey: imagePlant2,
        anchor: [.5, 1],
        position: [1300, VIEWPORT_HEIGHT]
    },
}
