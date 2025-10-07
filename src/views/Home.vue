<script setup lang="ts">
import { onMounted } from "vue";
import { YourMap } from "@/helpers/YourMap";
import { generateGeoJSON } from "@/helpers/GenerateGeoJSON";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style, { type StyleLike } from "ol/style/Style";
import Text from "ol/style/Text";

function getData(): Promise<GeoJSON.FeatureCollection> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(generateGeoJSON(200));
        }, 1000);
    });
}

const localStyleFunction: StyleLike = (feature) => {
    const size = feature.get("features").length;
    return new Style({
        image: new CircleStyle({
            radius: 10,
            stroke: new Stroke({
                color: "#ff0",
            }),
            fill: new Fill({
                color: "#339900",
            }),
        }),
        text: new Text({
            text: size.toString(),
            fill: new Fill({
                color: "#fff",
            }),
        }),
    });
};

function createMap() {
    const map = new YourMap({
        interactionHandler: (features) => {
            console.log(features);
        },
    });
    map.setStyles(localStyleFunction);
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
