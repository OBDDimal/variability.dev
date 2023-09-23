import { ConfigurationCommand } from '@/classes/Commands/SoloConfigurator/ConfigurationCommand';
import { jsonToXML } from '@/services/xmlTranspiler.service';
import axios from 'axios';

export class ResetCommand extends ConfigurationCommand {
    constructor(featureModel, xml) {
        super(featureModel);
        this.executed = false;
        this.xml = xml;
        this.newSatCount = 0;

        this.description = "Reset";
    }

    execute() {
        if (!this.executed) {
            this.featureModel.loading = true;
            const content = new TextEncoder().encode(this.xml);
            axios.post(`${import.meta.env.VITE_APP_DOMAIN_FEATUREIDESERVICE}propagation`,
              ({      name: this.featureModel.name+".xml",
                      selection: [],
                      content: Array.from(content)
              }))
                .then((d) => {
                    const data = d.data;
                    console.log(data)
                    //this.newSatCount = this.formatScientificNotation(data.count);

                    this.newExplicitlySelectedFeatures = [];
                    this.newImplicitlySelectedFeatures = this.featureModel.features.filter(f => data.impliedSelection.includes(f.name))
                    console.log(this.newImplicitlySelectedFeatures)
                    this.newExplicitlyDeselectedFeatures = [];
                    this.newImplicitlyDeselectedFeatures = [];
                    this.newUnselectedFeatures = [];

                    this.executed = true;

                    this.markAllFeaturesAsPermanantImplicit();
                    super.execute();
                    this.featureModel.loading = false;
                    this.featureModel.loadingOpacity = 0.5;
                })
                .catch(() => {
                    this.featureModel.loading = false;
                });

        } else {
            super.execute();
        }
    }

    markAllFeaturesAsPermanantImplicit() {
        this.newImplicitlySelectedFeatures.forEach(f => f.fix = true);
        this.newImplicitlyDeselectedFeatures.forEach(f => f.fix = true);
    }

    copy() {
        const command = new ResetCommand(this.featureModel, this.xml);
        command.newSatCount = this.newSatCount;

        command.newExplicitlySelectedFeatures = this.newExplicitlySelectedFeatures;
        command.newImplicitlySelectedFeatures = this.newImplicitlySelectedFeatures;
        command.newExplicitlyDeselectedFeatures = this.newExplicitlyDeselectedFeatures;
        command.newImplicitlyDeselectedFeatures = this.newImplicitlyDeselectedFeatures;
        command.newUnselectedFeatures = this.newUnselectedFeatures;

        command.executed = true;
        return command;
    }
}
