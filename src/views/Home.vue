<script setup lang="ts">
import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import { onMounted } from "vue";
import { useGeographic } from "ol/proj";

// 56,3287 44,002

const center: [number, number] = [44.002, 56.3287];
const extent = [center[0] - 1, center[1] - 0.5, center[0] + 1, center[1] + 0.5];
const zoom = 12;

function createMap() {
    useGeographic();

    const baseLayer = new TileLayer({
        source: new OSM(),
    });

    baseLayer.on("prerender", () => {
        const renderer = (baseLayer as any).getRenderer?.();
        const canvas = renderer?.container;
        if (canvas instanceof HTMLCanvasElement || canvas instanceof HTMLElement) {
            canvas.style.filter = "invert(100%) grayscale(100%) brightness(100%) contrast(125%)";
        }
    });

    const map = new Map({
        target: "map",
        layers: [baseLayer],
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
