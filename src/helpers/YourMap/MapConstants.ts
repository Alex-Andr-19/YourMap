import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style, { type StyleFunction } from "ol/style/Style";
import Text from "ol/style/Text";
import type { FeatureLike } from "ol/Feature";
import { YourMap } from "./YourMap";
import type {
    FeatureStyleFullOptionType,
    YourMapBaseOptions,
    YourMapLayerOptionsType,
} from "./types";

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

export const DEFAULT_STYLES_2: FeatureStyleFullOptionType = {
    point: {
        plain: DEFAULT_STYLES,
        selected: DEFAULT_STYLES,
    },
    cluster: {
        plain: DEFAULT_STYLES,
        selected: DEFAULT_STYLES,
    },
};

export const DEFAULT_MAP_OPTIONS: Required<YourMapBaseOptions> = {
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
