<script setup lang="ts">
import { onMounted } from "vue";
import { YourMap } from "@/helpers/YourMap";
import { generateGeoJSON } from "@/helpers/GenerateGeoJSON";

function getData(): Promise<GeoJSON.FeatureCollection> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(generateGeoJSON(200));
        }, 2000);
    });
}

function createMap() {
    const geojson = generateGeoJSON(200);

    const map = new YourMap();
    getData().then((res) => {
        map.setData(res);
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
