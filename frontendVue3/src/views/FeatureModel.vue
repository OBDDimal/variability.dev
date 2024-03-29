<template>
    <div>
        <feature-model-tree
            v-if="data.rootNode"
            :key="reloadKey"
            ref="featureModelTree"
            :collaborationStatus="collaborationStatus"
            :command-manager="featureModelCommandManager"
            :constraints="data.constraints"
            :editRights="editRights"
            :rootNode="data.rootNode"
            @exportToXML="exportToXML"
            @reset="reset"
            @save="save"
            @update-constraints="updateConstraints"
            @show-collaboration-dialog="
                showStartCollaborationSessionDialog = true
            "
            @show-claim-dialog="showClaimDialog"
            @new-empty-model="newEmptyModel"
            @show-tutorial="showTutorial = true"
        >
        </feature-model-tree>
    </div>
</template>

<script>
import FeatureModelTree from '../components/FeatureModel/FeatureModelTree.vue';
import Constraints from '../components/Constraints.vue';
import * as update from '@/services/FeatureModel/update.service';
import api from '@/services/api.service';
import beautify from 'xml-beautifier';
import CollaborationManager from '@/classes/CollaborationManager';
import { CommandManager } from '@/classes/Commands/CommandManager';
import * as xmlTranspiler from '@/services/xmlTranspiler.service';
import { jsonToXML } from '@/services/xmlTranspiler.service';
import CollaborationToolbar from '@/components/CollaborationToolbar';
import CollaborationNameDialog from '@/components/CollaborationNameDialog';
import CollaborationContinueEditingDialog from '@/components/CollaborationContinueEditingDialog';
import { EXAMPLE_FEATURE_MODEL_XML } from '@/classes/constants';
import TutorialMode from '@/components/TutorialMode';
import { NewEmptyModelCommand } from '@/classes/Commands/FeatureModel/NewEmptyModelCommand';
import FeatureModelInformation from '@/components/FeatureModel/FeatureModelInformation';
import { useAppStore } from '@/store/app';
import { useRouter } from 'vue-router';

const router = useRouter();
const appStore = useAppStore();

export default {
    name: 'FeatureModel',

    components: {
        TutorialMode,
        FeatureModelInformation,
        CollaborationContinueEditingDialog,
        CollaborationToolbar,
        FeatureModelTree,
        Constraints,
        CollaborationNameDialog,
    },

    props: {
        id: undefined,
        collaborationKey: undefined,
    },

    data() {
        return {
            data: {
                featureMap: [],
                constraints: [],
                properties: [],
                calculations: undefined,
                comments: [],
                featureOrder: undefined,
                rootNode: undefined,
            },
            xml: undefined,
            reloadKey: 0,
            collaborationReloadKey: 10000,
            featureModelCommandManager: new CommandManager(),
            constraintCommandManager: new CommandManager(),
            collaborationManager: null,
            editRights: true,
            showStartCollaborationSessionDialog: false,
            showClaimDialog: false,
            showContinueEditingDialog: false,
            collaborationStatus: false,
            openConstraints: false,
            openInformation: false,
            showTutorial: false,
        };
    },

    created() {
        this.collaborationManager = new CollaborationManager(
            this.featureModelCommandManager,
            this.constraintCommandManager,
            this
        );
        this.featureModelCommandManager.commandEvent = this.commandEvent;
        this.constraintCommandManager.commandEvent = this.commandEvent;
        console.log(this.id);
        if (this.id === 'local') {
            const xml = beautify(localStorage.featureModelData);
            xmlTranspiler.xmlToJson(xml, this.data);
            this.xml = xml;
        } else if (this.id === 'new') {
            const xml = beautify(EXAMPLE_FEATURE_MODEL_XML);
            xmlTranspiler.xmlToJson(xml, this.data);
            this.xml = xml;
        } else if (this.id) {
            this.initData();
        } else if (this.collaborationKey) {
            const uuid = this.collaborationKey.substring(
                0,
                this.collaborationKey.length - 1
            );
            const checksum = this.collaborationKey.slice(-1);
            const condition =
                checksum ===
                (
                    Array.from(uuid).reduce(
                        (last, curr) => parseInt(last, 16) + parseInt(curr, 16)
                    ) % 16
                ).toString(16);
            if (condition) {
                this.collaborationManager.joinCollaboration(
                    this.collaborationKey
                );
            } else {
                alert('Wrong key!');
            }
        }

        // Start tutorial mode if it has not been completed before
        this.showTutorial = !localStorage.featureModelTutorialCompleted;
    },

    beforeRouteLeave(to, from, next) {
        // If session gets closed by host, don't ask for confirmation
        if (this.collaborationManager.noConfirm) {
            const answer = window.confirm(
                'Do you really want to leave the page? Collaboration sessions will be closed and data will be lost!'
            );

            if (answer) {
                // If user wants to close page
                this.collaborationManager.closeCollaboration();
                next();
            } else {
                // If user doesn't want to close page
                next(false);
            }
        } else {
            // Don't prevent default site changes without collaboration
            next();
        }
    },

    methods: {
        save() {
            localStorage.featureModelData = jsonToXML(this.data);
            window.onbeforeunload = null;

            appStore.updateSnackbar(
                'Successfully saved in local storage',
                'success',
                5000,
                true
            );
        },

        reset() {
            // TODO: Transpile the xml file new and restart viewer.
            this.initData();
            this.reloadKey++;
        },

        newEmptyModel() {
            const command = new NewEmptyModelCommand(
                this,
                this.$refs.featureModelTree.d3Data
            );
            this.featureModelCommandManager.execute(command);
            this.updateFeatureModel();
        },

        initData() {
            api.get(`${import.meta.env.VITE_APP_DOMAIN}files/${this.id}/`).then(
                (data) => {
                    api.get(data.data.local_file).then((rawData) => {
                        const xml = beautify(rawData.data);
                        xmlTranspiler.xmlToJson(xml, this.data);
                        this.xml = xml;
                    });
                }
            );
        },

        updateFeatureModel() {
            update.updateSvg(this.$refs.featureModelTree.d3Data);
        },

        updateConstraints() {
            this.$refs.constraints.update();
        },

        exportToXML() {
            xmlTranspiler.downloadXML(this.data);
        },

        commandEvent() {
            // Can't override text for Chrome & Edge
            window.onbeforeunload = function () {
                return 'Do you really want to leave the page? Collaboration sessions will be closed and data will be lost!';
            };
        },

        createCollaboration() {
            this.showStartCollaborationSessionDialog = false;
            this.collaborationManager.createCollaboration();
            navigator.clipboard.writeText(
                `${import.meta.env.VITE_APP_DOMAIN}collaboration/${
                    this.collaborationManager.collaborationKey
                }`
            );
        },

        continueEditing() {
            this.showContinueEditingDialog = false;
            this.collaborationManager.closeCollaboration();
            this.editRights = true;
        },

        closeFeatureModel() {
            this.showContinueEditingDialog = false;
            this.collaborationManager.closeCollaboration();
            this.collaborationManager.noConfirm = false;
            router.push('/');
        },
    },
};
</script>
