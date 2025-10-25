# YourMap - Библиотека для работы с интерактивными картами

YourMap - это TypeScript библиотека, предоставляющая упрощенный API для работы с OpenLayers. Библиотека позволяет легко создавать интерактивные карты с поддержкой кластеризации, кастомных стилей и обработки взаимодействий.

## 🚀 Основные возможности

- **Упрощенный API** - создание карт в несколько строк кода
- **Кластеризация точек** - автоматическая группировка близко расположенных объектов
- **Множественные слои** - поддержка нескольких слоев на одной карте
- **Кастомные стили** - гибкая настройка внешнего вида объектов
- **Темная тема** - встроенная поддержка темной темы
- **TypeScript** - полная типизация для лучшего DX
- **Обработка взаимодействий** - клики, выделение объектов

## 📦 Установка

```bash
npm install ol
# или
yarn add ol
```

## 🎯 Быстрый старт

### Простая карта с одним слоем

```typescript
import { YourMap } from "./helpers/YourMap/YourMap";
import { generateGeoJSON } from "./helpers/YourMap/GenerateGeoJSON";

// Создание простой карты
const map = new YourMap({
    target: "map", // ID элемента DOM
    data: generateGeoJSON(100), // GeoJSON данные
    interactionHandler: (features) => {
        console.log("Клик по объекту:", features);
    },
});
```

### Карта с несколькими слоями

```typescript
const map = new YourMap({
    target: "map",
    layers: {
        points: {
            data: pointsData,
            isClustering: true,
            interactionHandler: (features) => console.log("Точки:", features),
        },
        lines: {
            data: linesData,
            isClustering: false,
            style: customLineStyle,
        },
    },
});
```

### Кастомные стили

```typescript
import { Style, Circle, Fill, Stroke } from "ol/style";

// Простой стиль
const customStyle = new Style({
    image: new Circle({
        radius: 8,
        fill: new Fill({ color: "#ff0000" }),
        stroke: new Stroke({ color: "#ffffff", width: 2 }),
    }),
});

// Стили для разных состояний
const customStyles = {
    point: {
        plain: plainStyleFunction,
        selected: selectedStyleFunction,
    },
    cluster: {
        plain: clusterStyleFunction,
        selected: selectedClusterStyleFunction,
    },
};

const map = new YourMap({
    target: "map",
    style: customStyles,
});
```

## 📚 API Документация

### YourMap

Основной класс библиотеки для создания и управления картами.

#### Конструктор

```typescript
new YourMap(options?: YourMapOptions)
```

#### Опции

```typescript
interface YourMapOptions {
    // Базовые опции
    target?: string; // ID элемента DOM
    darkTheme?: boolean; // Темная тема

    // Для одного слоя
    data?: GeoJSON.FeatureCollection;
    isClustering?: boolean;
    interactionHandler?: (features: any[]) => void;
    style?: YourMapLayerStyleType;

    // Для множественных слоев
    layers?: {
        [layerName: string]: YourMapLayerOptionsType;
    };
}
```

#### Методы

##### Работа с данными

```typescript
// Установить данные (заменить существующие)
map.setData(data: GeoJSON.FeatureCollection, layerName?: string);

// Добавить данные к существующим
map.addData(data: GeoJSON.FeatureCollection, layerName?: string);

// Очистить данные
map.clearData(layerName?: string);
```

##### Работа со стилями

```typescript
// Установить стили
map.setStyles(styles: YourMapLayerStyleType, layerName?: string);
```

##### Работа со слоями

```typescript
// Получить все слои
const layers = map.getLayers();

// Получить конкретный слой
const layer = map.getLayer("layerName");
```

### YourMapLayer

Класс для управления отдельным слоем карты.

#### Конструктор

```typescript
new YourMapLayer(options: YourMapLayerOptionsType)
```

#### Опции слоя

```typescript
interface YourMapLayerOptionsType {
    data?: GeoJSON.FeatureCollection;
    isClustering?: boolean;
    interactionHandler?: (features: any[]) => void;
    style?: YourMapLayerStyleType;
    name?: string;
}
```

### Типы стилей

```typescript
// Простая функция стилизации
type StyleFunction = (feature: FeatureLike, resolution: number) => Style;

// Стили для разных состояний
type FeatureStyleType = {
    plain: StyleFunction; // Обычное состояние
    selected: StyleFunction; // Выделенное состояние
};

// Стили для разных типов объектов
type FeatureStyleOptionType = {
    point?: Partial<FeatureStyleType> | StyleFunction;
    cluster?: Partial<FeatureStyleType> | StyleFunction;
};
```

