import type { StyleFunction, StyleLike } from "ol/style/Style";
import type {
    FeatureStringType,
    FeatureStyleFullOptionType,
    FeatureStyleType,
    LayersType,
    YourMapLayerStyleType,
    YourMapStylingOptionsType,
} from "./types";
import { DEFAULT_STYLES_2 } from "./MapConstants";
import type { FeatureLike } from "ol/Feature";
import type Style from "ol/style/Style";
import { YourMap } from "./YourMap";
import { clone } from "../deepClone";

export class YourMapStyling {
    layer: LayersType;
    layerStyle: FeatureStyleFullOptionType;

    constructor(_options: YourMapStylingOptionsType) {
        this.layer = _options.layer;
        this.layerStyle = clone(this.configureStylingOptions(_options.layerStyle));

        this.setStyles(this.styleFunction.bind(this));
    }

    configureStylingOptions(options: YourMapLayerStyleType): FeatureStyleFullOptionType {
        const res = DEFAULT_STYLES_2;

        if (options instanceof Function) {
            res.point.plain = options;
            res.cluster.plain = options;
        } else if (options instanceof Object) {
            let key: FeatureStringType;
            for (key in options) {
                const valueOfStyle = options[key];
                if (valueOfStyle instanceof Function) {
                    res[key].plain = valueOfStyle;
                } else {
                    const _valueOfStyle = valueOfStyle as FeatureStyleType;
                    let styleType: keyof FeatureStyleType;
                    for (styleType in DEFAULT_STYLES_2.point) {
                        if (styleType in _valueOfStyle)
                            res[key][styleType] = _valueOfStyle[styleType];
                    }
                }
            }
        }

        return res;
    }

    styleFunction(feature: FeatureLike, resolution: number): Style {
        const featureType = YourMap.getTypeOfFeature(feature);

        return this.layerStyle[featureType || "point"].plain(feature, resolution) as Style;
    }

    setStyles(styleFunction: StyleLike) {
        this.layer.setStyle(styleFunction);
    }
}
