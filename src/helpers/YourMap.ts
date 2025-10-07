import GeoJSON from "ol/format/GeoJSON";
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
import Select from "ol/interaction/Select";
import { click } from "ol/events/condition";
import { Collection, type Feature } from "ol";
import { YourMapDataProcessing } from "./YourMapDataProcessing";
import { YourMapStyling } from "./YourMapStyling";
import { YourMapInteraction } from "./YourMapInteraction";

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

export type YourMapProvideObjType = {
    dataLayer: VectorLayer<Cluster<Feature>>;
    olMap: Map | null;
};

export type YourMapInterfaces = {
    data?: YourMapDataProcessing;
    style?: YourMapStyling;
    interaction?: YourMapInteraction;
};

export class YourMap {
    private baseLayer = new TileLayer({
        source: new OSM(),
    });

    dataLayer = new VectorLayer({
        source: new Cluster({
            distance: 15,
            source: new VectorSource(), // Инициализируем пустым источником
        }),
        style: DEFAULT_STYLES,
    });

    olMap: Map | null;

    private provideObj: YourMapProvideObjType = {
        dataLayer: this.dataLayer,
        olMap: null,
    };

    private interfaces: YourMapInterfaces = {};

    center: CoordinateType = [44.002, 56.3287];
    zoom: number = 11;

    constructor(options: YourMapOptions) {
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
            layers: [this.baseLayer, this.dataLayer],
            view: new View({
                center: this.center,
                zoom: this.zoom,
            }),
        });

        this.provideObj.olMap = this.olMap;
        this.generateInterfaces();

        if (this.interfaces.interaction !== undefined)
            this.interfaces.interaction.configureSelectedFeatures(_options.interactionHandler);

        // Преобразуем GeoJSON в features и добавляем в dataLayer
        if (_options.data && this.interfaces.data) this.interfaces.data.setData(_options.data);
    }

    private generateInterfaces() {
        this.interfaces.data = new YourMapDataProcessing(this.provideObj);
        this.interfaces.style = new YourMapStyling(this.provideObj);
        this.interfaces.interaction = new YourMapInteraction(this.provideObj);
    }

    /** ===============================================
     **               interfaces.data                **
     * ============================================= */

    setData(data: GeoJSON.FeatureCollection) {
        this.interfaces.data?.setData(data);
    }

    clearData() {
        this.interfaces.data?.clearData();
    }

    addData(data: GeoJSON.FeatureCollection) {
        this.interfaces.data?.addData(data);
    }

    /** ===============================================
     **              interfaces.style                **
     * ============================================= */

    setStyles(styleFunction: StyleLike) {
        this.interfaces.style?.setStyles(styleFunction);
    }
}
