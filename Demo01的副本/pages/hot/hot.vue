<template>
	<view class="hot-container">
	<!--template作用:定义当前页面的结构 相当于wxml-->
	<!--@符号相当于找到当前项目的根目录 aspectFit使得图片不会有拉伸效果-->
		<image src="@/static/images/logo.png" class="logo" mode="aspectFit"/>
	<!--可直接使用组件 无需注册-->
		<view class="my-search-container" @click="onToSearch">
			<my-search placeholderText="uni-app 自定义组件"></my-search>
			
			<!--uni-app中父向子传递数据 遵循vue v-bind指令-->
			<!--把tabData数组传过去给子组件-->
			<!--若子组件想向父组件传递数据 通过@监听事件-->
			<my-tabs 
					@tabClick="onTabClick"
					:tabData="tabData" 
					:defaultIndex="currentIndex"
					:config="{
						//传一个对象给子组件
						//在这里面可以更改默认的子组件的字体颜色和激活字体的颜色
					}"
				   class="tab-sticky"
			 ></my-tabs>
		
		</view>
		<!--list的一个视图
			1、使用mock数据--假数据 构建List的基本结构
			2、美化样式
			3、根据tab的切换来获取真实数据
			4、渲染真实数据
			5、让list具备左右切换的能力
				5.1 思考如何让list具有左右切换的能力
				使用swiper对其进行改造
				5.2 list的列表高度出现了问题
				//原因：由于没有指定 swiper的高度
				//解决方案：计算出每个item的高度 然后叠加到一起 就可以得到swiper高度
				5.3 切换tab时 list的卡顿问题
				//原因：swiper动画为完成时，就获取数据，渲染dom
				//解决方案：swiper动画完成之后 再去获取数据 渲染dom
			6、完成list与tabs联动的能力
				6.1 tabs切换时 swiper联动切换
				6.2 swiper切换时 tabs并没有联动切换
		-->
		<!--补充功能
			1、tabs具有吸顶的功能
			2、控制页面滚动位置--类似于当页面开始吸顶时 滑动tabs时 页面有一个置顶的功能
				2.1当用户滚动页面之后
				2.2切换tabs时 让页面滚动的位置返回为tabs吸顶的位置
			3、热度显示的问题
				3.1可以使用过滤器
		-->
		<!--current属性 绑定数据currentIndex-->
		<swiper class="swiper" 
		:current="currentIndex"
		:style="{height:'currentSwiperHeight'}" 
		@animationfinish="onSwiperEnd"
		@change="onSwiperChange"
		>
		
			<!--swiperItem的数量 需要由tabData进行决定-->
			<swiper-item v-for="(tabItem,tabIndex) in tabData":key="tabIndex" >
				<view >
					<!--加载动画-->
					<uni-load-more status="loading" v-if="isLoading" />
					<!--列表-->
					<block v-else>
						<hot-list-item 
						v-for="(item,index) in listData[tabIndex]":key="index"
						:class="'hot-list-item-'+tabIndex"
						:key="index"
						:data="item"
						:ranking="index+1"
						></hot-list-item>
						
					</block>
				</view>
			</swiper-item>
		</swiper>
			
	</view>
</template>

