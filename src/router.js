import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

// index: 框架页
const index = resolve => require(['./page/index.vue'],resolve);

const routes = [
    {
        path: '/',
        redirect: '/index'
    },
    {
        path: '/index',
        component: index,
        meta: {
            keepAlive: false
        }
    }
];
export default new Router({
	mode: 'history',
    routes
});