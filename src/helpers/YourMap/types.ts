import type { Feature } from "ol";
import type { YourMapLayer } from "./YourMapLayer";
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
    /** Стили для различных состояний объектов */
    styles: FeatureStyleFullOptionType;
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
