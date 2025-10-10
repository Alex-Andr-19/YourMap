import VectorLayer from "ol/layer/Vector";
import { Cluster } from "ol/source";
import { YourMapDataProcessing } from "./YourMapDataProcessing";
import { YourMapStyling } from "./YourMapStyling";
import { YourMapInteraction } from "./YourMapInteraction";
import VectorSource from "ol/source/Vector";
import { DEFAULT_LAYER_OPTIONS } from "./MapConstants";
import type { LayersType, YourMapLayerOptionsType, YourMapLayerStyleType } from "./types";

export class YourMapLayer {
    olLayer: LayersType;

    private data: YourMapDataProcessing;
    private style: YourMapStyling;
    private interaction: YourMapInteraction;

    constructor(_options: YourMapLayerOptionsType) {
        const options = { ...DEFAULT_LAYER_OPTIONS, ..._options };

        this.olLayer = new VectorLayer({
            source: options.isClustering
                ? new Cluster({
                      distance: 15,
                      source: new VectorSource(), // Инициализируем пустым источником
                  })
                : new VectorSource(),
        });

        this.data = new YourMapDataProcessing(this.olLayer);
        this.style = new YourMapStyling({
            layer: this.olLayer,
            layerStyle: options.style,
        });
        this.interaction = new YourMapInteraction({
            layer: this.olLayer,
            styles: this.style.layerStyle,
        });

        if (options.data) this.data.addData(options.data);

        this.interaction.configureSelectedFeatures(options.interactionHandler);
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

    setStyles(options: YourMapLayerStyleType) {
        this.style.setStyles(options);
    }
}
