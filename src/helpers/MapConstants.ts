import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style, { type StyleLike } from "ol/style/Style";
import Text from "ol/style/Text";
import { YourMap, type YourMapBaseOptions, type YourMapOptions } from "./YourMap";
import type { YourMapLayerOptionsType } from "./YourMapLayer";

export const DEFAULT_STYLES: StyleLike = (feature) => {
    return new Style({
        image: new CircleStyle({
            radius: 10,
            stroke: new Stroke({
                color: "#fff",
            }),
            fill: new Fill({
                color: "#3399CC",
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

export const DEFAULT_MAP_OPTIONS: YourMapBaseOptions = {
    darkTheme: true,
    target: "map",
};

export const DEFAULT_LAYER_OPTIONS: YourMapLayerOptionsType = {
    isClustering: true,
    interactionHandler: (features) => {
        console.log("Default handler:", features);
    },
};
