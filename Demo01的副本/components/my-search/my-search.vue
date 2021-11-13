<template>
	<view class="my-search-container">
		<!--搜索输入框 在网上导入插件-->
		<uni-search-bar
			v-if="isShowInput"
			class="my-search-bar"
			:radius="100"
			@confirm="onSearch"
			@focus="onFocus"
			@blur="onBlur"
			@clear="onClear"
			@cancel="onCancel"
			@input="onInput"
			:bgColor="config.backgroundColor"
			:placeholder="placeholderText"
			:value="value"
		></uni-search-bar>
		<!-- 搜索按钮 -->
		<uni-icons slot="clearIcon" type="clear" color="#999999" v-else/>
		
		
		<!--
		mysearch组件应该具备的作用
		1、具备输入框的样式
		2、不可输入
		3、placeholder内容可以在父组件中定义
		-->
		<view class="my-search-box">
			<!--搜索图标-->
			<image src="@/static/images/search.png" mode="" class="icon"></image>
			<!--搜索文本-->
			<text class="placeholder">{{placeholderText}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-search",
		//在子组件定义 相当于小程序中的properties
		props:{
			// 是否显示输入框
			isShowInput: {
			  type: Boolean,
			  default: false
			},
			//接收传递过来的值
			placeholderText:{
				type:String,
				default:'搜索'
			},
			// 输入的内容
			//search-bar不能使用v-model 因为直接使用v-model会修改父组件传递过来的数据
			// value 名称不可修改，与 $emit('input') 事件对应
			value: {
			  type: String
			},
			// 配置对象
			config: {
			  type: Object,
			  default: () => ({
			    height: 36,
			    backgroundColor: '#ffffff',
			    icon: '/static/images/search.png',
			    textColor: '#454545',
			    border: '1px solid #c9c9c9'
			  })
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			/*
			    点击搜索按钮触发
				触发的同时也将值的内容传递出去
				在父组件中用@事件的方式进行监听
			   */
			  onSearch() {
			    this.$emit('search', this.value);
			  },
			  /*
			   输入框获取焦点触发
			   */
			  onFocus() {
			    this.$emit('focus', this.value);
			  },
			  /*
			    输入框失去焦点触发
			   */
			  onBlur() {
			    this.$emit('blur', this.value);
			  },
			  /*
			    点击输入框中的清空按钮时
			   */
			  onClear() {
			    this.$emit('clear', this.value);
			  },
			  /*
			    点击取消按钮时
			   */
			  onCancel() {
			    this.$emit('cancel', this.value);
			  },
			  /*
			   value 改变时触发事件
			   */
			  onInput(val) {
			    // input 的事件名称不可修改，与 props 中的 value 对应
			    // 当同时存在：
			    // props -> value
			    // $emit('input', val)
			    // 时，在组件外可以使用 v-model 完成双向数据绑定。
			    // 即：用户输入内容时，父组件传递过来的 value 同步发生变化
			    // 要进行双向数据的绑定 必须遵循以下规则
				//1、子组件中接收到的值必须以value命名
				//2、子组件中想修改value时  必须发送一个名叫input的事件
				//3、满足以上两点 在父组件中绑定的v-model获得的值 将会赋值到这里的value
			    //将传递过来的值通知父组件
				this.$emit('input', val);
			  }
			}
		
	};
</script>

<style lang="scss" scoped>
.my-search-container{
	display: flex;//使用flex布局
	align-items: center;//在交叉轴上都进行一个居中的展示
	.my-search-box{
		height: 36px;
		background-color: $uni-bg-color;
		border-radius: 15px;
		border:1px solid $uni-bg-color-grey;
		width: 100%;
		display: flex;
		align-items: center;
		//上下 左右
		padding: 0 $uni-spacing-row-base;
		.icon{
			width: $uni-img-size-sm;
			height: $uni-img-size-sm;
		}
		.placehoder{
			font-size:$uni-font-size-sm;
			margin-left: $uni-spacing-row-sm;
			color:$uni-text-color-grey ;
		}

	}
}
</style>
