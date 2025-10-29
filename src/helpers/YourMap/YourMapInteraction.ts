import type { Feature, Map } from "ol";
import type {
    InteractionFunctionType,
    LayersType,
    YourMapInteractionsOptionsType,
} from "./index.d.ts";
import { DEFAULT_MAP_INTERACTION } from "./MapConstants.ts";

export class YourMapInteraction {
    /** Обработчик взаимодействий */
    private olLayer: LayersType;

    /** Включена ли кластеризация */
    private isClustering: boolean;

    /** Обработчик взаимодействий */
    private interactionHandler: InteractionFunctionType;

    /** Массив выделенных объектов */
    private selectedFeatures: Feature[] = [];

    constructor(_options: YourMapInteractionsOptionsType) {
        const options = { ...DEFAULT_MAP_INTERACTION, ..._options };

        this.olLayer = options.layer;
        this.interactionHandler = options.interactionHandler;
        this.isClustering = options.isClustering;
    }

    /**
     * Настраивает обработчики взаимодействий (клики, выделение)
     */
    bindInteractions(olMap: Map) {
        olMap.on("click", (ev) => {
            const clickedFeature = olMap.getFeaturesAtPixel(ev.pixel)[0] as Feature;
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
                // console.log("Layer name", this.name, "– missClick");
                console.log("Layer – missClick");
            }

            this.olLayer.changed();
        });
    }
}
