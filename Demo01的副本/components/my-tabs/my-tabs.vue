<template>
	<view class="my-tab-container">
	<!--
	希望my-tabs是一个通用的组件--造轮子
	1、可以在父组件中定制样式
	2、可以在父组件中指定数据
	3、在父组件中指定选中项
	-->	
	<view class="my-tab-box">
		<!--在滚动条使用动画过渡scroll-with-animation-->
		<scroll-view scroll-x="true" class="scroll-view" scroll-with-animation :scroll-left="scrollLeft" id="_scroll">
			<view class="scroll-content">
				<view class="tab-item-box" >
					<!--对于for循环
					uni-app遵循vue的v-for指令
					在括号里面指定咱们的变量名和下标名
					通过：key来绑定一个key值
					v-for="(item,index)in arr":key=“index”
					-->
					<block v-for="(item,index)in tabList":key="index">
						<view :id="_tab_+index" 
							class="tab-item" 
							:class="{'tab-item-active':activeIndex===index}" 
							@click="onTabClick(index)"
							:style="{
								clolor:activeIndex===index?defaultConfig.activeColor:defaultConfig.textColor}"
							>
							{{item.label || item}}
						</view>
					</block>
				</view>
				
				<!--滑块-->
				<view 
				class="underLine" 
				:style="{
					transform:'translateX('+slider.left+'px)',
					width:defaultConfig.underLineWidth+'px',
					height:defaultConfig.underLineHeight+'px',
					color:defaultConfig.underLineColor
				}">
				</view>
			</view>
		</scroll-view>
</template>

<script>
	export default {
		name:"my-tabs",
		props:{
			//父组件向子组件传递数据 要使用props 同时利用watch进行监听
			//1、可以在父组件中定制样式
			//指定一个配置对象
			//如果是复杂数据类型，那么需要指定value为一个函数，通过返回值的形式指定默认值
			config:{
				type:Object,
				default:()=>{
					return{};
				}
			//2、可以在父组件中指定数据
			},
			tabData:{
				type:Array,
				default:()=>{
					return{};
				}
			},
			//3、在父组件中指定选中项
			//父组件中传递的数据 我们不应该在子组件中进行修改 比如defaultIndex
			defaultIndex:{
				type:number,
				default:0
			}
		},
		data() {
			return {
				//内部维护的数据对象，为每个item单独维护一个slider滑块对象
				tabList:[],
				//当前激活项的index
				//用于代替defaultIndex
				activeIndex:-1,
				//在data中声明滑块的一个对象
				//想要实现滑块的一个滚动效果 有两个要点很重要
				//1、确定滑块滚动的时机-->点击tap时
				//2、计算滑块滚动的距离
				slider:{
					//包含滑块距离左侧的一个距离
					//默认情况下为0就可以
					left:0
					
				},
				//scrollView的横向滚动条的位置
				scrollLeft:0,
				//默认配置
				defaultConfig:{
					//默认的字体颜色
					textColor:'#333333',
					//高亮的字体颜色
					activeColor:'#f94d2a',
					//定义下划线的宽度and高度and颜色
					underLineWidth:24,
					underLineHeight:2,
					underLineColor:'#f94d2a'
				}
			};
		},
		//利用watch监听器 来监听defaultIndex的变化
		watch:{
			//监听tabData的一个变化
			//当tabData发生变化时 发生的回调
			tabData:{
				handler(val){
					//此时tabData中的数据就已经和tabList同步了
					this.tabList=val;
					//想维护tabList中的每个item为DOM渲染完成之后去执行
					//在uni-app中可以使用 setTimeout
					setTimeout(()=>{
						this.updateTabWidth();
					},0);
				},
				//表示当前的handler将会在监听开始之后立即被调用
				immediate:true
			},
			//监听激活项的变化
			//defaultIndex是一个对象 其中我们去指定两个属性
			defaultIndex:{
				//该方法表示 当defaultIndex发生变化时 回调的函数
				//监听时会传递过来最新的值 我们将这个最新的值val赋值给activeIndex
				handler(val){
					this.activeIndex=val;
					//重新计算滑块的位置
					this.tabToIndex();
				}
				//表示当前的handler将会在监听开始之后立即被调用
				immediate:true,
				
			},
			//监听config的变化
			config:{
				handler(val){
					//解构
					//把传过来的config覆盖给defaulConfig中相同的属性 得到最新的defaultConfig的值
					this.defaultConfig={...this.defaultConfig,...val};
				},
				//表示当前的handler将会在监听开始之后立即被调用
				immediate:true
			}
		},
		//tab-Item的点击事件 当点击tab时就会触发
		methods:{
			onTabClick(index){
				this.activeIndex=index;
				//发送一个通知 表示激活项发生变化了
				this.$emit('tabClick',index);
			},
			updateTabWidth(){
				//tabIem的宽度 tabIem的left 为tabList每个item维护一个slider对象
				let data=this.tabList;
				if(data.length===0){
					return false;
				}
				//uni-app拿到渲染之后的dom
				//获取dom的固定写法
				const query=uni.createSelectorQuery().in(this);
				//循环数据源
				data.forEach((item,index)=>{
					//获取dom的固定写法
					query.select('#_tab_'+index)
					//res就是拿到的dom
					.boundingClientRect((res)=>{
						//打印了每一个tab-item对象出来
						console.log(res);
						//为数据对象每个item都一个_slider滚动条对象
						item._slider={
							left:res.left+(res.width-this.defaultConfig.underLineWidth)/2
						};
						if(data.length-1===index){
							this.tabToIndex();
						}
					})
					.exec();
				})
			},
			//再定义一个函数 用于计算滑块滚动的位置
			//根据当前的activeindex来计算滑块的滚动距离
			tabToIndex(){
				if(this.tabList.length===0){
					return;
				}
				//获取当前的activrIndex
				const activeIndex=this.activeIndex;
				//滑块的宽度
				const underLineWidth=this.defaultConfig.underLineWidth;
				//配置滚动条的left
				//须知：tabitem的宽度
				//拿到tabitemleft
				//还有slider的宽度
				this.slider={
					left:this.tabList[index]._slider.left
				}
				//在滑块滚动完成之后 控制scrollview进行横向的滚动
				this.scrollLeft=this.activeIndex*this.defaultConfig.underLineWidth;
			}
			
		}
		
	}
</script>

<style lang="scss" scoped>
	.my-tab-container{
		font-size: 14px;
		height: 45px;
		line-height: 45px;
		width:100%
		background-color:$uni-bg-color;
		.my-tab-box{
			height:45px;
			width:100%;
			display: flex;
			position:relative;
			.scroll-view{
				//不换行去展示
				white-space: nowrap;
				height: 100%;
				width:100%;
				position: relative;
				box-sizing: border-box ;
				.scroll-content{
					height: 100%;
					width:100%;
					position: relative;
					.tab-item-box{
						height: 100%;
						.tab-item{
							height:100%;
							display:inline-block;
							text-align:center;
							padding:0 15px;
							position: relative;
							color: $uni-text-color;
						}
						.tab-item-active{
							color:$uni-text-color-hot;
						}
					}
					.underLine{
						height: 2px;
						width:24px;
						background-color:$uni-text-color-hot ;
						border-radius: 3px;
						transition: 0.5s;
						position: absolute;
						bottom:0;
					}
				}
			}
		}
		
	}
</style>
