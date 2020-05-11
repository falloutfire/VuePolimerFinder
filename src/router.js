import Router from 'vue-router'
import Vue from "vue";
import store from './store'
import HTTP from './http';

Vue.use(Router)


// TODO read about router
export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('./components/Login.vue')
        },
        {
            path: '/',
            name: 'root',
            redirect: () => {
                if (store.state.refreshToken) {
                    const formData = new FormData();
                    formData.set('grant_type', 'refresh_token');
                    formData.set('refresh_token', store.getters.refreshToken);
                    return HTTP.post(
                        'oauth/token'
                    ).then(response => {
                        console.debug("New tokens received, set to vuex");
                        store.commit('setTokensInfo', response.data);
                        return { name: 'panel' };
                    }).catch(error => {
                        if (error.request && error.request.status === 401) {
                            console.debug("Refresh token is expired, clear data and route to login page");
                            store.commit('clearUserData');
                            return { name: 'login' }
                        } else {
                            return { name: 'login' }
                        }
                    })

                } else {
                    console.debug("Refresh token isn't set, route to login page");
                    return { name: 'login' };
                }
            },

        },
        {
            path: "/admin",
            name: "panel",
            component: () => import('./components/Panel.vue')
        },
        {
            path: '*',
            name: "not_found",
            component: () => import('./components/NotFound.vue')
        }
    ]
})

