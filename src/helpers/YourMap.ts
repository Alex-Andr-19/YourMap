import { useGeographic } from "ol/proj";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Cluster from "ol/source/Cluster";
import OSM from "ol/source/OSM";
import { type StyleLike } from "ol/style/Style";
import { DEFAULT_CONSTRUCTOR_OPTIONS, DEFAULT_STYLES } from "./MapConstants";
import { type Feature } from "ol";
import { YourMapDataProcessing } from "./YourMapDataProcessing";
import { YourMapStyling } from "./YourMapStyling";
import { YourMapInteraction } from "./YourMapInteraction";
import type BaseLayer from "ol/layer/Base";

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
    darkTheme?: boolean;
    interactionHandler?: InteractionFunctionType;
};

export type LayersNamesType = TaggedString<"main">;

type LayersObjType = Partial<
    Record<
        LayersNamesType,
        {
            layer: VectorLayer<Cluster<Feature>>;
            data: YourMapDataProcessing;
            style: YourMapStyling;
            interaction: YourMapInteraction;
        }
    >
>;

export class YourMap {
    private baseLayer = new TileLayer({
        source: new OSM(),
    });

    private dataLayer = new VectorLayer({
        source: new Cluster({
            distance: 15,
            source: new VectorSource(), // Инициализируем пустым источником
        }),
        style: DEFAULT_STYLES,
    });

    private layers: LayersObjType = {};

    olMap: Map | null;

    private center: CoordinateType = [44.002, 56.3287];
    private zoom: number = 11;

    constructor(options: YourMapOptions) {
        this.generateLayers();

        useGeographic();

        const _options = { ...DEFAULT_CONSTRUCTOR_OPTIONS, ...options };

        if (_options.darkTheme) {
            this.baseLayer.on("prerender", (evt) => {
                if (evt.context) {
                    const context = evt.context as CanvasRenderingContext2D;
                    context.filter = "invert(100%) grayscale(100%) brightness(100%) contrast(125%)";
                    context.globalCompositeOperation = "source-over";
                }
            });
            this.baseLayer.on("postrender", (evt) => {
                if (evt.context) {
                    const context = evt.context as CanvasRenderingContext2D;
                    context.filter = "none";
                }
            });
        }

        this.olMap = new Map({
            target: "map",
            layers: [this.baseLayer, ...Object.values(this.layers).map((el) => el!.layer)],
            view: new View({
                center: this.center,
                zoom: this.zoom,
            }),
        });

        for (let key in this.layers) {
            const select = this.layers[key]!.interaction.configureSelectedFeatures(
                _options.interactionHandler,
            );
            this.olMap.addInteraction(select);
        }

        // Преобразуем GeoJSON в features и добавляем в dataLayer
        if (_options.data)
            for (let key in this.layers) {
                this.layers[key]!.data.setData(_options.data);
            }
    }

    private generateLayers() {
        this.layers = {
            main: {
                layer: this.dataLayer,
                data: new YourMapDataProcessing(this.dataLayer),
                style: new YourMapStyling(this.dataLayer),
                interaction: new YourMapInteraction(this.dataLayer),
            },
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
        this.layers[layerName]?.data.setData(data);
    }

    clearData(layerName: LayersNamesType = "main") {
        this.layers[layerName]?.data.clearData();
    }

    addData(data: GeoJSON.FeatureCollection, layerName: LayersNamesType = "main") {
        this.layers[layerName]?.data.addData(data);
    }

    /** ===============================================
     **              interfaces.style                **
     * ============================================= */

    setStyles(styleFunction: StyleLike, layerName: LayersNamesType = "main") {
        this.layers[layerName]?.style.setStyles(styleFunction);
    }
}
