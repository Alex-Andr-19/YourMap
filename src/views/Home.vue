<script setup lang="ts">
import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import { onMounted } from "vue";
import { useGeographic } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import { Feature } from "ol";
import { Circle, Point } from "ol/geom";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import CircleStyle from "ol/style/Circle.js";
import { XYZ } from "ol/source";

/**
 * longitude, latitude
 *
 * широта, долгота
 */
type CoordinateType = [number, number];

const center: CoordinateType = [44.002, 56.3287];
const extent = [center[0] - 1, center[1] - 0.5, center[0] + 1, center[1] + 0.5];
const zoom = 11;

const firstPoint: CoordinateType = [43.84, 56.37];
const secondPoint: CoordinateType = [44.15, 56.24];

const myStyle = new Style({
    image: new CircleStyle({
        radius: 10,
        fill: new Fill({ color: "#ff0000" }),
        stroke: new Stroke({ color: "#fff", width: 2 }),
    }),
});

function randNumberWithBorders(left: number, right: number): number {
    const percent = Math.random();
    return left + percent * (right - left);
}

function generatePoints(count: number = 50): CoordinateType[] {
    const res: CoordinateType[] = [];

    for (let i = 0; i < count; i++) {
        const long = randNumberWithBorders(firstPoint[0], secondPoint[0]);
        const lat = randNumberWithBorders(firstPoint[1], secondPoint[1]);

        res.push([long, lat]);
    }

    return res;
}

function createMap() {
    useGeographic();

    const baseLayer = new TileLayer({
        source: new OSM(),
    });
    // const baseLayer = new TileLayer({
    //     source: new XYZ({
    //         url: "https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    //         attributions: '&copy; <a href="https://carto.com/">CARTO</a>',
    //     }),
    // });

    const point1 = new Feature(new Point(firstPoint));
    const point2 = new Feature(new Point(secondPoint));

    const points: Feature[] = [];
    const pointsCoords = generatePoints(1000);
    for (let el of pointsCoords) {
        points.push(new Feature(new Point(el)));
        points[points.length - 1]?.setStyle(myStyle);
    }

    const dataLayer = new VectorLayer({
        source: new VectorSource({ features: [point1, point2, ...points] }),
    });

    // baseLayer.on("prerender", () => {
    //     const renderer = (baseLayer as any).getRenderer?.();
    //     const canvas = renderer?.container;
    //     if (canvas instanceof HTMLCanvasElement || canvas instanceof HTMLElement) {
    //         canvas.style.filter = "invert(100%) grayscale(100%) brightness(100%) contrast(125%)";
    //     }
    // });
    baseLayer.on("prerender", (evt) => {
        // return
        if (evt.context) {
            const context = evt.context as CanvasRenderingContext2D;
            context.filter = "grayscale(80%) invert(100%) ";
            context.globalCompositeOperation = "source-over";
        }
    });
    baseLayer.on("postrender", (evt) => {
        if (evt.context) {
            const context = evt.context as CanvasRenderingContext2D;
            context.filter = "none";
        }
    });

    const map = new Map({
        target: "map",
        layers: [baseLayer, dataLayer],
        view: new View({
            center,
            zoom,
            // extent,
        }),
    });
}

onMounted(() => {
    createMap();
});
</script>

<template>
    <div class="map-container debug-indicator">
        <h2>map-container</h2>

        <div id="map"></div>
    </div>
</template>

<style lang="scss" scoped src="./style.scss"></style>
