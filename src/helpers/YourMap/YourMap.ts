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

/**
 * Основной класс библиотеки YourMap для работы с интерактивными картами
 *
 * Предоставляет упрощенный API для работы с OpenLayers, включая:
 * - Создание карт с базовым слоем OSM
 * - Управление множественными слоями
 * - Кластеризацию точек
 * - Кастомные стили для объектов
 * - Обработку взаимодействий (клики, выделение)
 * - Темную тему
 *
 * @example
 * ```typescript
 * // Простая карта с одним слоем
 * const map = new YourMap({
 *   target: 'map',
 *   data: geoJsonData,
 *   interactionHandler: (features) => console.log(features)
 * });
 *
 * // Карта с несколькими слоями
 * const map = new YourMap({
 *   target: 'map',
 *   layers: {
 *     points: { data: pointsData, isClustering: true },
 *     lines: { data: linesData, isClustering: false }
 *   }
 * });
 * ```
 */
export class YourMap {
    /** Базовый слой карты (OSM) */
    private baseLayer = new TileLayer({
        source: new OSM(),
    });

    /** Объект со всеми слоями карты */
    private layers: LayersObjType = {};

    /** Экземпляр карты OpenLayers */
    olMap: Map | null;

    /** Центр карты по умолчанию [долгота, широта] */
    private center: CoordinateType = [44.002, 56.3287];

    /** Масштаб карты по умолчанию */
    private zoom: number = 11;

    /**
     * Создает новый экземпляр карты YourMap
     * @param _options - опции конфигурации карты
     */
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

        for (let layerKey in this.layers) this.layers[layerKey]!.bindMap();
    }

    /**
     * Настраивает опции карты, разделяя базовые опции и опции слоев
     * @private
     * @param _options - исходные опции
     * @returns настроенные опции для множественных слоев
     */
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

    /**
     * Создает слои карты на основе опций
     * @private
     * @param options - опции с настройками слоев
     */
    private generateLayers(options: YourMapOptionsMultyLayers) {
        for (let key in options.layers) {
            this.layers[key] = new YourMapLayer({
                ...options.layers[key],
                name: key,
            });
        }
    }

    /**
     * Включает темную тему для базового слоя карты
     * @private
     */
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

    /**
     * Возвращает все слои карты
     * @returns объект со всеми слоями
     */
    getLayers() {
        return this.layers;
    }

    /**
     * Возвращает конкретный слой по имени
     * @param layerName - имя слоя
     * @returns слой карты или undefined
     */
    getLayer(layerName: string = "main"): LayersObjType[string] | undefined {
        return this.layers[layerName];
    }

    /** ===============================================
     **               interfaces.data                **
     * ============================================= */

    /**
     * Устанавливает данные для слоя (заменяет существующие)
     * @param data - GeoJSON данные
     * @param layerName - имя слоя (по умолчанию "main")
     */
    setData(data: GeoJSON.FeatureCollection, layerName: LayersNamesType = "main") {
        this.layers[layerName]?.setData(data);
    }

    /**
     * Очищает данные слоя
     * @param layerName - имя слоя (по умолчанию "main")
     */
    clearData(layerName: LayersNamesType = "main") {
        this.layers[layerName]?.clearData();
    }

    /**
     * Добавляет данные к существующим в слое
     * @param data - GeoJSON данные
     * @param layerName - имя слоя (по умолчанию "main")
     */
    addData(data: GeoJSON.FeatureCollection, layerName: LayersNamesType = "main") {
        this.layers[layerName]?.addData(data);
    }

    /** ===============================================
     **              interfaces.style                **
     * ============================================= */

    /**
     * Устанавливает стили для слоя
     * @param options - стили для объектов слоя
     * @param layerName - имя слоя (по умолчанию "main")
     */
    setStyles(options: YourMapLayerStyleType, layerName: LayersNamesType = "main") {
        this.layers[layerName]?.setStyles(options);
    }

    /** ===============================================
     **          interfaces.interactions             **
     * ============================================= */

    /** ===============================================
     **               Static methods                 **
     * ============================================= */

    /**
     * Определяет тип геометрического объекта
     * @param feature - объект OpenLayers
     * @returns тип объекта ("point" или "cluster")
     */
    static getTypeOfFeature(feature: FeatureLike): FeatureStringType {
        let res: FeatureStringType = "point";

        if (feature.getGeometry() instanceof Point) {
            const features = feature.get("features");
            if (features?.length !== undefined && features?.length >= 2) res = "cluster";
        }

        return res;
    }
}
