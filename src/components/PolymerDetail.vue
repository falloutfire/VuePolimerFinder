<template>
    <v-layout row wrap>
        <v-flex xs12 class="mt-3">
            <v-toolbar flat color="white">
                <v-toolbar-title>{{ tableName }}</v-toolbar-title>
                <v-divider
                        class="mx-2"
                        inset
                        vertical
                ></v-divider>
            </v-toolbar>

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
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: "PolymerDetail",
        data() {
            return {
                item: Object
            }
        }
    }
</script>

<style scoped>

</style>