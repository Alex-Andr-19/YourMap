import type { CoordinateType } from "./YourMap";

const firstPoint: CoordinateType = [43.84, 56.37];
const secondPoint: CoordinateType = [44.15, 56.24];

const statuses: string[] = [
    "Создано",
    "На модерации",
    "Назначено",
    "В работе",
    "Закрыто",
    "Просрочено",
];

function randNumberWithBorders(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

export function generateGeoJSON(count: number = 50): GeoJSON.FeatureCollection {
    const features: GeoJSON.Feature[] = [];

    for (let i = 0; i < count; i++) {
        const long = randNumberWithBorders(firstPoint[0], secondPoint[0]);
        const lat = randNumberWithBorders(firstPoint[1], secondPoint[1]);

        features.push({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [long, lat],
            },
            properties: {
                id: i,
                status: statuses[Math.ceil(randNumberWithBorders(0, statuses.length + 1))],
            },
        });
    }

    return {
        type: "FeatureCollection",
        features,
    };
}
