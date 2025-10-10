<script setup lang="ts">
import { onMounted } from "vue";
import { YourMap } from "@/helpers/YourMap/YourMap";
import { generateGeoJSON } from "@/helpers/YourMap/GenerateGeoJSON";
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
        ...(YourMap.getTypeOfFeature(feature) === "cluster"
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
        ...(YourMap.getTypeOfFeature(feature) === "cluster"
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
async function createMap1() {
    map_1 = new YourMap({
        target: "map1",
        layers: {
            first: {
                data: await getData(),
                interactionHandler: (features) => {
                    console.log("Hallo, world!!!", features);
                },
                style: localStyleFunction1,
            },
            second: {
                isClustering: false,
                style: {
                    point: {
                        plain: localStyleFunction2,
                        selected: localStyleFunction1,
                    },
                },
            },
        },
    });

    getData().then((res) => {
        map_1.setData(res, "second");
    });
}

let map_2: YourMap;
function createMap2() {
    map_2 = new YourMap({
        target: "map2",
        darkTheme: false,
        // isClustering: false,
        interactionHandler: (features) => {
            console.log("Here!!!", features);
        },
    });
    // map_2.setStyles({
    //     point: localStyleFunction1,
    // });
    map_2.setStyles(localStyleFunction1);
    getData().then((res) => {
        map_2.setData(res);
    });
}

let map_3: YourMap;
function createMap3() {
    map_3 = new YourMap();
    getData().then((res) => {
        map_3.setData(res);
    });
}

onMounted(() => {
    createMap1();
    createMap2();
    createMap3();
});
</script>

<template>
    <div class="map-container debug-indicator">
        <h2 class="map-container__header">map-container</h2>

        <div id="map1"></div>
        <div id="map2"></div>
        <div id="map"></div>
    </div>
</template>

<style lang="scss" scoped src="./style.scss"></style>
