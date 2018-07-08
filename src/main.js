// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'

//如果是导入带有名字的导出组件 必须使用{}
import  {currency} from './util/currency'
Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.filter("currency",currency);
Vue.use(VueLazyLoad,{
  loading:"/static/loading-svg/loading-bars.svg"
});
Vue.use(infiniteScroll);
/* eslint-disable no-new */

//vue-x
const store=new Vuex.Store({
  state:{
    nickName:'',
    cartCount:0
  },
  mutations:{
    updateUserInfo(state,nickName){
      state.nickName=nickName;
    },
    updateCartCount(state,cartCount){
      state.cartCount+=cartCount;
    },
    initCartCount(state,cartCount){
      state.cartCount=cartCount;
    }
  }
});

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
