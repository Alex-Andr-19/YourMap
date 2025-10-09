import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style, { type StyleFunction, type StyleLike } from "ol/style/Style";
import Text from "ol/style/Text";
import { YourMap, type YourMapBaseOptions } from "./YourMap";
import type { YourMapLayerOptionsType } from "./YourMapLayer";
import type { FeatureLike } from "ol/Feature";

export const DEFAULT_STYLES: StyleFunction = (feature: FeatureLike) => {
    return new Style({
        image: new CircleStyle({
            radius: 10,
            stroke: new Stroke({
                color: "#fff",
            }),
            fill: new Fill({
                color: "#99C",
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

export const DEFAULT_LAYER_OPTIONS: Required<Omit<YourMapLayerOptionsType, "data">> = {
    isClustering: true,
    style: DEFAULT_STYLES,
    interactionHandler: (features) => {
        console.log("Default handler:", features);
    },
};
