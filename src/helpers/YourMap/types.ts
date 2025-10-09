import type { Feature } from "ol";
import type { YourMapLayer } from "./YourMapLayer";
import type VectorLayer from "ol/layer/Vector";
import type { Cluster } from "ol/source";
import type { StyleFunction } from "ol/style/Style";

/** ===============================================
 **               Utilities types                **
 * ============================================= */
export type TaggedString<T extends string> = T | (string & {});

/** ===============================================
 **               Features types                 **
 * ============================================= */

export type FeatureStringType = "point" | "cluster";

/** ===============================================
 **           Features styles types              **
 * ============================================= */

export type YourMapStylingOptionsType = {
    layer: LayersType;
    layerStyle: YourMapLayerStyleType;
};

export type FeatureStyleType = {
    plain: StyleFunction;
    selected: StyleFunction;
};

export type FeatureStyleOptionType = Record<FeatureStringType, FeatureStyleType | StyleFunction>;
export type FeatureStyleFullOptionType = Record<FeatureStringType, FeatureStyleType>;

/** ===============================================
 **             YourMapLayer types               **
 * ============================================= */

export type YourMapLayerStyleType = FeatureStyleOptionType | StyleFunction;

export type YourMapLayerOptionsType = {
    data?: GeoJSON.FeatureCollection;
    isClustering?: boolean;
    interactionHandler?: InteractionFunctionType;
    // style?: StyleFunction;
    style?: YourMapLayerStyleType;
};

/** ===============================================
 **               YourMap types                **
 * ============================================= */

/**
 * longitude, latitude
 *
 * широта, долгота
 */
export type CoordinateType = [number, number];

/**
 * Function for handle click on cluster features
 */
export type InteractionFunctionType = (features: ReturnType<Feature["getProperties"]>[]) => void;

export type YourMapBaseOptions = {
    darkTheme?: boolean;
    target?: string;
};

export type LayersObjType<T = YourMapLayer> = Partial<Record<LayersNamesType, T>>;
export type YourMapOptionsSingleLayer = YourMapBaseOptions & YourMapLayerOptionsType;
export type YourMapOptionsMultyLayers = YourMapBaseOptions & {
    layers: LayersObjType<YourMapLayerOptionsType>;
};

/**
 * Configuration to constructor of YourMap class
 */
export type YourMapOptions = YourMapOptionsSingleLayer | YourMapOptionsMultyLayers;

export type LayersNamesType = TaggedString<"main">;
export type LayersType = VectorLayer<Cluster<Feature>> | VectorLayer;
