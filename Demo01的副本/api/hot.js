//api文件夹专门放置一些关于网络请求的方法
//热搜.js专门放置与热搜相关的一些接口
import request from '../utils/request.js';
//封装好一个请求方法
//热搜文章类型
export function getHotTabs(){
	return request({
		url:'/hot/tabs'
		});
}
//热搜文章列表
//封装成为一个接口 需要传入当前tab的id数据
export function getHotListFromTabType(type){
	return request({
		url:'/hot/list',
		data:{type}
	});
}
