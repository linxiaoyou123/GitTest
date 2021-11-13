<template>
	<view class="search-history-container">
		<view class="search-history-title-box">
			<text class="search-history-title">搜索历史</text>
			<view v-if="!isShowClear">
				<uni-icons type="trash" class="trash"></uni-icons>
			</view>
			<view v-else>
				<text class="txt" >全部删除</text>
				<text class="txt" @click="isShowClear=false">完成</text>
			</view>
		</view>
		<view class="search-history-box">
			<block v-for="(item,index)in SearchData" :key="index">
				<view class="search-history-item">
					<!--注意只展示一行-->
					<text class="history-txt line-clamp">{{item}}</text>
					<!--当isShowClear成立时 会显示后面的叉叉-->
					<uni-icons
					v-show="isShowClear"
					type="clear"
					></uni-icons>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	props:{
		
	},
	export default {
		name:"search-history",
		props:{
			
		},
		data() {
			return {
				isShowClear:false,
				
			};
		}
	}
</script>

<style lang="scss" scroped>
	.search-history-container {
	  padding: $uni-spacing-col-lg $uni-spacing-row-lg;
	  .search-history-title-box {
	    display: flex;
	    justify-content: space-between;
	
	    .search-history-title {
	      font-size: $uni-font-size-sm;
	      color: $uni-text-color;
	      padding: $uni-spacing-col-sm $uni-spacing-row-sm;
	    }
	    .txt {
	      color: $uni-text-color-grey;
	      font-size: $uni-font-size-sm;
	      padding: $uni-spacing-col-sm $uni-spacing-row-sm;
	    }
	  }
	  .search-history-box {
	    margin-top: $uni-spacing-col-lg;
	    .search-history-item {
	      width: 50%;
	      box-sizing: border-box;
	      display: inline-block;
	      padding: $uni-spacing-col-base $uni-spacing-row-base;
	      position: relative;
	      .history-txt {
	        width: 95%;
	        display: inline-block;
	        color: $uni-text-color;
	        font-size: $uni-font-size-base;
	      }
	    }
		//伪类选择器打造分割的竖线
	    .search-history-item:nth-child(odd):before {
	      content: ' ';
	      border-left: 1px solid #999;
	      display: inline-block;
	      height: 10px;
	      position: absolute;
	      top: 50%;
	      transform: translateY(-50%);
	      right: 0;
	    }
	  }
	}
</style>
