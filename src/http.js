import router from "./router"
import store from "./store"
import axios from "axios"

const HTTP = axios.create({
    baseURL: "https://klekner-server-find-polymer.herokuapp.com/",
    //baseURL: "http://127.0.0.1:8080/",
});

HTTP.interceptors.request.use(config => {
    // Используется для подстановки токена аутентификации в каждый запрос
    if (config.url.indexOf('oauth/token') === -1) {
        //config.url += `?access_token=${store.getters.accessToken}`;
    }
    console.debug(config.url);
    return config
});

HTTP.interceptors.response.use(response => {
    return response
}, error => {
    // Используется для поимки 500 и 0 ошибки сервера
    if (error.request.status === 500 || error.request.status === 0) {
        store.dispatch('setServerError', error.request)
    }
    // Используется для авто-обновления токенов по истечению
    if (error.request.responseURL.indexOf('oauth/token') === -1 && error.request.status === 401) {
        console.debug('Check auth error, try auto-refresh');
        if (store.state.refreshToken) {
            const formData = new FormData();
            formData.set('grant_type', 'refresh_token');
            formData.set('refresh_token', store.getters.refreshToken);
            return HTTP.post(
                'oauth/token'
            ).then(response => {
                console.debug("New tokens received, set to vuex");
                store.commit('setTokensInfo', response.data);
                return new Promise(resolver => {
                    resolver()
                }).then(a => {
                    console.debug("Try resend request");
                    return HTTP(error.config);
                })
            }).catch(error => {
                if (error.request && error.request.status === 401) {
                    console.debug("Refresh token is expired, clear data and route to login page");
                    store.commit('clearUserData');
                    router.push({name: 'login'});
                } else {
                    return Promise.reject(error);
                }
            })

        } else {
            console.debug("Refresh token isn't set, route to login page");
            router.push({name: 'login'});
        }

    } else {
        return Promise.reject(error);
    }
});


HTTP.defaults.headers.post['Content-Type'] = 'application/json';
HTTP.defaults.headers.patch['Content-Type'] = 'application/json';
HTTP.defaults.headers.put['Content-Type'] = 'application/json';
HTTP.defaults.headers.get['Content-Type'] = 'application/json';
HTTP.defaults.headers.delete['Content-Type'] = 'application/json';

export default HTTP;
