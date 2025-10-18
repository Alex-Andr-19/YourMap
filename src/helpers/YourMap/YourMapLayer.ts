import VectorLayer from "ol/layer/Vector";
import { Cluster } from "ol/source";
import { YourMapDataProcessing } from "./YourMapDataProcessing";
import { YourMapStyling } from "./YourMapStyling";
import VectorSource from "ol/source/Vector";
import { DEFAULT_LAYER_OPTIONS } from "./MapConstants";
import type {
    InteractionFunctionType,
    LayersType,
    YourMapLayerOptionsType,
    YourMapLayerStyleType,
} from "./types";
import type { Feature, Map } from "ol";

export class YourMapLayer {
    olLayer: LayersType;
    name: string = "main";

    private data: YourMapDataProcessing;
    private style: YourMapStyling;
    private olMap: Map | null = null;
    private isClustering: boolean = true;

    private interactionHandler: InteractionFunctionType;
    private selectedFeatures: Feature[] = [];

    constructor(_options: YourMapLayerOptionsType) {
        const options = { ...DEFAULT_LAYER_OPTIONS, ..._options };
        this.name = options.name;
        this.isClustering = options.isClustering;
        this.interactionHandler = options.interactionHandler;

        this.olLayer = new VectorLayer({
            source: this.isClustering
                ? new Cluster({
                      distance: 25,
                      source: new VectorSource(), // Инициализируем пустым источником
                  })
                : new VectorSource(),
        });

        this.data = new YourMapDataProcessing(this.olLayer);
        this.style = new YourMapStyling({
            layer: this.olLayer,
            layerStyle: options.style,
        });
        if (options.data) this.data.addData(options.data);
    }

    bindMap() {
        this.olMap = this.olLayer.getMapInternal();

        this.bindInteractions();
    }

    private bindInteractions() {
        this.olMap!.on("click", (ev) => {
            const clickedFeature = this.olMap!.getFeaturesAtPixel(ev.pixel)[0] as Feature;
            const eventOfTheSameLayer = this.olLayer
                .getSource()!
                .getFeatures()
                .some((feature: Feature) => feature === clickedFeature);

            if (clickedFeature !== undefined && eventOfTheSameLayer) {
                let selectedFeatures = [clickedFeature];
                if (this.isClustering)
                    selectedFeatures = clickedFeature.get("features") as Feature[];

                if (this.selectedFeatures.length > 0)
                    this.selectedFeatures.forEach((feature: Feature) => {
                        feature.set("selected", false);
                    });
                this.selectedFeatures = selectedFeatures;

                this.selectedFeatures.forEach((feature: Feature) => {
                    feature.set("selected", true);
                });

                this.interactionHandler(this.selectedFeatures);
            } else if (this.selectedFeatures.length > 0) {
                this.selectedFeatures.forEach((feature: Feature) => {
                    feature.set("selected", false);
                });
                this.selectedFeatures = [];
                console.log("Layer name", this.name, "– missClick");
            }

            this.olLayer.changed();
        });
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
