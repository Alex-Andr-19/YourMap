import GeoJSON from "ol/format/GeoJSON";
import type VectorLayer from "ol/layer/Vector";
import { Cluster } from "ol/source";
import type { Feature } from "ol";
import type VectorSource from "ol/source/Vector";
import type { LayersType } from "./types";

export class YourMapDataProcessing {
    layer: LayersType;
    layerSource: VectorSource | null;
    isCluster: boolean;

    constructor(layer: LayersType) {
        this.layer = layer;
        this.isCluster = this.layer.getSource() instanceof Cluster;
        this.layerSource = this.getFeaturesSource();
    }

    getFeaturesSource() {
        const layerSource = this.layer.getSource();
        let res = layerSource;

        if (this.isCluster && layerSource) {
            const clusterLayer = layerSource as unknown as VectorLayer<Cluster<Feature>>;
            const clusterSource = clusterLayer.getSource();
            res = clusterSource;
        }

        return res;
    }

    // Метод для установки/обновления данных
    setData(data: GeoJSON.FeatureCollection) {
        const format = new GeoJSON();
        const features = format.readFeatures(data);

        if (this.layerSource) {
            this.layerSource.clear();
            this.layerSource.addFeatures(features);
        }
    }

    // Дополнительные методы для работы с данными
    clearData() {
        if (this.layerSource) {
            this.layerSource.clear();
        }
    }

    // Метод для добавления данных без очистки существующих
    addData(data: GeoJSON.FeatureCollection) {
        const format = new GeoJSON();
        const features = format.readFeatures(data);

        if (this.layerSource) {
            this.layerSource.addFeatures(features);
        }
    }
}
