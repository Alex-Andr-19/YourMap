import type { StyleLike } from "ol/style/Style";
import type { LayersType } from "./YourMap";

export class YourMapStyling {
    layer: LayersType;

    constructor(layer: LayersType) {
        this.layer = layer;
    }

    setStyles(styleFunction: StyleLike) {
        this.layer.setStyle(styleFunction);
    }
}
