import type { Feature } from "ol";
import VectorLayer from "ol/layer/Vector";
import { Cluster } from "ol/source";
import { YourMapDataProcessing } from "./YourMapDataProcessing";
import { YourMapStyling } from "./YourMapStyling";
import { YourMapInteraction } from "./YourMapInteraction";
import VectorSource from "ol/source/Vector";
import { DEFAULT_LAYER_OPTIONS, DEFAULT_STYLES } from "./MapConstants";
import type { StyleFunction } from "ol/style/Style";
import type Select from "ol/interaction/Select";

export type LayersType = VectorLayer<Cluster<Feature>> | VectorLayer;

/**
 * Function for handle click on cluster features
 */
export type InteractionFunctionType = (features: ReturnType<Feature["getProperties"]>[]) => void;

export type YourMapLayerOptionsType = {
    data?: GeoJSON.FeatureCollection;
    isClustering?: boolean;
    interactionHandler?: InteractionFunctionType;
};

export class YourMapLayer {
    olLayer: LayersType;
    select: Select;
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
            style: DEFAULT_STYLES,
        });

        this.data = new YourMapDataProcessing(this.olLayer);
        this.style = new YourMapStyling(this.olLayer);
        this.interaction = new YourMapInteraction(this.olLayer);

        this.select = this.interaction.select;

        if (options.data) {
            this.data.addData(options.data);
        }

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

    setStyles(styleFunction: StyleFunction) {
        this.style.setStyles(styleFunction);
    }
}
