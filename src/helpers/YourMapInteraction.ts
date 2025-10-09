import { Collection, type Feature } from "ol";
import Select from "ol/interaction/Select";
import { click } from "ol/events/condition";
import { Cluster } from "ol/source";
import type { InteractionFunctionType, LayersType } from "./types";

export class YourMapInteraction {
    select: Select;

    private layer: LayersType;
    private isClustering: boolean;
    private selectedFeatures: Collection<Feature> = new Collection();

    constructor(layer: LayersType) {
        this.layer = layer;
        this.isClustering = this.layer.getSource() instanceof Cluster;
        this.select = new Select({
            condition: click,
            layers: [this.layer],
        });
    }

    configureSelectedFeatures(interactionHandler?: InteractionFunctionType) {
        this.selectedFeatures = this.select.getFeatures();

        if (interactionHandler) {
            this.selectedFeatures.on("add", (e) => {
                const feature = e.element;
                let resFeature: Feature[] = [feature];
                if (this.isClustering) {
                    resFeature = feature.get("features") as Feature[];
                }
                const featuresProperties = resFeature.map((el) => el.getProperties());
                interactionHandler(featuresProperties);
            });

            this.selectedFeatures.on("remove", (e) => {
                const feature = e.element;
                console.log(feature);
            });
        }
    }
}
