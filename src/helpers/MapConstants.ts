import type { Feature } from "ol";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style, { type StyleFunction, type StyleLike } from "ol/style/Style";
import Text from "ol/style/Text";
import type { YourMapOptions } from "./YourMap";

export const DEFAULT_STYLES: StyleLike = (feature) => {
    const size = feature.get("features").length;
    return new Style({
        image: new CircleStyle({
            radius: 10,
            stroke: new Stroke({
                color: "#fff",
            }),
            fill: new Fill({
                color: "#3399CC",
            }),
        }),
        text: new Text({
            text: size.toString(),
            fill: new Fill({
                color: "#fff",
            }),
        }),
    });
};

export const DEFAULT_CONSTRUCTOR_OPTIONS: YourMapOptions = {
    darkTheme: true,
};
