import VectorLayer from "ol/layer/Vector";
import { Cluster } from "ol/source";
import { YourMapDataProcessing } from "./YourMapDataProcessing";
import { YourMapStyling } from "./YourMapStyling";
import VectorSource from "ol/source/Vector";
import { DEFAULT_LAYER_OPTIONS } from "./MapConstants";
import type {
    InteractionFunctionType,
    LayersType,
    YourMapLayerOptionsType,
    YourMapLayerStyleType,
} from "./types";
import type { Feature, Map } from "ol";

/**
 * Класс для управления отдельным слоем карты
 *
 * Обеспечивает:
 * - Создание и настройку слоя OpenLayers
 * - Обработку данных GeoJSON
 * - Управление стилями объектов
 * - Обработку взаимодействий (клики, выделение)
 * - Поддержку кластеризации
 */
export class YourMapLayer {
    /** Слой OpenLayers */
    olLayer: LayersType;

    /** Имя слоя */
    name: string = "main";

    /** Обработчик данных слоя */
    private data: YourMapDataProcessing;

    /** Обработчик стилей слоя */
    private style: YourMapStyling;

    /** Экземпляр карты OpenLayers */
    private olMap: Map | null = null;

    /** Включена ли кластеризация */
    private isClustering: boolean = true;

    /** Обработчик взаимодействий */
    private interactionHandler: InteractionFunctionType;

    /** Массив выделенных объектов */
    private selectedFeatures: Feature[] = [];

    /**
     * Создает новый слой карты
     * @param _options - опции конфигурации слоя
     */
    constructor(_options: YourMapLayerOptionsType) {
        const options = { ...DEFAULT_LAYER_OPTIONS, ..._options };
        this.name = options.name;
        this.isClustering = options.isClustering;
        this.interactionHandler = options.interactionHandler;

        this.olLayer = new VectorLayer({
            source: this.isClustering
                ? new Cluster({
                      distance: 25,
                      source: new VectorSource(), // Инициализируем пустым источником
                  })
                : new VectorSource(),
        });

        this.data = new YourMapDataProcessing(this.olLayer);
        this.style = new YourMapStyling({
            layer: this.olLayer,
            layerStyle: options.style,
        });
        if (options.data) this.data.addData(options.data);
    }

    /**
     * Привязывает слой к карте и настраивает взаимодействия
     */
    bindMap() {
        this.olMap = this.olLayer.getMapInternal();

        this.bindInteractions();
    }

    /**
     * Настраивает обработчики взаимодействий (клики, выделение)
     * @private
     */
    private bindInteractions() {
        this.olMap!.on("click", (ev) => {
            const clickedFeature = this.olMap!.getFeaturesAtPixel(ev.pixel)[0] as Feature;
            const eventOfTheSameLayer = this.olLayer
                .getSource()!
                .getFeatures()
                .some((feature: Feature) => feature === clickedFeature);

            if (clickedFeature !== undefined && eventOfTheSameLayer) {
                let selectedFeatures = [clickedFeature];
                if (this.isClustering)
                    selectedFeatures = clickedFeature.get("features") as Feature[];

                if (this.selectedFeatures.length > 0)
                    this.selectedFeatures.forEach((feature: Feature) => {
                        feature.set("selected", false);
                    });
                this.selectedFeatures = selectedFeatures;

                this.selectedFeatures.forEach((feature: Feature) => {
                    feature.set("selected", true);
                });

                this.interactionHandler(this.selectedFeatures);
            } else if (this.selectedFeatures.length > 0) {
                this.selectedFeatures.forEach((feature: Feature) => {
                    feature.set("selected", false);
                });
                this.selectedFeatures = [];
                console.log("Layer name", this.name, "– missClick");
            }

            this.olLayer.changed();
        });
    }

    /**
     * Устанавливает данные для слоя (заменяет существующие)
     * @param data - GeoJSON данные
     */
    setData(data: GeoJSON.FeatureCollection) {
        this.data.setData(data);
    }

    /**
     * Очищает данные слоя
     */
    clearData() {
        this.data.clearData();
    }

    /**
     * Добавляет данные к существующим в слое
     * @param data - GeoJSON данные
     */
    addData(data: GeoJSON.FeatureCollection) {
        this.data.addData(data);
    }

    /**
     * Устанавливает стили для объектов слоя
     * @param options - стили для объектов
     */
    setStyles(options: YourMapLayerStyleType) {
        this.style.setStyles(options);
    }
}
