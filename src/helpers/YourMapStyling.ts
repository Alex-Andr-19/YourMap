import type { StyleLike } from "ol/style/Style";
import type VectorLayer from "ol/layer/Vector";
import type { Cluster } from "ol/source";
import type { Feature } from "ol";

export class YourMapStyling {
    layer: VectorLayer<Cluster<Feature>>;

    constructor(layer: VectorLayer<Cluster<Feature>>) {
        this.layer = layer;
    }

    setStyles(styleFunction: StyleLike) {
        this.layer.setStyle(styleFunction);
    }
}
