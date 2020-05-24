<template>
    <v-layout row wrap>
        <v-flex xs12 class="mt-3">
            <v-toolbar flat color="white">
                <v-btn color="blue darken-1" flat @click="goBack">Go back</v-btn>
                <v-divider
                        class="mx-2"
                        inset
                        vertical
                ></v-divider>
                <v-toolbar-title>{{ itemName }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" :loading="saveLoading" flat @click="$emit('apply')">Save</v-btn>

                <v-dialog v-model="deleteDialog" max-width="500px">
                    <v-card>
                        <v-card-title>
                            <v-layout row wrap justify-center>
                                <span class="headline ">Вы уверены, что хотите удалить {{ itemName }}?</span>
                            </v-layout>
                        </v-card-title>
                        <v-card-actions>
                            <v-layout row wrap justify-center>
                                <v-btn color="blue darken-1" flat @click="closeDeleteDialog">Cancel</v-btn>
                                <v-btn color="blue darken-1" flat @click="sureDelete">Delete</v-btn>
                            </v-layout>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>

            <v-flex xs12>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex v-bind="descr['flexValues']" v-for="[key, descr] in fields" :key="key">
                            <template v-if="descr['descriptionFieldType'] === 'textField'">
                                <template v-if="key.indexOf('.') === -1">
                                    <v-text-field
                                            v-if="descr['objectKeyField'] === undefined"
                                            v-model="value[key]"
                                            v-bind="descr"
                                    ></v-text-field>
                                    <v-text-field
                                            v-else
                                            v-model="value[key][descr['objectKeyField']]"
                                            v-bind="descr"
                                    ></v-text-field>
                                </template>
                                <template v-else>
                                    <v-text-field
                                            v-if="descr['objectKeyField'] === undefined"
                                            v-model="value[key.split('.')[0]][key.split('.')[1]]"
                                            v-bind="descr"
                                    ></v-text-field>
                                    <v-text-field
                                            v-else
                                            v-model="value[key][descr['objectKeyField']]"
                                            v-bind="descr"
                                    ></v-text-field>
                                </template>
                            </template>
                            <v-text-field
                                    v-if="descr['descriptionFieldType'] === 'dateField'"
                                    v-model="value[key]"
                                    v-bind="descr"
                            ></v-text-field>
                            <v-textarea
                                    v-if="descr['descriptionFieldType'] === 'textArea'"
                                    v-model="value[key]"
                                    v-bind="descr"
                            ></v-textarea>
                            <v-select
                                    v-if="descr['descriptionFieldType'] === 'selectField'"
                                    v-model="value[key]"
                                    v-bind="descr"
                                    :items="items[key]"
                            ></v-select>
                            <v-checkbox
                                    v-if="descr['descriptionFieldType'] === 'checkBox'"
                                    v-model="value[key]"
                                    v-bind="descr"
                            ></v-checkbox>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-btn color="primary" dark class="mb-2" @click="updateBlendsItems">Загрузить данные</v-btn>
                <v-data-table
                        :headers="headers"
                        :items="itemsBlend"
                        :loading="itemsLoading"
                        class="elevation-1">
                    <template v-slot:items="props">
                        <template v-for="[key, descr] in Object.entries(itemsDescription)">
                            <td
                                    :key="key"
                                    v-if="(descr['showInTable'] !== undefined ? descr['showInTable'] : true)
                                 && descr['descriptionFieldType'] !== 'checkBox'"
                            > {{ getValues(props.item[key], descr) }}
                            </td>
                            <td :key="key" v-if="descr['descriptionFieldType'] === 'checkBox'">
                                <v-checkbox
                                        v-model="props.item[key]"
                                        primary
                                        hide-details
                                ></v-checkbox>
                            </td>

                        </template>
                        <td class="justify-center layout px-0">
                            <v-icon
                                    small
                                    @click="deleteItem(props.item)">
                                delete
                            </v-icon>
                        </td>
                    </template>
                </v-data-table>
            </v-flex>

        </v-flex>
    </v-layout>
</template>

<script>
    import HTTP from "../http";
    import lodash from "lodash";

    export default {
        name: "PolymerDetail",
        props: {
            itemId: String,
            crudURL: String,
            itemName: String,
            value: Object,
            fieldsDescription: Object,
            isOpen: Boolean,
            saveLoading: Boolean,
            headers: [],
        },
        data() {
            return {
                items: {},
                deleteDialog: false,
                item: Object,
                itemsBlend: [],
                deletedItem: this.defaultItem,
                editedItem: this.defaultItem,
                createdItem: this.defaultItem,
                itemsLoading: false,
            }
        },
        methods: {
            goBack() {
                return this.$router.go(-1)
            },
            closeDeleteDialog() {
                this.deletedItem = null;
                this.deleteDialog = false;
            },
            sureDelete: function () {
                this.deleteLoading = true;
                HTTP.delete(`${this.crudURL}/${this.deletedItem.id}`).then(() => {
                    this.deleteLoading = false;
                    this.deleteDialog = false;
                    this.success();
                }).catch(error => {
                    this.deleteLoading = false;
                    this.deleteDialog = false;
                    this.error(error);
                })
            },
            getValues(prop, descr) {
                if (descr.convertFunction !== undefined) {
                    return descr.convertFunction(prop)
                }
                return prop
            },
            async retrieveSelectable(fields) {
                fields.filter(([, descr]) => {
                    return descr['descriptionFieldType'] === 'selectField';
                }).forEach(([key, descr]) => {
                    HTTP.get(descr['urlToGetSelectables']).then(response => {
                        this.items[key] = response.data
                    })
                })
            },
            updateBlendsItems() {
                this.deletedItem = lodash.cloneDeep(this.defaultItem);
                this.editedItem = lodash.cloneDeep(this.defaultItem);
                this.createdItem = lodash.cloneDeep(this.defaultItem);
                this.itemsLoading = true;
                HTTP.get(`${this.crudURL}/${this.itemId}/blends`).then(response => {
                    this.itemsLoading = false;
                    this.itemsBlend = response.data
                }).catch(error => {
                    this.itemsLoading = false;
                    this.error(error);
                });
            },

        },
        computed: {
            fields() {
                const fields = Object.entries(this.fieldsDescription).filter(([, descr]) => {
                    return descr['editableField'] !== undefined ? descr['editableField'] : true;
                });
                fields.forEach(([key,]) => {
                    this.items[key] = [];
                });
                this.retrieveSelectable(fields);
                return fields;
            }
        },
        activated() {
            this.updateBlendsItems()
        }

    }
</script>

<style scoped>

</style>