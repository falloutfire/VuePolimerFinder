<template>
    <v-app id="app">
        <!--<v-content>-->
            <!--<v-container fluid fill-height>-->
                <router-view name="asd"></router-view>
            <!--</v-container>-->
        <!--</v-content>-->
    </v-app>
</template>

<script>
    export default {
        beforeCreate() {
            // TODO разобратсья
            this.$store.dispatch('restoreFromLocalStorage')
        }
    }
</script>

<style>

</style>
