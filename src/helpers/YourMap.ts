import GeoJSON from "ol/format/GeoJSON";
import { useGeographic } from "ol/proj";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Cluster from "ol/source/Cluster";
import OSM from "ol/source/OSM";
import Style from "ol/style/Style";
import CircleStyle from "ol/style/Circle";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import Text from "ol/style/Text";
// import { Coordinate } from 'ol/coordinate';

/**
 * longitude, latitude
 *
 * широта, долгота
 */
export type CoordinateType = [number, number];

export class YourMap {
    private styleCache: Record<number, Style> = {};
    private baseLayer = new TileLayer({
        source: new OSM(),
    });

    dataLayer = new VectorLayer({
        source: new Cluster({
            distance: 10,
            source: new VectorSource(), // Инициализируем пустым источником
        }),
        style: (feature) => {
            const size = feature.get("features").length;
            let style = this.styleCache[size];
            if (!style) {
                style = new Style({
                    image: new CircleStyle({
                        radius: 10,
                        stroke: new Stroke({
                            color: "#fff",
                        }),
                        fill: new Fill({
                            color: "#3399CC",
                        }),
                    }),
                    text: new Text({
                        text: size.toString(),
                        fill: new Fill({
                            color: "#fff",
                        }),
                    }),
                });
                this.styleCache[size] = style;
            }
            return style;
        },
    });

    map: Map | null = null;
    center: CoordinateType = [44.002, 56.3287];
    zoom: number = 11;

    constructor(data?: GeoJSON.FeatureCollection, darkTheme: boolean = true) {
        useGeographic();

        if (darkTheme) {
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

        // Преобразуем GeoJSON в features и добавляем в dataLayer
        if (data) {
            this.setData(data);
        }
    }

    // Метод для установки/обновления данных
    setData(data: GeoJSON.FeatureCollection) {
        const format = new GeoJSON();
        const features = format.readFeatures(data, {
            featureProjection: "EPSG:4326",
        });

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
        const features = format.readFeatures(data, {
            featureProjection: "EPSG:3857",
        });

        const clusterSource = this.dataLayer.getSource();
        if (clusterSource) {
            const vectorSource = clusterSource.getSource();
            vectorSource?.addFeatures(features);
        }
    }
}
