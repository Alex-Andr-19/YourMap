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
import { unByKey, type EventTypes } from "ol/Observable";
import type { LayerRenderEventTypes } from "ol/render/EventType";
import type { BaseLayerObjectEventTypes } from "ol/layer/Base";
import type { LayerEventType } from "ol/layer/Layer";
import type { EventsKey } from "ol/events";
import type BaseEvent from "ol/events/Event";

export class YourMapInteraction {
    private layer: LayersType;
    private isClustering: boolean;
    private selectedFeatures: Collection<Feature> = new Collection();
    private select: Select;
    private styles: FeatureStyleFullOptionType;
    private olMap: Map | null = null;

    private layerChangeListener: EventsKey;

    constructor(options: YourMapInteractionsOptionsType) {
        this.layer = options.layer;
        this.styles = options.styles;
        this.isClustering = this.layer.getSource() instanceof Cluster;
        this.select = new Select({
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
            if (this.olMap === null) {
                this.olMap = this.layer.getMapInternal();
                this.olMap?.addInteraction(this.select);
                unByKey(this.layerChangeListener);
            }
        }, 200);
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
}
