import App from './App'
import './styles/global.scss';
// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
//引入公共样式
import './styles/global.css';
// 导入 vuex 实例
import store from './store';
//注册过滤器的最佳实践
import * as filters from './filters';
//拿到filter所有的key值 组成数组 再进行遍历
Object.keys(filters).forEach((key)=>{
	Vue.filter(key,filter[key]);
});
const app = new Vue({
    ...App
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif

//关于写在 pages.json中的“subPackges”数组 里面存着分包对象
//分包的好处：
//1、优化小程序首次启动下载的时间
//2、在多人协作开发之后 可以更好的解藕协作
/*
如何进行分包：
1、打开pages.json新建subPackgees节点
2、节点中每一个对象为一个分包，其中
 2.1root分包包名
 2.2name分包别名
 2.3pages分包下的页面
  2.3.1分包下面的页面路径
  2.3.2页面的样式
*/