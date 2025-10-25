import type { CoordinateType } from "./types";

/** Первая точка границы для генерации данных */
const firstPoint: CoordinateType = [43.84, 56.37];

/** Вторая точка границы для генерации данных */
const secondPoint: CoordinateType = [44.15, 56.24];

/** Возможные статусы для генерации данных */
const statuses: string[] = [
    "Создано",
    "На модерации",
    "Назначено",
    "В работе",
    "Закрыто",
    "Просрочено",
];

/**
 * Генерирует случайное число в заданных границах
 * @param min - минимальное значение
 * @param max - максимальное значение
 * @returns случайное число
 */
function randNumberWithBorders(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

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
export function generateGeoJSON(count: number = 50): GeoJSON.FeatureCollection {
    const features: GeoJSON.Feature[] = [];

    for (let i = 0; i < count; i++) {
        const long = randNumberWithBorders(firstPoint[0], secondPoint[0]);
        const lat = randNumberWithBorders(firstPoint[1], secondPoint[1]);

        const statusRandIndex = Math.floor(randNumberWithBorders(0, statuses.length));
        features.push({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [long, lat],
            },
            properties: {
                id: i,
                status: statuses[statusRandIndex],
            },
        });
    }

    return {
        type: "FeatureCollection",
        features,
    };
}
