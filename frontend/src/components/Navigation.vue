<template>
    <div>
        <v-app-bar
            v-if="
                $route.name !== 'FeatureModel' ||
                ($route.name === 'FeatureModel' && !isMobileLandscape)
            "
            app
            :color="
                !$store.state.isOnline
                    ? 'error'
                    : !$vuetify.theme.dark
                    ? 'primary'
                    : ''
            "
            dark
            clipped-left
        >
            <v-avatar tile class="hidden-xs-only mr-3">
                <img
                    :src="require('@/assets/ddueruem_logo_thick2.svg')"
                    alt="logo"
                />
            </v-avatar>
            <h1 class="mr-1">
                {{ title }}
            </h1>
            <v-expand-x-transition>
                <sup v-show="!$store.state.isOnline" class="text-body-1">
                    offline
                </sup>
            </v-expand-x-transition>

            <div class="hidden-sm-and-down ml-5">
                <v-btn v-if="$store.state.isOnline" class="mx-1" text to="/">
                    <v-icon left> mdi-home</v-icon>
                    Home
                </v-btn>
                <v-btn
                    v-if="$store.state.loggedIn && $store.state.isOnline"
                    class="mx-1"
                    text
                    to="/profile"
                >
                    <v-icon left> mdi-account</v-icon>
                    Profile
                </v-btn>
                <v-btn
                    v-if="$store.state.loggedIn || !$store.state.isOnline"
                    class="mx-1"
                    text
                    to="/files"
                >
                    <v-icon left> mdi-file</v-icon>
                    Files
                </v-btn>
                <v-btn
                    v-if="$store.state.loggedIn && $store.state.isOnline"
                    class="mx-1"
                    text
                    to="/tags"
                >
                    <v-icon left> mdi-tag</v-icon>
                    Tags
                </v-btn>
                <v-btn
                    v-if="$store.state.loggedIn && $store.state.isOnline"
                    class="mx-1"
                    text
                    to="/families"
                >
                    <v-icon left> mdi-human-male-female-child</v-icon>
                    Families
                </v-btn>
            </div>
            <v-spacer></v-spacer>
            <div class="hidden-md-and-up">
                <v-btn icon @click="$vuetify.theme.dark = !$vuetify.theme.dark">
                    <v-icon v-if="$vuetify.theme.dark">
                        mdi-brightness-7</v-icon
                    >
                    <v-icon v-else> mdi-brightness-4</v-icon>
                </v-btn>
                <v-btn icon v-fullscreen>
                    <v-icon> mdi-fullscreen</v-icon>
                </v-btn>
                <v-btn
                    class="drawer-button"
                    icon
                    @click.stop="drawer = !drawer"
                >
                    <v-icon> mdi-menu </v-icon>
                </v-btn>
            </div>
            <div class="hidden-sm-and-down">
                <!-- TODO show button if logged-in user is admin -->
                <v-btn
                    v-if="
                        $store.state.loggedIn &&
                        $store.state.isOnline &&
                        isAdmin
                    "
                    class="mx-1"
                    :text="!$vuetify.breakpoint.mdAndDown"
                    :icon="$vuetify.breakpoint.mdAndDown"
                    to="/admin"
                >
                    <v-icon :left="!$vuetify.breakpoint.mdAndDown">
                        mdi-security</v-icon
                    >
                    <div class="hidden-md-and-down">Admin</div>
                </v-btn>
                <v-btn
                    v-if="!$store.state.loggedIn && $store.state.isOnline"
                    text
                    to="/register"
                >
                    <v-icon left> mdi-account-plus</v-icon>
                    Register
                </v-btn>
                <v-menu
                    v-if="!$store.state.loggedIn && $store.state.isOnline"
                    v-model="loginMenu"
                    :close-on-content-click="false"
                    nudge-width="250"
                    nudge-top="-20"
                    offset-y
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            v-if="
                                !$store.state.loggedIn && $store.state.isOnline
                            "
                            text
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon left> mdi-login-variant</v-icon>
                            Login
                        </v-btn>
                    </template>

                    <v-card
                        elevation="16"
                        :color="
                            this.$vuetify.theme.dark
                                ? 'grey darken-3'
                                : 'grey lighten-4'
                        "
                    >
                        <v-card-title>Login</v-card-title>
                        <v-card-text style="overflow: hidden">
                            <login-div
                                @onClickedLogin="loginMenu = false"
                            ></login-div>
                        </v-card-text>
                    </v-card>
                </v-menu>
                <v-btn
                    v-if="$store.state.loggedIn && $store.state.isOnline"
                    :text="!$vuetify.breakpoint.mdAndDown"
                    :icon="$vuetify.breakpoint.mdAndDown"
                    @click="logoutAndRedirect()"
                >
                    <v-icon :left="!$vuetify.breakpoint.mdAndDown">
                        mdi-logout-variant</v-icon
                    >
                    <div class="hidden-md-and-down">Logout</div>
                </v-btn>
                <!--				<v-divider class="mx-5" vertical></v-divider>-->
                <v-btn
                    class="mx-3 theme-button"
                    icon
                    @click="$vuetify.theme.dark = !$vuetify.theme.dark"
                >
                    <v-icon v-if="$vuetify.theme.dark">
                        mdi-brightness-7</v-icon
                    >
                    <v-icon v-else> mdi-brightness-4</v-icon>
                </v-btn>
                <v-btn
                    :class="$vuetify.breakpoint.smAndDown ? 'mr-3' : ''"
                    icon
                    v-fullscreen
                >
                    <v-icon> mdi-fullscreen</v-icon>
                </v-btn>
            </div>
        </v-app-bar>
        <v-navigation-drawer
            class="mobile-navigation"
            v-model="drawer"
            app
            temporary
        >
            <v-list>
                <v-list-item link to="/">
                    <v-list-item-icon>
                        <v-icon left> mdi-home</v-icon>
                    </v-list-item-icon>
                    Home
                </v-list-item>
                <v-list-item
                    v-if="$store.state.loggedIn && $store.state.isOnline"
                    link
                    to="/profile"
                >
                    <v-list-item-icon>
                        <v-icon left> mdi-account</v-icon>
                    </v-list-item-icon>
                    Profile
                </v-list-item>
                <v-list-item
                    v-if="$store.state.loggedIn || !$store.state.isOnline"
                    link
                    to="/files"
                >
                    <v-list-item-icon>
                        <v-icon left> mdi-file</v-icon>
                    </v-list-item-icon>
                    Files
                </v-list-item>
                <v-list-item
                    v-if="$store.state.loggedIn && $store.state.isOnline"
                    link
                    to="/tags"
                >
                    <v-list-item-icon>
                        <v-icon left> mdi-tag</v-icon>
                    </v-list-item-icon>
                    Tags
                </v-list-item>
                <v-list-item
                    v-if="$store.state.loggedIn && $store.state.isOnline"
                    link
                    to="/families"
                >
                    <v-list-item-icon>
                        <v-icon left> mdi-human-male-female-child</v-icon>
                    </v-list-item-icon>
                    Families
                </v-list-item>
                <!-- TODO: add isAdmin check -->
                <v-list-item
                    v-if="$store.state.loggedIn && $store.state.isOnline"
                    link
                    to="/admin"
                >
                    <v-list-item-icon>
                        <v-icon left> mdi-security </v-icon>
                    </v-list-item-icon>
                    Admin
                </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list>
                <v-list-item
                    v-if="!$store.state.loggedIn && $store.state.isOnline"
                    link
                    to="/register"
                >
                    <v-list-item-icon>
                        <v-icon left> mdi-account-plus</v-icon>
                    </v-list-item-icon>
                    Register
                </v-list-item>
                <v-list-item
                    v-if="!$store.state.loggedIn && $store.state.isOnline"
                    link
                    to="/login"
                >
                    <v-list-item-icon>
                        <v-icon left> mdi-login-variant</v-icon>
                    </v-list-item-icon>
                    Login
                </v-list-item>
                <v-list-item
                    v-if="$store.state.loggedIn && $store.state.isOnline"
                    link
                    @click="logoutAndRedirect()"
                >
                    <v-list-item-icon>
                        <v-icon left> mdi-logout-variant</v-icon>
                    </v-list-item-icon>
                    Logout
                </v-list-item>
                <v-list-item
                    class="mobile-theme-button"
                    link
                    @click="$vuetify.theme.dark = !$vuetify.theme.dark"
                >
                    <v-list-item-icon v-if="$vuetify.theme.dark">
                        <v-icon left> mdi-brightness-7</v-icon>
                    </v-list-item-icon>
                    <v-list-item-icon v-else>
                        <v-icon left> mdi-brightness-4</v-icon>
                    </v-list-item-icon>
                    Switch theme
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
import Vue from 'vue';
import LoginDiv from '@/components/LoginDiv';

export default Vue.extend({
    name: 'Navigation',

    components: {
        LoginDiv,
    },

    props: {
        title: {
            type: String,
            required: true,
        },
    },

    data: () => ({
        drawer: false,
        isMobileLandscape: false,
        loginMenu: false,
        isAdmin: true, //TODO add logic from backend to determine if logged-in user is admin
    }),

    methods: {
        logoutAndRedirect() {
            if (this.$route.path !== '/') {
                this.$router.push('/');
            }
            this.$store.dispatch('logout');
        },

        handleOrientationChange() {
            const orientation = window.screen.orientation.type;
            if (orientation === 'portrait-primary') {
                this.isMobileLandscape = false;
            } else if (
                orientation === 'landscape-primary' &&
                this.$vuetify.breakpoint.xsOnly
            ) {
                if (this.$route.name === 'FeatureModel') {
                    this.$store.commit('updateSnackbar', {
                        message: 'Rotate device to see Menu',
                        variant: 'info',
                        timeout: 4000,
                        show: true,
                    });
                }
                this.isMobileLandscape = true;
            }
        },
    },

    mounted() {
        window.addEventListener(
            'orientationchange',
            this.handleOrientationChange
        );
    },
});
</script>
