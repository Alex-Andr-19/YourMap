import { useGeographic } from "ol/proj";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { DEFAULT_MAP_OPTIONS } from "./MapConstants";
import type { FeatureLike } from "ol/Feature";
import { YourMapLayer } from "./YourMapLayer";
import { clone } from "../deepClone";
import type {
    CoordinateType,
    FeatureStringType,
    LayersNamesType,
    LayersObjType,
    YourMapBaseOptions,
    YourMapLayerStyleType,
    YourMapOptions,
    YourMapOptionsMultyLayers,
} from "./types";
import { Point } from "ol/geom";

useGeographic();
export class YourMap {
    private baseLayer = new TileLayer({
        source: new OSM(),
    });

    private layers: LayersObjType = {};

    olMap: Map | null;

    private center: CoordinateType = [44.002, 56.3287];
    private zoom: number = 11;

    constructor(_options?: YourMapOptions) {
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

    setStyles(options: YourMapLayerStyleType, layerName: LayersNamesType = "main") {
        this.layers[layerName]?.setStyles(options);
    }

    /** ===============================================
     **               Static methods                 **
     * ============================================= */

    static getTypeOfFeature(feature: FeatureLike): FeatureStringType | null {
        let res: FeatureStringType | null = null;

        if (feature.getGeometry() instanceof Point) {
            if (feature.get("features")?.length !== undefined) {
                if (feature.get("features")?.length < 2) res = "point";
                else res = "cluster";
            } else res = "point";
        }

        return res;
    }
}
