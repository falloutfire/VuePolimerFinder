<template>
    <v-app>
        <v-layout row wrap>
            <v-toolbar dark color="primary" app>
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <v-toolbar-title class="headline text-uppercase">
                    <span>Klöckner </span>
                    <span class="font-weight-light">ADMIN PANEL</span>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn @click="$store.dispatch('clearTokens').then(() => $router.push({name: 'login'}))" flat>LOG
                        OUT
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-navigation-drawer v-model="drawer"
                                 absolute
                                 temporary width="350">
                <v-toolbar light>
                    <v-list>
                        <v-list-tile-title class="title ml-3">
                            MENU
                        </v-list-tile-title>
                    </v-list>
                </v-toolbar>
                <v-divider></v-divider>
                <v-list dense class="pt-0">
                    <v-list-tile v-for="item in items"
                                 :key="item.title"
                                 @click="setCurrentTable(item.table)">
                        <v-list-tile-content>
                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-navigation-drawer>

            <v-layout row>
                <v-flex v-if="currentTable" xs9 pa-1 class="pt-5">
                    <crud-table
                            :key="currentTable.tableName"
                            v-bind="currentTable"
                    ></crud-table>
                </v-flex>
                <v-divider></v-divider>
                <v-flex xs3 class="pt-5 mt-4 mb-1" pa-1>
                    <v-card dark tile color="white" height="100%">
                        <v-card-title primary-title>
                            <div>
                                <h3 class="headline" style="color:blue;">SERVER STATS</h3>
                            </div>
                            <v-container>

                                <section v-if="errored">
                                    <p>We're not able to retrieve this information at the moment, please try back
                                        later</p>
                                </section>

                                <section v-else>
                                    <div v-if="loading">Loading...</div>

                                    <div v-else>
                                        <div>
                                            <span style="color:blue;font-weight:bold">SERVER : </span>
                                            <span style="color:blue"> {{ info.status }}</span>
                                            <br><br>
                                            <span class="lighten">
                                                <span style="color:blue;font-weight:bold">DATABASE : </span>
                                                <span style="color:blue;" v-html="info.details.db.status"></span>
                                                <br>
                                                <span style="color:blue;font-weight:bold">DATABASE NAME : </span>
                                                <span style="color:blue;"
                                                      v-html="info.details.db.details.database"></span>
                                                <br><br>
                                                <span style="color:blue;font-weight:bold">DISK SPACE </span>
                                                <div v-for="(item, index) in info.details.diskSpace.details">
                                                    <span style="color:blue;">
                                                        <span style="color:blue;font-weight:bold">
                                                            {{index}}</span>: {{computeData(item)}} Mbyte</span>

                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                </section>

                            </v-container>
                        </v-card-title>

                        <v-card-text>

                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-layout>
    </v-app>
</template>

<script>
    import CrudTable from '@/components/CrudTable'
    import lodash from 'lodash';
    import axios from "axios"
    import {defaultPolymer, polymerDescription} from "@/models/polymer";
    import {defaultUser, usersDescription} from "@/models/users";

    export default {
        name: 'Panel',
        components: {
            CrudTable
        },
        data() {
            return {
                info: null,
                loading: true,
                errored: false,
                drawer: null,
                currentTableName: null,
                tables: {
                    'UserTable': {
                        tableName: 'Пользователи',
                        tableNameRus: 'Пользователя',
                        crudURL: 'users',
                        itemsDescription: lodash.cloneDeep(usersDescription),
                        defaultItem: lodash.cloneDeep(defaultUser),
                        filterName: 'userName',
                        create: true,
                        headers: [
                            {text: 'id', value: 'id'},
                            {text: 'Имя', value: 'firstName'},
                            {text: 'Фамилия', value: 'lastName'},
                            {text: 'Email', value: 'email'},
                            {text: 'Логин', value: 'userName'},
                            {text: 'Роли', value: 'roles'},
                        ],
                        filterNameRus: 'логину'
                    },
                    'PolymerTable': {
                        tableNameRus: 'Полимер',
                        tableName: 'Полимеры',
                        crudURL: 'polymers',
                        itemsDescription: lodash.cloneDeep(polymerDescription),
                        defaultItem: lodash.cloneDeep(defaultPolymer),
                        filterName: 'fullName',
                        create: true,
                        headers: [
                            {text: 'id', value: 'id'},
                            {text: 'Название', value: 'fullName'},
                            {text: 'Код', value: 'shortName'},
                            {text: 'CAS', value: 'casNumber'},
                        ],
                        filterNameRus: 'названию',
                    },
                },
                items: [
                    {
                        title: 'Пользователи',
                        table: 'UserTable',
                    },
                    {
                        title: 'Полимеры',
                        table: 'PolymerTable',
                    },
                ],
            }
        },
        methods: {
            setCurrentTable(tableName) {
                this.drawer = !this.drawer;
                this.currentTableName = tableName;
            },
            loadData() {
                axios
                    .get('https://test-spring-boom.herokuapp.com/actuator/health')
                    .then(response => {
                        this.info = response.data;
                    })
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    })
                    .finally(() => (this.loading = false));
            },
            computeData(value) {
                value = value / 1024 / 1024;
                return value.toFixed(0);
            }
        },
        computed: {
            currentTable() {
                return this.currentTableName ? this.tables[this.currentTableName] : null
            },
            table() {
                return this.currentTableName ? CrudTable : null
            }
        },
        mounted() {
            this.loadData();
            setInterval(function () {
                this.loadData();
            }.bind(this), 7000);
        }
    }
</script>
