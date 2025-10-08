import { Collection, type Feature } from "ol";
import type { InteractionFunctionType } from "./YourMap";
import Select from "ol/interaction/Select";
import { click } from "ol/events/condition";
import type VectorLayer from "ol/layer/Vector";
import type { Cluster } from "ol/source";

export class YourMapInteraction {
    private layer: VectorLayer<Cluster<Feature>>;
    private select: Select;
    private selectedFeatures: Collection<Feature> = new Collection();

    constructor(layer: VectorLayer<Cluster<Feature>>) {
        this.layer = layer;
        this.select = new Select({
            condition: click,
            layers: [this.layer],
        });
    }

    configureSelectedFeatures(interactionHandler?: InteractionFunctionType) {
        // this.olMap!.addInteraction(this.select);
        this.selectedFeatures = this.select.getFeatures();

        this.selectedFeatures.on("add", (e) => {
            const feature = e.element;
            const clusterFeatures = feature.get("features") as Feature[];
            const clusterFeaturesProperties = clusterFeatures.map((el) => el.getProperties());
            if (interactionHandler) {
                interactionHandler(clusterFeaturesProperties);
            }
        });

        this.selectedFeatures.on("remove", (e) => {
            const feature = e.element;
            console.log(feature);
        });

        return this.select;
    }
}
