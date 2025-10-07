import type { Feature } from "ol";
import type VectorLayer from "ol/layer/Vector";
import type { Cluster } from "ol/source";
import type { StyleLike } from "ol/style/Style";

export class YourMapStyling {
    private dataLayer: VectorLayer<Cluster<Feature>>;

    constructor(dataLayer: VectorLayer<Cluster<Feature>>) {
        this.dataLayer = dataLayer;
    }

    setStyles(styleFunction: StyleLike) {
        this.dataLayer.setStyle(styleFunction);
    }
}
