import type { Feature } from "ol";
import VectorLayer from "ol/layer/Vector";
import { Cluster } from "ol/source";
import { YourMapDataProcessing } from "./YourMapDataProcessing";
import { YourMapStyling } from "./YourMapStyling";
import { YourMapInteraction } from "./YourMapInteraction";
import VectorSource from "ol/source/Vector";
import { DEFAULT_LAYER_OPTIONS, DEFAULT_STYLES_2 } from "./MapConstants";
import type { StyleFunction } from "ol/style/Style";
import type Select from "ol/interaction/Select";
import type { LayersType, YourMapLayerOptionsType } from "./types";
import type { FeatureLike } from "ol/Feature";
import type Style from "ol/style/Style";
import { YourMap } from "./YourMap";

export class YourMapLayer {
    olLayer: LayersType;
    interaction: YourMapInteraction;

    private data: YourMapDataProcessing;
    private style: YourMapStyling;

    constructor(_options: YourMapLayerOptionsType) {
        const options = { ...DEFAULT_LAYER_OPTIONS, ..._options };

        this.olLayer = new VectorLayer({
            source: options.isClustering
                ? new Cluster({
                      distance: 15,
                      source: new VectorSource(), // Инициализируем пустым источником
                  })
                : new VectorSource(),
            style: this.styleFunction.bind(this),
        });

        this.data = new YourMapDataProcessing(this.olLayer);
        this.style = new YourMapStyling({
            layer: this.olLayer,
            layerStyle: options.style,
        });
        this.interaction = new YourMapInteraction(this.olLayer);

        if (options.data) {
            this.data.addData(options.data);
        }

        this.interaction.configureSelectedFeatures(options.interactionHandler);
    }

    styleFunction(feature: FeatureLike, resolution: number): Style {
        const featureType = YourMap.getTypeOfFeature(feature);
        const isFeatureSelected = this.interaction.isFeatureSelected(feature as Feature);

        return DEFAULT_STYLES_2[featureType || "point"][isFeatureSelected ? "selected" : "plain"](
            feature,
            resolution,
        ) as Style;
    }

    setData(data: GeoJSON.FeatureCollection) {
        this.data.setData(data);
    }

    clearData() {
        this.data.clearData();
    }

    addData(data: GeoJSON.FeatureCollection) {
        this.data.addData(data);
    }

    setStyles(styleFunction: StyleFunction) {
        this.style.setStyles(styleFunction);
    }

    bindInteractionToMap() {
        this.interaction.bindInteractionToMap();
    }
}
