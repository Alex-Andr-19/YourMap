import { useGeographic } from "ol/proj";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import Cluster from "ol/source/Cluster";
import OSM from "ol/source/OSM";
import { type StyleFunction } from "ol/style/Style";
import { DEFAULT_MAP_OPTIONS } from "./MapConstants";
import { type Feature } from "ol";
import type { FeatureLike } from "ol/Feature";
import { YourMapLayer, type YourMapLayerOptionsType } from "./YourMapLayer";
import { clone } from "./deepClone";

type TaggedString<T extends string> = T | (string & {});

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

type LayersObjType<T = YourMapLayer> = Partial<Record<LayersNamesType, T>>;
type YourMapOptionsSingleLayer = YourMapBaseOptions & YourMapLayerOptionsType;
type YourMapOptionsMultyLayers = YourMapBaseOptions & {
    layers: LayersObjType<YourMapLayerOptionsType>;
};

/**
 * Configuration to constructor of YourMap class
 */
export type YourMapOptions = YourMapOptionsSingleLayer | YourMapOptionsMultyLayers;

export type LayersNamesType = TaggedString<"main">;
export type LayersType = VectorLayer<Cluster<Feature>> | VectorLayer;

useGeographic();
export class YourMap {
    private baseLayer = new TileLayer({
        source: new OSM(),
    });

    private layers: LayersObjType = {};

    olMap: Map | null;

    private center: CoordinateType = [44.002, 56.3287];
    private zoom: number = 11;

    constructor(_options: YourMapOptions) {
        const options = this.configureOptions({ ...DEFAULT_MAP_OPTIONS, ..._options });

        this.generateLayers(options);

        if (options.darkTheme) this.enambleDarkTheme();

        this.olMap = new Map({
            target: options.target,
            layers: [this.baseLayer, ...Object.values(this.layers).map((el) => el!.olLayer)],
            view: new View({
                center: this.center,
                zoom: this.zoom,
            }),
        });

        this.bindInteractions(options);
    }

    private configureOptions(_options: YourMapOptions) {
        const baseMapOption: YourMapBaseOptions = {};
        const layersOptions = clone(_options);
        let key: keyof YourMapOptions;
        for (key in _options) {
            if (key in DEFAULT_MAP_OPTIONS) {
                delete layersOptions[key];
                baseMapOption[key] = _options[key] as any;
            }
        }

        const res = { ...DEFAULT_MAP_OPTIONS, ...baseMapOption } as YourMapOptionsMultyLayers;

        const isMultyLayers = "layers" in layersOptions;
        if (isMultyLayers) {
            res.layers = {};
            for (let key in layersOptions.layers) {
                res.layers[key] = layersOptions.layers[key];
            }
        } else {
            res.layers = { main: layersOptions };
        }

        return res;
    }

    private generateLayers(options: YourMapOptionsMultyLayers) {
        for (let key in options.layers) {
            this.layers[key] = new YourMapLayer({
                ...options.layers[key],
            });
        }
    }

    private bindInteractions(options: YourMapOptionsMultyLayers) {
        for (let key in options.layers) {
            this.olMap!.addInteraction(this.layers[key]!.select);
        }
    }

    private enambleDarkTheme() {
        this.baseLayer.on("prerender", (evt) => {
            if (evt.context) {
                const canvas = evt.context.canvas;
                const context = canvas.getContext("2d", {
                    willReadFrequently: true,
                }) as CanvasRenderingContext2D;
                context.filter = "invert(100%) grayscale(100%) brightness(100%) contrast(125%)";
                context.globalCompositeOperation = "source-over";
            }
        });
        this.baseLayer.on("postrender", (evt) => {
            if (evt.context) {
                const canvas = evt.context.canvas;
                const context = canvas.getContext("2d", {
                    willReadFrequently: true,
                }) as CanvasRenderingContext2D;
                context.filter = "none";
            }
        });
    }

    /** ===============================================
     **              Work with layers                **
     * ============================================= */

    getLayers() {
        return this.layers;
    }

    getLayer(layerName: string): LayersObjType[string] | undefined {
        return this.layers[layerName];
    }

    /** ===============================================
     **               interfaces.data                **
     * ============================================= */

    setData(data: GeoJSON.FeatureCollection, layerName: LayersNamesType = "main") {
        this.layers[layerName]?.setData(data);
    }

    clearData(layerName: LayersNamesType = "main") {
        this.layers[layerName]?.clearData();
    }

    addData(data: GeoJSON.FeatureCollection, layerName: LayersNamesType = "main") {
        this.layers[layerName]?.addData(data);
    }

    /** ===============================================
     **              interfaces.style                **
     * ============================================= */

    setStyles(styleFunction: StyleFunction, layerName: LayersNamesType = "main") {
        this.layers[layerName]?.setStyles(styleFunction);
    }

    /** ===============================================
     **               Static methods                 **
     * ============================================= */

    static isFeatureCluster(feature: FeatureLike) {
        return !!feature.get("features")?.length;
    }
}
