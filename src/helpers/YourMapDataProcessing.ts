import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import { Cluster } from "ol/source";
import type { Feature } from "ol";

export class YourMapDataProcessing {
    private dataLayer: VectorLayer<Cluster<Feature>>;

    constructor(dataLayer: VectorLayer<Cluster<Feature>>) {
        this.dataLayer = dataLayer;
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
