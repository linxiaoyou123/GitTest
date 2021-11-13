//封装请求对象
//本机域名地址
const BASE_URL='';
//希望请求遵循promise的一个请求方案
//相当于传进来一个对象 而这个对象包含了要请求的url和data
//这里写一个通用的对象 在hot.js中再封装方法getHotTabs
function request({url,data,method}){
	return new Promise((resolve,reject)=>{
		//进行uni-app的网络请求
		//用uni.request这样子的一个方法来发起网络请求
		uni.request({
			url:BASE_URL+url,
			data,
			method,
			header:{
				Accept:''
			},
			method:'GET',
			//如果成功就返回对象{data,statusCode,header}
			//箭头函数 确保this指向的是父级对象
			success:({data,statusCode,header})=>{
				if(data.success){
					//请求成功 如果data.success不为空
					resolve(data);
					//把数据暴露出去
				}else{
					//请求失败
					//给用户一个提示 通过配置对象 显示失败的提示
					uni.showToast({
						title:data.message,
						icon:'none',
						mask:true,
						duration:3000
					})
					//对请求失败进行处理
					reject(data.message);
				}
			},
			fail:(error)=>{
				reject(error);
			}
		});
	});
}