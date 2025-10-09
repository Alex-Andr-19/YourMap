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
 **             YourMapLayer types               **
 * ============================================= */

export type YourMapLayerOptionsType = {
    data?: GeoJSON.FeatureCollection;
    isClustering?: boolean;
    interactionHandler?: InteractionFunctionType;
    style?: StyleFunction;
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
