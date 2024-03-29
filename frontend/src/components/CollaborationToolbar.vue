<template>
    <div
        :style="
            $vuetify.breakpoint.smAndDown
                ? 'position: absolute; top: 0; left: 5rem; width: inherit'
                : ''
        "
    >
        <v-row
            class="mt-2"
            :justify="$vuetify.breakpoint.smAndDown ? 'start' : 'center'"
            align="center"
        >
            <v-btn
                v-if="$vuetify.breakpoint.mdAndDown"
                @click="fab = !fab"
                color="primary"
                dark
                small
                fab
                class="mr-2"
            >
                <v-icon v-if="fab"> mdi-close </v-icon>
                <v-icon v-else> mdi-account-multiple </v-icon>
            </v-btn>
            <v-slide-x-transition>
                <v-toolbar
                    v-show="fab || $vuetify.breakpoint.mdAndUp"
                    :absolute="!$vuetify.breakpoint.smAndDown"
                    class="rounded-pill"
                    :class="$vuetify.breakpoint.smAndDown ? '' : 'mt-2'"
                    elevation="9"
                    height="auto"
                    style="border: 2px solid white"
                >
                    <div
                        :style="
                            $vuetify.breakpoint.smAndDown
                                ? 'max-width: 20vw'
                                : 'max-width: 45vw'
                        "
                    >
                        <v-chip-group disabled="true" mandatory>
                            <v-chip
                                :class="
                                    collaborationManager.isClient
                                        ? 'collaboration-pill-disabled'
                                        : ''
                                "
                                color="primary"
                                :disabled="collaborationManager.isClient"
                                @click="
                                    collaborationManager.sendMemberData(
                                        collaborationManager.peer._id
                                    )
                                "
                            >
                                Me ({{ collaborationManager.name }})
                                <v-icon
                                    right
                                    v-if="
                                        collaborationManager.featureModel
                                            .editRights
                                    "
                                    >mdi-lead-pencil</v-icon
                                >
                            </v-chip>
                            <v-chip
                                v-for="member in collaborationManager.members"
                                :key="member.id"
                                :class="
                                    collaborationManager.isClient
                                        ? 'collaboration-pill-disabled'
                                        : ''
                                "
                                :color="
                                    member.name === 'Host' ? 'success' : 'none'
                                "
                                :disabled="collaborationManager.isClient"
                                @click="
                                    collaborationManager.sendMemberData(
                                        member.id
                                    )
                                "
                            >
                                {{ member.name }}
                                <v-icon
                                    right
                                    v-if="
                                        collaborationManager.editorId ===
                                        member.id
                                    "
                                    >mdi-lead-pencil</v-icon
                                >
                            </v-chip>
                        </v-chip-group>
                    </div>

                    <v-tooltip
                        v-if="
                            collaborationManager.isClient &&
                            !collaborationManager.featureModel.editRights &&
                            !collaborationManager.blockEditRequests
                        "
                        bottom
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                icon
                                v-bind="attrs"
                                v-on="on"
                                :disabled="claimButtonClickDisabled"
                                @click="claimEditRights()"
                            >
                                <v-icon>mdi-account-edit</v-icon>
                            </v-btn>
                        </template>
                        <span>Claim edit rights</span>
                    </v-tooltip>

                    <v-tooltip v-if="collaborationManager.isHost" bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                icon
                                v-bind="attrs"
                                v-on="on"
                                :color="
                                    collaborationManager.blockEditRequests
                                        ? 'primary'
                                        : ''
                                "
                                @click="blockEditRequests"
                            >
                                <v-icon>mdi-account-cancel</v-icon>
                            </v-btn>
                        </template>
                        <span>Block edit claims</span>
                    </v-tooltip>

                    <v-tooltip v-if="collaborationManager.isHost" bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                icon
                                v-bind="attrs"
                                @click="showQrCode = true"
                                v-on="on"
                            >
                                <v-icon>mdi-qrcode</v-icon>
                            </v-btn>
                        </template>
                        <span>Show qr code</span>
                    </v-tooltip>

                    <v-tooltip v-if="collaborationManager.isHost" bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                icon
                                v-bind="attrs"
                                @click="copyLink"
                                v-on="on"
                            >
                                <v-icon>mdi-content-copy</v-icon>
                            </v-btn>
                        </template>
                        <span>Copy invitation link</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                color="red"
                                icon
                                v-bind="attrs"
                                @click="showCloseDialog = true"
                                v-on="on"
                            >
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </template>
                        <span v-if="collaborationManager.isHost"
                            >Close session</span
                        >
                        <span v-else>Leave session</span>
                    </v-tooltip>
                </v-toolbar>
            </v-slide-x-transition>
        </v-row>

        <!-- QRCode -->
        <v-dialog v-model="showQrCode" width="auto">
            <v-card>
                <v-card-title>Collaboration</v-card-title>
                <qrcode-vue
                    :value="link()"
                    class="text-center pa-6"
                    size="300"
                ></qrcode-vue>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="error" @click="showQrCode = false"
                        >Close</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Close/Leave dialog -->
        <v-dialog v-model="showCloseDialog" width="auto">
            <v-card>
                <v-card-title class="text-h5" v-if="collaborationManager.isHost"
                    >Do you really want to close the collaboration session?
                </v-card-title>
                <v-card-title class="text-h5" v-else
                    >Do you really want to leave the collaboration
                    session?</v-card-title
                >
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" text @click="showCloseDialog = false"
                        >Cancel</v-btn
                    >
                    <v-btn
                        v-if="collaborationManager.isHost"
                        color="primary"
                        text
                        @click="collaborationManager.closeCollaboration()"
                        >Close
                    </v-btn>
                    <v-btn
                        v-else
                        color="primary"
                        text
                        @click="collaborationManager.closeCollaboration()"
                        >Leave</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Claim dialog that is only visible for host -->
        <v-dialog v-model="showClaimDialog" persistent width="auto">
            <v-card>
                <v-card-title
                    >"{{ collaborationManager.getClaimerName() }}" wants to
                    claim edit rights</v-card-title
                >
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="error"
                        text
                        @click="
                            collaborationManager.sendClaimEditRightsResponse(
                                false
                            )
                        "
                    >
                        Disagree
                    </v-btn>

                    <v-btn
                        color="primary"
                        text
                        @click="
                            collaborationManager.sendClaimEditRightsResponse(
                                true
                            )
                        "
                    >
                        Agree
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import Vue from 'vue';
import QrcodeVue from 'qrcode.vue';

export default Vue.extend({
    name: 'CollaborationToolbar',

    components: {
        QrcodeVue,
    },

    props: {
        collaborationManager: undefined,
        showClaimDialog: undefined,
    },

    data: () => ({
        showQrCode: false,
        showCloseDialog: false,
        claimButtonClickDisabled: false,
        fab: true,
    }),

    methods: {
        link() {
            return `${process.env.VUE_APP_DOMAIN_FRONTEND}collaboration/${this.collaborationManager.collaborationKey}`;
        },

        copyLink() {
            navigator.clipboard.writeText(this.link());
            this.$store.commit('updateSnackbar', {
                message: 'Link copied',
                variant: 'success',
                timeout: 5000,
                show: true,
            });
        },

        claimEditRights() {
            this.collaborationManager.sendClaimEditRightsRequest();
            this.claimButtonClickDisabled = true;
            setTimeout(() => (this.claimButtonClickDisabled = false), 5000);
        },

        blockEditRequests() {
            this.collaborationManager.blockEditRequests =
                !this.collaborationManager.blockEditRequests;
            this.collaborationManager.sendMemberData();
        },
    },
});
</script>

<style scoped>
.collaboration-pill-disabled {
    opacity: 1;
}
</style>
