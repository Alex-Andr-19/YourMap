<script setup lang="ts">
import { onMounted } from "vue";
import { YourMap } from "@/helpers/YourMap";
import { generateGeoJSON } from "@/helpers/GenerateGeoJSON";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style, { type StyleFunction } from "ol/style/Style";
import Text from "ol/style/Text";
import type { FeatureLike } from "ol/Feature";

function getData(): Promise<GeoJSON.FeatureCollection> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(generateGeoJSON(200));
        }, 1000);
    });
}

const localStyleFunction1: StyleFunction = (feature: FeatureLike) => {
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
        ...(YourMap.isFeatureCluster(feature)
            ? {
                  text: new Text({
                      text: feature.get("features").length.toString(),
                      fill: new Fill({
                          color: "#fff",
                      }),
                  }),
              }
            : {}),
    });
};

const localStyleFunction2: StyleFunction = (feature: FeatureLike) => {
    return new Style({
        image: new CircleStyle({
            radius: 10,
            stroke: new Stroke({
                color: "#ff0",
            }),
            fill: new Fill({
                color: "#f00",
            }),
        }),
        ...(YourMap.isFeatureCluster(feature)
            ? {
                  text: new Text({
                      text: feature.get("features").length.toString(),
                      fill: new Fill({
                          color: "#fff",
                      }),
                  }),
              }
            : {}),
    });
};

let map_1: YourMap;
function createMap1() {
    map_1 = new YourMap({
        target: "map1",
        layers: {
            first: {
                interactionHandler: (features) => {
                    console.log("Hallo, world!!!", features);
                },
            },
            second: {
                isClustering: false,
            },
        },
    });
    map_1.setStyles(localStyleFunction1, "first");
    map_1.setStyles(localStyleFunction2, "second");
    Promise.all([getData(), getData()]).then((res) => {
        map_1.setData(res[0], "first");
        setTimeout(() => {
            map_1.setData(res[1], "second");
        }, 1000);
    });
}

let map_2: YourMap;
function createMap2() {
    map_2 = new YourMap({
        target: "map2",
        darkTheme: false,
        isClustering: false,
        interactionHandler: (features) => {
            console.log("Here!!!", features);
        },
    });

    map_2.setStyles(localStyleFunction1);
    getData().then((res) => {
        map_2.setData(res);
    });
}

onMounted(() => {
    createMap1();
    createMap2();
});
</script>

<template>
    <div class="map-container debug-indicator">
        <h2 class="map-container__header">map-container</h2>

        <div id="map1"></div>
        <div id="map2"></div>
    </div>
</template>

<style lang="scss" scoped src="./style.scss"></style>
