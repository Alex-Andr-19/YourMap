import { Collection, Map, type Feature } from "ol";
import type VectorLayer from "ol/layer/Vector";
import type { Cluster } from "ol/source";
import type { InteractionFunctionType, YourMapProvideObjType } from "./YourMap";
import Select from "ol/interaction/Select";
import { click } from "ol/events/condition";

export class YourMapInteraction {
    private dataLayer: VectorLayer<Cluster<Feature>>;
    private select: Select;
    private selectedFeatures: Collection<Feature> = new Collection();
    private olMap: Map | null;

    constructor(provideObj: YourMapProvideObjType) {
        this.dataLayer = provideObj.dataLayer;
        this.olMap = provideObj.olMap;
        this.select = new Select({
            condition: click,
            layers: [this.dataLayer],
        });
    }

    configureSelectedFeatures(interactionHandler?: InteractionFunctionType) {
        this.olMap!.addInteraction(this.select);
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
    }
}
