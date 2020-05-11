<template>
    <v-dialog v-model="isOpen" max-width="500px" persistent>
        <v-card>
            <v-card-title>
                <span class="headline mt-2 ml-2">{{ itemName }}</span>
            </v-card-title>

            <v-card-text>
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
                            <v-data-table
                                    v-if="descr['descriptionFieldType'] === 'tableView'"
                                    :headers="headers"
                                    :items="updateItems"
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
                    </v-layout>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="$emit('close')">Cancel</v-btn>
                <v-btn color="blue darken-1" :loading="saveLoading" flat @click="$emit('apply')">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import HTTP from "@/http";
    import lodash from 'lodash';

    export default {
        name: "EditTable",
        props: {
            value: Object,
            fieldsDescription: Object,
            isOpen: Boolean,
            saveLoading: Boolean,
            itemName: String,
            headers: [],
        },
        data() {
            return {
                items: {},
                itemsBlend: [],
                itemsLoading: false,
                deleteDialog: false,
                deletedItem: this.defaultItem,
                editedItem: this.defaultItem,
                createdItem: this.defaultItem,
            }
        },
        methods: {
            updateBlendsItems() {
                this.deletedItem = lodash.cloneDeep(this.defaultItem);
                this.editedItem = lodash.cloneDeep(this.defaultItem);
                this.createdItem = lodash.cloneDeep(this.defaultItem);
                this.itemsLoading = true;
                HTTP.get(`${this.crudURL}/${this.id}/blends`).then(response => {
                    this.itemsLoading = false;
                    this.itemsBlend = response.data
                }).catch(error => {
                    this.itemsLoading = false;
                    this.error(error);
                });
            },
            success() {
                this.updateItems();
                this.snackbarText = 'Операция прошла успешно';
                this.snackbar = true;
                this.snackbarColor = 'success';
            },
            deleteItem(item) {
                this.deletedItem = item;
                this.deleteDialog = true;
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
            parseDate(key) {
                return new Date(key).toISOString().substr(0, 10)
            }
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
    }
</script>

<style scoped>

</style>