<script>
	import my-search from '../../components/my-search/my-search.vue';
	//将../../api/hot.js中的方法导入到这里
	import {getHotTabs,getHotListFromTabType} from'../../api/hot.js';
	//定义当前页面的逻辑--> 相当于之前的js文件
	export default {
		data() {
			return {
				//tab组件的一个数据源
				tabData:[],
				//添加一个激活项
				currentIndex:0,
				//展示loading，默认情况下为true
				isLoading:true,
				//通过listData这个对象来缓存我们所有得到的数据
				//以index为key 以list为value
				listData:{},
				//当前swiper的高度
				currentSwiperHeight:0,
				//缓存高度的计算结果 以index为key 对应的高度为value
				swiperHeightData:{},
				//当前的滚动距离
				currentPageScrollTop:0
			}
		},
		//created方法的生命周期：组件实现配置完成 但DOM未渲染 此时进行网络请求 配置响应式数据
		created() {
			this.loadHotTabs();
		},
		//在页面渲染的时候就调用getHotTaps方法
		
		//可以采用回调事件来获取currentPageScrollTop
		onPageScroll(res){
			console.log(res);
			this.currentPageScrollTop=res.scrollTop;
		}
		//注意在uni-app中 所有的方法只能被定义到methods中
		//请求服务器获取到的数据 传入到data()中
		methods:{
			//获取热搜标题数据
			async loadHotTabs(){
				//调用接口
				const res=await getHotTabs();
				console.log(res);
				this.tabData=res.data.list;
				//因为 当我们获取list数据时 需要tab中对应的id
			},
			//获取列表数据
			async loadHotListFromTab(){
				//调用一个接口
				//1、如果没有获取到数据
				if(!this.listData[this.currentIndex]){
					//1.1展示对应的loading 
					
					//1.2获取数据
					const id=this.tabData[this.currentIndex].id;
					const {data:res}=await getHotListFromTabType(id);
					//1.3调用接口获取数据 把数据保存到本地（有了缓存）
					this.listData[this.currentIndex].list=res.list;
					//1.4隐藏loading
					this.isLoading=false;
					setTimeout(asycn ()=>{
						//获取当前swiper的高
						this.currentSwiperHeight=this.getCurrentSwiperHeight();
						//放入缓存
						this.swiperHeightData[this.currentIndex]=this.currentIndex;
					},0);
				}else{
					//当前获取到数据
				}
				//2、已经获取到数据
				//2.1直接渲染数据即可
				
			},
			//tab点击事件
			//接收到子组件传递过来的index
			onTabClick(index){
				this.currentIndex=index;
				this.loadHotListFromTab();
			},
			//跳转到搜索页面 跳转到search-blog
			onToSearch(){
				uni.navigateTo({
					url:'/subpkg/pages/search-blog/search-blog'
				})
			},
			//计算当前swiper高度的一个方法
			getCurrentSwiperHeight(){
				//1、拿到所有的item-->异步
				return new Promise((resolve,reject)=>{
					let sum=0;
					const query=uni.createSelectorQuery().in(this);
					query
					//拿到所有的dom对象
					//固定的写法
						.selectAll(`hot-list-item-${this.currentIndex}`)
						.boundingClientRect((res)=>{
							console.log(res);
							//2、拿到所有item的高度
							res.forEach((item)=>{
								//3、把所有的高度累加
								sum+=item;
							});
							resolve(sum);
						})
						.exec();
				});
				
				
				
			},
			//swiper动画完成
			onSwiperEnd(){
				//判断缓存是否存在，不存在再去获取数据
				if(!this.listData[this.currentIndex]){
					this.loadHotListFromTab();
					return;
				}
				//为return 则说明存在数据缓存 存在数据缓存 则同时存在height的缓存数据
				this.currentSwiperHeight=swiperHeightData[this.currentIndex];
			},
			//swiper切换
			onSwiperChange(e){
				//开始吸顶的一个位置
				if(this.currentPageScrollTop>130){
					//控制列表的滚动位置
					uni.pageScrollTo({
						scrollTop:130
					})
				}
				console.log(e);
				this.currentIndex=e.detail.current;
			}
			
		},
		components:{
			my-search
		}
		
	}
</script>

<style lang="scss" scoped>
//scoped表示当前文件的样式只在当前组件中生效-->样式的隔离性
//定义当前页面的样式--> 相当于wxss
.hot-container{
	/* 背景颜色 */
	background-color: $uni-bg-color;
	//按照级别关系来写样式选择器
	.logo{
		width:100%;
		height: 80px;
	}
	.my-search-container{
		//用于使得该搜索框始终和左右两边保持一定距离
		padding: 0 16px;
		margin-bottom:$uni-spacing-col-base ;
	}
	//吸顶效果
	.tab-sticky{
		position: sticky;
		z-index: 99;
		top:0;
	}
}


</style>
