/**
 * YourMap - Библиотека для работы с интерактивными картами
 *
 * @fileoverview TypeScript декларации для библиотеки YourMap
 * @version 1.0.0
 * @author YourMap Team
 */

import type { Feature } from "ol";
import type VectorLayer from "ol/layer/Vector";
import type { Cluster } from "ol/source";
import type { StyleFunction } from "ol/style/Style";

// ============================================================================
// Утилитарные типы
// ============================================================================

/**
 * Утилитарный тип для создания строковых литералов с возможностью расширения
 * @template T - базовый строковый тип
 */
export type TaggedString<T extends string> = T | (string & {});

// ============================================================================
// Типы геометрических объектов
// ============================================================================

/**
 * Типы геометрических объектов на карте
 * - `point` - отдельная точка
 * - `cluster` - кластер точек
 */
export type FeatureStringType = "point" | "cluster";

// ============================================================================
// Типы стилей
// ============================================================================

/**
 * Стили для геометрических объектов
 */
export interface FeatureStyleType {
    /** Стиль для обычного состояния */
    plain: StyleFunction;
    /** Стиль для выделенного состояния */
    selected: StyleFunction;
}

/**
 * Частичные стили для объектов (может быть функция или объект стилей)
 */
export type FeatureStyleOptionType = Record<
    FeatureStringType,
    Partial<FeatureStyleType> | StyleFunction
>;

/**
 * Полные стили для всех типов объектов
 */
export type FeatureStyleFullOptionType = Record<FeatureStringType, FeatureStyleType>;

/**
 * Стили для слоя карты (может быть функция или объект стилей)
 */
export type YourMapLayerStyleType = Partial<FeatureStyleOptionType> | StyleFunction;

/**
 * Опции для настройки стилизации слоя
 */
export interface YourMapStylingOptionsType {
    /** Слой карты для применения стилей */
    layer: LayersType;
    /** Стили для слоя */
    layerStyle: YourMapLayerStyleType;
}

// ============================================================================
// Типы взаимодействий
// ============================================================================

/**
 * Функция-обработчик клика по объектам на карте
 * @param features - массив свойств выделенных объектов
 */
export type InteractionFunctionType = (features: ReturnType<Feature["getProperties"]>[]) => void;

/**
 * Опции для настройки взаимодействий с объектами на карте
 */
export interface YourMapInteractionsOptionsType {
    /** Слой карты для обработки взаимодействий */
    layer: LayersType;
    /** Обработчик кликов по объектам */
    interactionHandler: InteractionFunctionType;
    /** Кластеризуются ли точки */
    isClustering: boolean;
}

// ============================================================================
// Типы слоев
// ============================================================================

/**
 * Опции для создания слоя карты
 */
export interface YourMapLayerOptionsType {
    /** GeoJSON данные для отображения на карте */
    data?: GeoJSON.FeatureCollection;
    /** Включить кластеризацию точек */
    isClustering?: boolean;
    /** Обработчик кликов по объектам */
    interactionHandler?: InteractionFunctionType;
    /** Стили для объектов слоя */
    style?: YourMapLayerStyleType;
    /** Имя слоя */
    name?: string;
}

/**
 * Имена слоев карты
 */
export type LayersNamesType = TaggedString<"main">;

/**
 * Типы слоев OpenLayers (обычный или кластеризованный)
 */
export type LayersType = VectorLayer<Cluster<Feature>> | VectorLayer;

/**
 * Объект со слоями карты
 * @template T - тип слоя (по умолчанию YourMapLayer)
 */
export type LayersObjType<T = YourMapLayer> = Partial<Record<LayersNamesType, T>>;

// ============================================================================
// Основные типы карты
// ============================================================================

/**
 * Координаты точки на карте [долгота, широта]
 * @example [44.002, 56.3287] - координаты Нижнего Новгорода
 */
export type CoordinateType = [number, number];

/**
 * Базовые опции для карты
 */
export interface YourMapBaseOptions {
    /** Включить темную тему */
    darkTheme?: boolean;
    /** ID элемента DOM для отображения карты */
    target?: string;
}

/**
 * Опции для карты с одним слоем
 */
export type YourMapOptionsSingleLayer = YourMapBaseOptions & YourMapLayerOptionsType;

/**
 * Опции для карты с несколькими слоями
 */
export interface YourMapOptionsMultyLayers extends YourMapBaseOptions {
    /** Объект с настройками слоев */
    layers: LayersObjType<YourMapLayerOptionsType>;
}

/**
 * Конфигурация для конструктора класса YourMap
 * Поддерживает как одиночный слой, так и множественные слои
 */
export type YourMapOptions = YourMapOptionsSingleLayer | YourMapOptionsMultyLayers;

// ============================================================================
// Основные классы
// ============================================================================

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
 */
export declare class YourMap {
    /** Экземпляр карты OpenLayers */
    olMap: Map | null;

    /**
     * Создает новый экземпляр карты YourMap
     * @param options - опции конфигурации карты
     */
    constructor(options?: YourMapOptions);

    /**
     * Возвращает все слои карты
     * @returns объект со всеми слоями
     */
    getLayers(): LayersObjType;

    /**
     * Возвращает конкретный слой по имени
     * @param layerName - имя слоя
     * @returns слой карты или undefined
     */
    getLayer(layerName: string): LayersObjType[string] | undefined;

    /**
     * Устанавливает данные для слоя (заменяет существующие)
     * @param data - GeoJSON данные
     * @param layerName - имя слоя (по умолчанию "main")
     */
    setData(data: GeoJSON.FeatureCollection, layerName?: LayersNamesType): void;

