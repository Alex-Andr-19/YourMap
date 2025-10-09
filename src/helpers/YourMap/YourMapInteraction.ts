import { Collection, type Feature } from "ol";
import Select from "ol/interaction/Select";
import { click } from "ol/events/condition";
import { Cluster } from "ol/source";
import type {
    FeatureStyleFullOptionType,
    InteractionFunctionType,
    LayersType,
    YourMapInteractionsOptionsType,
} from "./types";
import type { FeatureLike } from "ol/Feature";
import type Style from "ol/style/Style";
import { YourMap } from "./YourMap";

export class YourMapInteraction {
    private layer: LayersType;
    private isClustering: boolean;
    private selectedFeatures: Collection<Feature> = new Collection();
    private select: Select;
    private styles: FeatureStyleFullOptionType;

    constructor(options: YourMapInteractionsOptionsType) {
        this.layer = options.layer;
        this.styles = options.styles;
        this.isClustering = this.layer.getSource() instanceof Cluster;
        this.select = new Select({
            condition: click,
            layers: [this.layer],
            style: this.styleFunction.bind(this),
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

    styleFunction(feature: FeatureLike, resolution: number): Style {
        const featureType = YourMap.getTypeOfFeature(feature);

        return this.styles[featureType || "point"].selected(feature, resolution) as Style;
    }

    isFeatureSelected(feature: Feature): boolean {
        return this.selectedFeatures.getArray().includes(feature);
    }

    bindInteractionToMap() {
        this.layer.getMapInternal()?.addInteraction(this.select);
    }
}
