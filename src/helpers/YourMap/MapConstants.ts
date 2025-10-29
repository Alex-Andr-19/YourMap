import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style, { type StyleFunction } from "ol/style/Style";
import Text from "ol/style/Text";
import type { FeatureLike } from "ol/Feature";
import { YourMap } from "./YourMap";
import type {
    FeatureStyleFullOptionType,
    InteractionFunctionType,
    YourMapBaseOptions,
    YourMapInteractionsOptionsType,
    YourMapLayerOptionsType,
} from "./index.d.ts";

export const DEFAULT_CLUSTER_TEXT_STYLE = (feature: FeatureLike) => ({
    text: new Text({
        text: feature.get("features").length.toString(),
        fill: new Fill({
            color: "#fff",
        }),
    }),
});

export const DEFAULT_POINT_STYLES: StyleFunction = (feature: FeatureLike, resolution: number) => {
    return new Style({
        image: new CircleStyle({
            radius: 10,
            stroke: new Stroke({
                color: "#fff",
            }),
            fill: new Fill({
                color: "#558",
            }),
        }),
        ...(YourMap.getTypeOfFeature(feature) === "cluster"
            ? DEFAULT_CLUSTER_TEXT_STYLE(feature)
            : {}),
    });
};

export const DEFAULT_SELECTED_POINT_STYLES: StyleFunction = (
    feature: FeatureLike,
    resolution: number,
) => {
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
            ? DEFAULT_CLUSTER_TEXT_STYLE(feature)
            : {}),
    });
};

export const DEFAULT_MAP_INTERACTION: Omit<YourMapInteractionsOptionsType, "layer"> = {
    interactionHandler: (features) => {
        console.log("Default handler:", features);
    },
    isClustering: true,
};

export const BASE_STYLE_FUNCTION: StyleFunction = (feature: FeatureLike, resolution: number) => {
    if (feature.get("selected") !== true) return DEFAULT_POINT_STYLES(feature, resolution);
    else return DEFAULT_SELECTED_POINT_STYLES(feature, resolution);
};

export const DEFAULT_STYLES: FeatureStyleFullOptionType = {
    point: {
        plain: BASE_STYLE_FUNCTION,
        selected: BASE_STYLE_FUNCTION,
    },
    cluster: {
        plain: BASE_STYLE_FUNCTION,
        selected: BASE_STYLE_FUNCTION,
    },
};

export const DEFAULT_MAP_OPTIONS: Required<YourMapBaseOptions> = {
    darkTheme: true,
    target: "map",
};

export const DEFAULT_LAYER_OPTIONS: Required<Omit<YourMapLayerOptionsType, "data">> = {
    isClustering: true,
    style: DEFAULT_POINT_STYLES,
    interactionHandler: DEFAULT_MAP_INTERACTION.interactionHandler,
    name: "main",
};
