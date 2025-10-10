import { Collection, Map, type Feature } from "ol";
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
import { unByKey } from "ol/Observable";
import type { EventsKey } from "ol/events";
import type BaseEvent from "ol/events/Event";

export class YourMapInteraction {
    private layer: LayersType;
    private isClustering: boolean;
    private selectedFeatures: Collection<Feature> = new Collection();
    private selectInteraction: Select;
    private styles: FeatureStyleFullOptionType;
    private olMap: Map | null = null;

    private layerChangeListener: EventsKey;

    constructor(options: YourMapInteractionsOptionsType) {
        this.layer = options.layer;
        this.styles = options.styles;
        this.isClustering = this.layer.getSource() instanceof Cluster;
        this.selectInteraction = new Select({
            condition: click,
            layers: [this.layer],
            style: this.styleFunction.bind(this),
        });

        this.layerChangeListener = this.layer.on(
            "change",
            this.layerChangeListenerFunction.bind(this),
        );
    }

    private layerChangeListenerFunction(ev: BaseEvent) {
        setTimeout(() => {
            this.olMap = this.layer.getMapInternal();
            if (this.olMap) {
                this.configureParentMap();
                unByKey(this.layerChangeListener);
            }
        }, 200);
    }

    private configureParentMap() {
        this.olMap!.addInteraction(this.selectInteraction);
    }

    private getFeaturesOnInteractionEvent(feature: Feature) {
        let features = [feature];
        if (this.isClustering) {
            features = feature.get("features") as Feature[];
        }

        return new Set(features);
    }

    configureSelectedFeatures(interactionHandler?: InteractionFunctionType) {
        this.selectedFeatures = this.selectInteraction.getFeatures();

        if (interactionHandler) {
            this.selectedFeatures.on("add", (e) => {
                const features = this.getFeaturesOnInteractionEvent(e.element);
                const featuresProperties = [...features].map((el) => el.getProperties());
                interactionHandler(featuresProperties);
            });

            this.selectedFeatures.on("remove", (e) => {
                console.log("Here!!!");
                const features = this.getFeaturesOnInteractionEvent(e.element);
                const featuresProperties = [...features].map((el) => el.getProperties());
                console.log(featuresProperties);
            });
        }
    }

    private styleFunction(feature: FeatureLike, resolution: number): Style {
        const featureType = YourMap.getTypeOfFeature(feature) || "point";

        // TODO: Создать объект кэша стилей по id'шникам фичей внутри кластера
        return this.styles[featureType].selected(feature, resolution) as Style;
    }

    isFeatureSelected(feature: Feature): boolean {
        return this.selectedFeatures.getArray().includes(feature);
    }
}
