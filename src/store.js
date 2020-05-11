import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        accessToken: null,
        refreshToken: null,
        tokenType: null,
    },
    mutations: {
        setAccessToken(state, accessToken) {
            state.accessToken = accessToken
        },
        setRefreshToken(state, refreshToken) {
            state.refreshToken = refreshToken
        },
        setTokenType(state, tokenType) {
            state.tokenType = tokenType
        },
    },
    actions: {
        clearTokens({commit}) {
            commit('setAccessToken', null);
            commit('setRefreshToken', null);
            commit('setTokenType', null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('tokenType');
        },
        setTokensInfo({commit}, accessTokenInfo) {
            commit('setAccessToken', accessTokenInfo.access_token);
            commit('setRefreshToken', accessTokenInfo.refresh_token);
            commit('setTokenType', accessTokenInfo.token_type);
            localStorage.setItem('accessToken', accessTokenInfo.access_token);
            localStorage.setItem('refreshToken', accessTokenInfo.refresh_token);
            localStorage.setItem('tokenType', accessTokenInfo.token_type);
        },
        restoreFromLocalStorage({commit}) {
            commit('setAccessToken', localStorage.getItem('accessToken'));
            commit('setRefreshToken', localStorage.getItem('refreshToken'));
            commit('setTokenType', localStorage.getItem('tokenType'));
        },
        setServerError({commit}, error) {

        }
    },
    getters: {
        accessToken: state => {
            return state.accessToken;
        },
        refreshToken: state => {
            return state.refreshToken;
        },
        tokenType: state => {
            return state.tokenType;
        }
    }
})
