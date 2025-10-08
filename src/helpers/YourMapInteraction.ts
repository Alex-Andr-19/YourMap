import { Collection, type Feature } from "ol";
import type { InteractionFunctionType, LayersType } from "./YourMap";
import Select from "ol/interaction/Select";
import { click } from "ol/events/condition";
import { Cluster } from "ol/source";

export class YourMapInteraction {
    private layer: LayersType;
    private isCluster: boolean;
    private select: Select;
    private selectedFeatures: Collection<Feature> = new Collection();

    constructor(layer: LayersType) {
        this.layer = layer;
        this.isCluster = this.layer.getSource() instanceof Cluster;
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
            let resFeature: Feature[] = [feature];
            if (this.isCluster) {
                resFeature = feature.get("features") as Feature[];
            }
            const featuresProperties = resFeature.map((el) => el.getProperties());
            if (interactionHandler) {
                interactionHandler(featuresProperties);
            }
        });

        this.selectedFeatures.on("remove", (e) => {
            const feature = e.element;
            console.log(feature);
        });

        return this.select;
    }
}
