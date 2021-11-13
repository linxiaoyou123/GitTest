<template>
	
	<view class="search-blog-container">
		<!--v-model可以与子组件的数据进行双向绑定 获得的值将会赋值给子组件的value-->
		<view class="search-bar-box">
			<my-search 
			:isShowInput="true"
			:placeholderText="defaultText"
			v-model="searchVal"
			:config="{
				backgroundColor:'#d1f0f3'
			}"
			@search="onSearchConfirm"
			@focus="onSearchFocus"
			@blur="onSearchBlur"
			@clear="onSearchClear"
			@cancel="onSearchCancel"
			></my-search>
			<!--注意标签不能访问没有在data中定义的数据 -->
			<!-- 热搜列表 -->
			<view class="search-hot-list-box card" v-if="showType === HOT_LIST">
			  <!-- 列表 -->
			  <search-hot-list @onSearch="onSearchConfirm" />
			</view>
			
			<!-- 搜索历史 -->
			<view class="search-history-box" v-else-if="showType === SEARCH_HISTORY">
			  <search-history @onItemClick="onSearchConfirm" />
			</view>
			
			<!-- 搜索结果 -->
			<view class="search-result-box" v-else>
			  <!-- 1. 给mescroll-body的组件添加: ref="mescrollItem" (固定的,不可改,与mescroll-comp.js对应)-->
			  <search-result-list ref="mescrollItem" :queryStr="searchVal" />
			</view>
			
		</view>
	</view>
</template>

<script>
	import{getDefaultText} from '../../../api/search.js';
	// 0: 热搜列表 - 默认
	const HOT_LIST = '0';
	// 1：搜索历史
	const SEARCH_HISTORY = '1';
	// 2：搜索结果
	const SEARCH_RESULT = '2';
	export default {
		data() {
			return {
				// 绑定输入框中的内容
				searchVal: '',
				// 默认的placeholderText
				/*
				1、默认情况下，点击了输入框的取消按钮时，显示【热搜列表】
				2、当searchBar获取焦点时 或者点击输入框清空按钮时 显示【搜索历史】
				3、用户点击热搜列表item或者用户点击搜索历史item或者用户按下搜索键 显示【搜索结果】
				*/
				defaultText: '默认的placeholderText',
				//默认展示热搜列表
				showType:HOT_LIST,
				//热搜列表
				HOT_LIST,
				//搜索历史
				SEARCH_HISTORY,
				//搜索结果
				SEARCH_RESULT,
				//搜索框输入内容
				searchData[]
			};
		},methods:{
			created() {
			  this.loadDefaultText();
			},
			/**
			 * 获取推荐搜索文本
			 */
			async loadDefaultText() {
			  const { data: res } = await getDefaultText();
			  this.defaultText = res.defaultText;
			},
			onSearchConfirm(val){
				//val存在就直接赋值给数据searchData如果不存在就直接使用推荐文本
				this.searchVal=val?val:this.defaultText;
				saveSearchData();
				if(this.searchVal){
					this.showType=SEARCH_RESULT;
				}
			},
			onSearchFocus(){
				this.showType=SEARCH_HISTORY;
			},
			onSearchBlur(){
				
			},
			onSearchClear(){
				this.showType=SEARCH_HISTORY;
			},
			onSearchCancel(){
				this.showType=HOT_LIST;
			},
			//保存搜索历史数据的方法
			saveSearchData(){
				//业务要求
				//1、如果当前的搜索内容已经存在 则原有的搜索内容需要被展示到搜索历史的头部 而不是新增一条搜索历史
				//1.1把已存在的搜索内容删除
				//1.2把新的搜索内容添加到头部
				//2、如果当前的搜索内容不存在 则会展示在搜索历史的头部
				const index=this.searchData.findIndex((item)=>{
					item===this.searchVal
				});
				if(index!=-1){
					this.searchData.splice(index,1);
				}
				this.searchData.unshift(this.searchVal);
			}
			
		}
	}
</script>

<style lang="scss" scoped>
.search-blog-container {
  .search-bar-box {
    background-color: $uni-bg-color;
    padding: $uni-spacing-row-sm;
	//有一个吸顶的效果
    position: sticky;
    top: 0px;
    z-index: 9;
  }
}
</style>
