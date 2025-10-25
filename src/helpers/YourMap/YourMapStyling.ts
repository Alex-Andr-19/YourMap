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
import type { StyleLike } from "ol/style/Style";
import type Feature from "ol/Feature";

export class YourMapStyling {
    layer: LayersType;
    layerStyle: FeatureStyleFullOptionType;

    constructor(_options: YourMapStylingOptionsType) {
        this.layer = _options.layer;
        this.layerStyle = clone(this.configureStylingOptions(_options.layerStyle));

        this.applyStyles(this.styleFunction.bind(this));
    }

    private configureStylingOptions(options: YourMapLayerStyleType): FeatureStyleFullOptionType {
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

    private styleFunction(feature: FeatureLike, resolution: number): Style {
        const featureType = YourMap.getTypeOfFeature(feature);
        let isFeatureSelected = feature.get("selected") === true;
        const features = feature.get("features") as Feature[];
        if (features !== undefined) {
            isFeatureSelected =
                features.map((el) => !!el.get("selected")).reduce((total, x) => (total += +x), 0) >
                0;
        }
        const styleType = isFeatureSelected ? "selected" : "plain";

        return this.layerStyle[featureType][styleType](feature, resolution) as Style;
    }

    private applyStyles(styleFunction: StyleLike) {
        this.layer.setStyle(styleFunction);
    }

    setStyles(options: YourMapLayerStyleType) {
        if (options instanceof Function) {
            this.layerStyle.point.plain = options;
            this.layerStyle.cluster.plain = options;
        } else if (options instanceof Object) {
            let key: FeatureStringType;
            for (key in options) {
                const valueOfStyle = options[key];
                if (valueOfStyle instanceof Function) {
                    this.layerStyle[key].plain = valueOfStyle;
                } else {
                    const _valueOfStyle = valueOfStyle as FeatureStyleType;
                    let styleType: keyof FeatureStyleType;
                    for (styleType in DEFAULT_STYLES_2.point) {
                        if (styleType in _valueOfStyle)
                            this.layerStyle[key][styleType] = _valueOfStyle[styleType];
                    }
                }
            }
        }
    }
}
