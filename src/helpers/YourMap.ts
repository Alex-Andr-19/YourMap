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

    map: Map | null = null;
    center: CoordinateType = [44.002, 56.3287];
    zoom: number = 11;

    select = new Select({
        condition: click,
        layers: [this.dataLayer],
    });
    selectedFeatures: Collection<Feature> = new Collection();

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

        this.map = new Map({
            target: "map",
            layers: [this.baseLayer, this.dataLayer],
            view: new View({
                center: this.center,
                zoom: this.zoom,
            }),
        });

        this.configureSelectedFeatures(_options.interactionHandler);

        // Преобразуем GeoJSON в features и добавляем в dataLayer
        if (_options.data) {
            this.setData(_options.data);
        }
    }

    private configureSelectedFeatures(interactionHandler?: InteractionFunctionType) {
        this.map!.addInteraction(this.select);
        this.selectedFeatures = this.select.getFeatures();

        this.selectedFeatures.on("add", (e) => {
            const feature = e.element;
            const clusterFeatures = feature.get("features") as Feature[];
            const clusterFeaturesProperties = clusterFeatures.map((el) => el.getProperties());
            if (interactionHandler) {
                interactionHandler(clusterFeaturesProperties);
            }
        });

        this.selectedFeatures.on("remove", (e) => {
            const feature = e.element;
            console.log(feature);
        });
    }

    // Метод для установки/обновления данных
    setData(data: GeoJSON.FeatureCollection) {
        const format = new GeoJSON();
        const features = format.readFeatures(data);

        // Получаем кластерный источник и его внутренний векторный источник
        const clusterSource = this.dataLayer.getSource();
        if (clusterSource) {
            const vectorSource = clusterSource.getSource();
            if (vectorSource) {
                // Очищаем старые features и добавляем новые
                vectorSource.clear();
                vectorSource.addFeatures(features);
            }
        }
    }

    setStyles(styleFunction: StyleLike) {
        this.dataLayer.setStyle(styleFunction);
    }

    // Дополнительные методы для работы с данными
    clearData() {
        const clusterSource = this.dataLayer.getSource();
        if (clusterSource) {
            const vectorSource = clusterSource.getSource();
            vectorSource?.clear();
        }
    }

    // Метод для добавления данных без очистки существующих
    addData(data: GeoJSON.FeatureCollection) {
        const format = new GeoJSON();
        const features = format.readFeatures(data);

        const clusterSource = this.dataLayer.getSource();
        if (clusterSource) {
            const vectorSource = clusterSource.getSource();
            vectorSource?.addFeatures(features);
        }
    }
}