## 🎨 Примеры стилизации

### Базовые стили

```typescript
import { Style, Circle, Fill, Stroke, Text } from "ol/style";

// Простой стиль точки
const pointStyle = new Style({
    image: new Circle({
        radius: 10,
        fill: new Fill({ color: "#3399ff" }),
        stroke: new Stroke({ color: "#ffffff", width: 2 }),
    }),
});

// Стиль кластера с текстом
const clusterStyle = (feature: FeatureLike) => {
    const size = feature.get("features").length;
    return new Style({
        image: new Circle({
            radius: 15,
            fill: new Fill({ color: "#ff6600" }),
            stroke: new Stroke({ color: "#ffffff", width: 3 }),
        }),
        text: new Text({
            text: size.toString(),
            fill: new Fill({ color: "#ffffff" }),
            font: "bold 12px Arial",
        }),
    });
};
```

### Стили на основе данных

```typescript
const dataBasedStyle = (feature: FeatureLike) => {
    const status = feature.get("status");
    const color = getColorByStatus(status);

    return new Style({
        image: new Circle({
            radius: 8,
            fill: new Fill({ color }),
            stroke: new Stroke({ color: "#ffffff", width: 2 }),
        }),
    });
};

function getColorByStatus(status: string): string {
    const colors = {
        Создано: "#4CAF50",
        "В работе": "#FF9800",
        Закрыто: "#9E9E9E",
        Просрочено: "#F44336",
    };
    return colors[status] || "#2196F3";
}
```

## 🔧 Утилиты

### generateGeoJSON

Функция для генерации тестовых GeoJSON данных.

```typescript
import { generateGeoJSON } from "./helpers/YourMap/GenerateGeoJSON";

// Генерировать 50 случайных точек
const data = generateGeoJSON(50);

// Генерировать 200 точек
const largeDataset = generateGeoJSON(200);
```

## 🎯 Примеры использования

### Полный пример с Vue.js

```vue
<template>
    <div>
        <div id="map" style="width: 100%; height: 400px;"></div>
        <button @click="addRandomData">Добавить данные</button>
        <button @click="clearMap">Очистить карту</button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { YourMap } from "@/helpers/YourMap/YourMap";
import { generateGeoJSON } from "@/helpers/YourMap/GenerateGeoJSON";

let map: YourMap;

onMounted(() => {
    map = new YourMap({
        target: "map",
        darkTheme: true,
        data: generateGeoJSON(100),
        interactionHandler: (features) => {
            console.log("Выделенные объекты:", features);
        },
    });
});

const addRandomData = () => {
    const newData = generateGeoJSON(50);
    map.addData(newData);
};

const clearMap = () => {
    map.clearData();
};
</script>
```

### Пример с кастомными стилями

```typescript
import { Style, Circle, Fill, Stroke, Text } from "ol/style";

// Стиль для обычных точек
const pointStyle = new Style({
    image: new Circle({
        radius: 8,
        fill: new Fill({ color: "#2196F3" }),
        stroke: new Stroke({ color: "#ffffff", width: 2 }),
    }),
});

// Стиль для выделенных точек
const selectedPointStyle = new Style({
    image: new Circle({
        radius: 12,
        fill: new Fill({ color: "#FF5722" }),
        stroke: new Stroke({ color: "#ffffff", width: 3 }),
    }),
});

// Стиль для кластеров
const clusterStyle = (feature: FeatureLike) => {
    const size = feature.get("features").length;
    return new Style({
        image: new Circle({
            radius: Math.min(20, 10 + size * 2),
            fill: new Fill({ color: "#4CAF50" }),
            stroke: new Stroke({ color: "#ffffff", width: 3 }),
        }),
        text: new Text({
            text: size.toString(),
            fill: new Fill({ color: "#ffffff" }),
            font: "bold 14px Arial",
        }),
    });
};

const map = new YourMap({
    target: "map",
    style: {
        point: {
            plain: pointStyle,
            selected: selectedPointStyle,
        },
        cluster: {
            plain: clusterStyle,
            selected: clusterStyle,
        },
    },
});
```

## 🏗️ Архитектура

Библиотека состоит из следующих основных компонентов:

- **YourMap** - основной класс для создания карт
- **YourMapLayer** - управление отдельными слоями
- **YourMapDataProcessing** - обработка GeoJSON данных
- **YourMapStyling** - управление стилями объектов
- **YourMapInteraction** - обработка взаимодействий (в разработке)

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

MIT License

## 🆘 Поддержка

Если у вас есть вопросы или проблемы, создайте issue в репозитории проекта.
