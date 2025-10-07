import type { Feature } from "ol";
import type VectorLayer from "ol/layer/Vector";
import type { Cluster } from "ol/source";
import type { StyleLike } from "ol/style/Style";
import type { YourMapProvideObjType } from "./YourMap";

export class YourMapStyling {
    private dataLayer: VectorLayer<Cluster<Feature>>;

    constructor(provideObj: YourMapProvideObjType) {
        this.dataLayer = provideObj.dataLayer;
    }

    setStyles(styleFunction: StyleLike) {
        this.dataLayer.setStyle(styleFunction);
    }
}
