import { useGeographic } from "ol/proj";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Cluster from "ol/source/Cluster";
import OSM from "ol/source/OSM";
import { type StyleFunction } from "ol/style/Style";
import { DEFAULT_CONSTRUCTOR_OPTIONS } from "./MapConstants";
import { type Feature } from "ol";
import type { FeatureLike } from "ol/Feature";
import { YourMapLayer } from "./YourMapLayer";

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

/**
 * Configuration to constructor of YourMap class
 */
export type YourMapOptions = {
    data?: GeoJSON.FeatureCollection;
    isClustering?: boolean;
    darkTheme?: boolean;
    interactionHandler?: InteractionFunctionType;
};

export type LayersNamesType = TaggedString<"main">;
export type LayersType = VectorLayer<Cluster<Feature>> | VectorLayer;

type LayersObjType = Partial<Record<LayersNamesType, YourMapLayer>>;

export class YourMap {
    private baseLayer = new TileLayer({
        source: new OSM(),
    });

    private layers: LayersObjType = {};

    olMap: Map | null;

    private center: CoordinateType = [44.002, 56.3287];
    private zoom: number = 11;

    constructor(options: YourMapOptions) {
        useGeographic();

        const _options = { ...DEFAULT_CONSTRUCTOR_OPTIONS, ...options };

        this.generateLayers(_options.isClustering);

        if (_options.darkTheme) {
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

        this.olMap = new Map({
            target: "map",
            layers: [this.baseLayer, ...Object.values(this.layers).map((el) => el!.olLayer)],
            view: new View({
                center: this.center,
                zoom: this.zoom,
            }),
        });

        for (let key in this.layers) {
            this.layers[key]!.interaction.configureSelectedFeatures(_options.interactionHandler);
            this.olMap.addInteraction(this.layers[key]!.select);
        }

        // Преобразуем GeoJSON в features и добавляем в dataLayer
        if (_options.data)
            for (let key in this.layers) {
                this.layers[key]!.setData(_options.data);
            }
    }

    private generateLayers(isClustering?: boolean) {
        this.layers = {
            main: new YourMapLayer({ isClustering }),
        };
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
