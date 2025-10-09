import type { StyleLike } from "ol/style/Style";
import type { FeatureStyleFullOptionType, LayersType, YourMapStylingOptionsType } from "./types";

export class YourMapStyling {
    layer: LayersType;
    // layerStyle: FeatureStyleFullOptionType;

    constructor(_options: YourMapStylingOptionsType) {
        this.layer = _options.layer;
        // this.layerStyle = {};
    }

    setStyles(styleFunction: StyleLike) {
        this.layer.setStyle(styleFunction);
    }
}
