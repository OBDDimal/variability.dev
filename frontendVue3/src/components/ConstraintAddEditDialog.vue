<template>
    <div class="text-center">
        <v-dialog v-model="showDialog" persistent width="80%">
            <v-card>
                <v-card-title class="text-h5">
                    {{ mode }} Constraint
                </v-card-title>

                <v-divider></v-divider>

                <v-form @submit.prevent="save">
                    <v-card-text>
                        <v-combobox
                            ref="allNodes"
                            v-model="selectedFeatureNode"
                            :items="allNodes"
                            item-text="name"
                            label="Select FeatureNode"
                            @change="
                                appendFeatureNode(selectedFeatureNode.name)
                            "
                        ></v-combobox>

                        <v-row justify="space-between">
                            <v-col cols="6" sm="auto">
                                <v-btn
                                    outlined
                                    @click="appendText('AND', true, true)"
                                    >and
                                </v-btn>
                            </v-col>
                            <v-col cols="6" sm="auto">
                                <v-btn
                                    outlined
                                    @click="appendText('OR', true, true)"
                                    >or
                                </v-btn>
                            </v-col>
                            <v-col cols="6" sm="auto">
                                <v-btn
                                    outlined
                                    @click="appendText('IMPLIES', true, true)"
                                    >implies
                                </v-btn>
                            </v-col>
                            <v-col cols="6" sm="auto">
                                <v-btn
                                    outlined
                                    @click="appendText('NOT', true, true)"
                                    >not
                                </v-btn>
                            </v-col>
                            <v-col cols="6" sm="auto">
                                <v-btn
                                    outlined
                                    @click="appendText('(', true, false)"
                                    >(
                                </v-btn>
                            </v-col>
                            <v-col cols="6" sm="auto">
                                <v-btn
                                    outlined
                                    @click="appendText(')', false, true)"
                                    >)
                                </v-btn>
                            </v-col>
                        </v-row>

                        <v-row class="my-2">
                            <v-col class="pt-0" cols="12">
                                <template>
                                    <v-text-field
                                        ref="inputField"
                                        v-model="constraintText"
                                        :rules="[
                                            (value) => !!value || 'Required.',
                                            (value) =>
                                                checkParse(value) ||
                                                this.errorText,
                                        ]"
                                        clearable
                                        hide-details
                                        label="Constraint"
                                    ></v-text-field>
                                    <label v-if="!isValid">
                                        {{ errorText }}
                                    </label>
                                </template>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="secondary" text @click="discard"
                            >Discard
                        </v-btn>
                        <v-btn
                            :disabled="!isValid"
                            color="primary"
                            text
                            type="submit"
                            >{{ mode }}
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { FeatureNode } from '@/classes/FeatureNode';
import { parse } from '@/services/booleanExpressionParser.service';

export default {
    name: 'ConstraintAddEditDialog',

    data: () => ({
        constraintText: '',
        selectedFeatureNode: '',
        isValid: false,
        errorText: '',
    }),

    props: {
        show: Boolean,
        allNodes: [FeatureNode],
        constraint: undefined,
        mode: undefined,
    },

    watch: {
        constraint() {
            this.constraintText = this.constraint
                ? this.constraint.toStringForEdit()
                : '';
        },
    },

    computed: {
        showDialog: {
            get() {
                return this.show;
            },
        },
    },

    methods: {
        discard() {
            this.constraintText = '';
            this.$emit('close');
        },

        save() {
            try {
                const newConstraintItem = parse(
                    this.constraintText,
                    this.allNodes
                );
                this.constraintText = '';
                this.$emit('save', newConstraintItem);
            } catch (e) {
                console.log(e);
            }
        },

        checkParse(value) {
            try {
                parse(value, this.allNodes);
                this.errorText = '';
                this.isValid = true;
                return true;
            } catch (e) {
                this.errorText = e.message;
                this.isValid = false;
                return false;
            }
        },

        appendFeatureNode(featureNodeName) {
            if (!featureNodeName) return;
            let name = featureNodeName;
            if (name.split(' ').length > 1) {
                name = `"${name}"`;
            }
            this.appendText(name, true, true);
        },

        appendText(text, addSpaceBefore, addSpaceAfter) {
            if (!text) return;
            this.$refs.allNodes.internalSearch = '';
            this.$refs.allNodes.internalSearch = '';

            if (!this.constraintText) {
                this.constraintText = '';
            }

            // Add space if there do not exist one.
            const pos = this.$refs.inputField.$refs.input.selectionStart;
            let textToInsert = '';
            if (
                addSpaceBefore &&
                pos !== 0 &&
                this.constraintText.length >= pos &&
                this.constraintText.charAt(pos - 1) !== ' ' &&
                this.constraintText.charAt(pos - 1) !== '('
            ) {
                textToInsert += ' ';
            }
            textToInsert += text;
            if (
                addSpaceAfter &&
                this.constraintText.length >= pos + 1 &&
                this.constraintText.charAt(pos) !== ' '
            ) {
                textToInsert += ' ';
            }

            this.constraintText =
                this.constraintText.slice(0, pos) +
                textToInsert +
                this.constraintText.slice(pos);
        },
    },
};
</script>
