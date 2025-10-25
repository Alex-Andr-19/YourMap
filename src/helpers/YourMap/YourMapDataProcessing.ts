import GeoJSON from "ol/format/GeoJSON";
import type VectorLayer from "ol/layer/Vector";
import { Cluster } from "ol/source";
import type { Feature } from "ol";
import type VectorSource from "ol/source/Vector";
import type { LayersType } from "./types";

/**
 * Класс для обработки данных GeoJSON в слое карты
 *
 * Обеспечивает:
 * - Загрузку и отображение GeoJSON данных
 * - Работу с кластеризованными и обычными слоями
 * - Добавление, очистку и обновление данных
 */
export class YourMapDataProcessing {
    /** Слой карты */
    layer: LayersType;

    /** Источник данных слоя */
    layerSource: VectorSource | null;

    /** Является ли слой кластеризованным */
    isCluster: boolean;

    /**
     * Создает обработчик данных для слоя
     * @param layer - слой карты
     */
    constructor(layer: LayersType) {
        this.layer = layer;
        this.isCluster = this.layer.getSource() instanceof Cluster;
        this.layerSource = this.getFeaturesSource();
    }

    /**
     * Получает источник данных слоя (для кластеризованных слоев - внутренний источник)
     * @returns источник данных
     */
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

    /**
     * Устанавливает данные для слоя (заменяет существующие)
     * @param data - GeoJSON данные
     */
    setData(data: GeoJSON.FeatureCollection) {
        const format = new GeoJSON();
        const features = format.readFeatures(data);

        if (this.layerSource) {
            this.layerSource.clear();
            this.layerSource.addFeatures(features);
        }
    }

    /**
     * Очищает все данные слоя
     */
    clearData() {
        if (this.layerSource) {
            this.layerSource.clear();
        }
    }

    /**
     * Добавляет данные к существующим в слое
     * @param data - GeoJSON данные
     */
    addData(data: GeoJSON.FeatureCollection) {
        const format = new GeoJSON();
        const features = format.readFeatures(data);

        if (this.layerSource) {
            this.layerSource.addFeatures(features);
        }
    }
}