    /**
     * Очищает данные слоя
     * @param layerName - имя слоя (по умолчанию "main")
     */
    clearData(layerName?: LayersNamesType): void;

    /**
     * Добавляет данные к существующим в слое
     * @param data - GeoJSON данные
     * @param layerName - имя слоя (по умолчанию "main")
     */
    addData(data: GeoJSON.FeatureCollection, layerName?: LayersNamesType): void;

    /**
     * Устанавливает стили для слоя
     * @param options - стили для объектов слоя
     * @param layerName - имя слоя (по умолчанию "main")
     */
    setStyles(options: YourMapLayerStyleType, layerName?: LayersNamesType): void;

    /**
     * Определяет тип геометрического объекта
     * @param feature - объект OpenLayers
     * @returns тип объекта ("point" или "cluster")
     */
    static getTypeOfFeature(feature: import("ol/Feature").FeatureLike): FeatureStringType;
}

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
export declare class YourMapLayer {
    /** Слой OpenLayers */
    olLayer: LayersType;

    /** Имя слоя */
    name: string;

    /**
     * Создает новый слой карты
     * @param options - опции конфигурации слоя
     */
    constructor(options: YourMapLayerOptionsType);

    /**
     * Привязывает слой к карте и настраивает взаимодействия
     */
    bindMap(): void;

    /**
     * Устанавливает данные для слоя (заменяет существующие)
     * @param data - GeoJSON данные
     */
    setData(data: GeoJSON.FeatureCollection): void;

    /**
     * Очищает данные слоя
     */
    clearData(): void;

    /**
     * Добавляет данные к существующим в слое
     * @param data - GeoJSON данные
     */
    addData(data: GeoJSON.FeatureCollection): void;

    /**
     * Устанавливает стили для объектов слоя
     * @param options - стили для объектов
     */
    setStyles(options: YourMapLayerStyleType): void;
}

/**
 * Класс для обработки данных GeoJSON в слое карты
 *
 * Обеспечивает:
 * - Загрузку и отображение GeoJSON данных
 * - Работу с кластеризованными и обычными слоями
 * - Добавление, очистку и обновление данных
 */
export declare class YourMapDataProcessing {
    /** Слой карты */
    layer: LayersType;

    /** Источник данных слоя */
    layerSource: import("ol/source/Vector") | null;

    /** Является ли слой кластеризованным */
    isCluster: boolean;

    /**
     * Создает обработчик данных для слоя
     * @param layer - слой карты
     */
    constructor(layer: LayersType);

    /**
     * Получает источник данных слоя (для кластеризованных слоев - внутренний источник)
     * @returns источник данных
     */
    getFeaturesSource(): import("ol/source/Vector") | null;

    /**
     * Устанавливает данные для слоя (заменяет существующие)
     * @param data - GeoJSON данные
     */
    setData(data: GeoJSON.FeatureCollection): void;

    /**
     * Очищает все данные слоя
     */
    clearData(): void;

    /**
     * Добавляет данные к существующим в слое
     * @param data - GeoJSON данные
     */
    addData(data: GeoJSON.FeatureCollection): void;
}

/**
 * Класс для управления стилями объектов на карте
 *
 * Обеспечивает:
 * - Настройку стилей для точек и кластеров
 * - Поддержку состояний (обычное/выделенное)
 * - Применение стилей к слою
 */
export declare class YourMapStyling {
    /** Слой карты */
    layer: LayersType;

    /** Полные стили для всех типов объектов */
    layerStyle: FeatureStyleFullOptionType;

    /**
     * Создает обработчик стилей для слоя
     * @param options - опции стилизации
     */
    constructor(options: YourMapStylingOptionsType);

    /**
     * Устанавливает новые стили для слоя
     * @param options - стили для объектов
     */
    setStyles(options: YourMapLayerStyleType): void;
}

// ============================================================================
// Утилиты
// ============================================================================

/**
 * Генерирует GeoJSON данные с случайными точками
 *
 * Создает коллекцию точек в заданной области с случайными координатами
 * и свойствами (id, status).
 *
 * @param count - количество точек для генерации (по умолчанию 50)
 * @returns GeoJSON FeatureCollection с точками
 *
 * @example
 * ```typescript
 * // Генерировать 100 случайных точек
 * const data = generateGeoJSON(100);
 *
 * // Использовать с картой
 * const map = new YourMap({ data });
 * ```
 */
export declare function generateGeoJSON(count?: number): GeoJSON.FeatureCollection;

// ============================================================================
// Константы и стили по умолчанию
// ============================================================================

/**
 * Стили точек по умолчанию
 */
export declare const DEFAULT_POINT_STYLES: StyleFunction;

/**
 * Стили выделенных точек по умолчанию
 */
export declare const DEFAULT_SELECTED_POINT_STYLES: StyleFunction;

/**
 * Базовая функция стилизации
 */
export declare const BASE_STYLE_FUNCTION: StyleFunction;

/**
 * Полные стили по умолчанию для всех типов объектов
 */
export declare const DEFAULT_STYLES_2: FeatureStyleFullOptionType;

/**
 * Опции карты по умолчанию
 */
export declare const DEFAULT_MAP_OPTIONS: Required<YourMapBaseOptions>;

/**
 * Опции слоя по умолчанию
 */
export declare const DEFAULT_LAYER_OPTIONS: Required<Omit<YourMapLayerOptionsType, "data">>;
