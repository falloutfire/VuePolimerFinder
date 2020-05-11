<template>
    <v-layout align-center justify-center row style="background: #1976D2;">
        <v-flex xs-12 md6 lg4>
            <v-hover>
                <v-card
                        slot-scope="{ hover }"
                        :class="`elevation-${hover ? 12 : 2}`">
                    <v-card-title primary-title>
                        <v-layout row wrap justify-center>
                            <span class="headline text-uppercase">404 PAGE NOT FOUND</span>
                        </v-layout>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap justify-center >
                            <v-flex xs10 text-xs-center>
                                <v-btn color="primary" @click="() => $router.push({name: 'panel'})">
                                    BACK TO HOME
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-hover>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: "NotFound"
    }
</script>

<style scoped>

</style>
