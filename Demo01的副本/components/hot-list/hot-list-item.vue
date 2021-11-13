<template>
	<view class="item-container" @click="$emit('click')">
		<view class="item-box">
			<!--左侧索引栏-->
			<view class="item-box-left">
				<hot-ranking :ranking="ranking"></hot-ranking>
			</view>
			<!--右侧-->
			<view class="item-box-right">
				<!--标题-->
				<view class="item-title">{{data.title}}</view>
				<!--简介-->
				<view class="item-desc">{{data.desc}}</view>
				<view class="item-bottom-box">
					<!--作者-->
					<text class="item-author">{{data.nickname}}</text>
					<!--热度-->
					<view class="hot-box">
						<image src="" mode="" class="hot-icon"></image>
						<text class="hot-text">{{data.views｜hotNumber}}热度</text>
					</view>
					
				</view>
				
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		props:{
			data:{
				type:Object,
				//表示该数据为必传的一个数据
				required:true
			},
			//排名
			ranking:{
				type:Number,
				required:true
			}
		},
		name:"hot-list",
		data() {
			return {
				
			};
		},
		
	}
</script>

<style lang="scss" scoped>
	.item-container{
		padding-bottom:$uni-spacing-col-lg ;
		.item-box{
			//横向布局
			//border边界
			//margin外边距
			//padding内边距 即距离元素的边距
			display: flex;
			margin: 0 $uni-spacing-row-base;
			padding:$uni-spacing-row-lg $uni-spacing-col-base;
			background-color:$uni-bg-color;
			border-radius:$uni-border-radius-lg;
			box-shadow: 2px 2px 5px 1px rgba(143,143,143,0.1);
			.item-box-left{
				margin-left:$uni-spacing-row-sm;
				
			}
			.item-box-right{
				width:100%;
				.item-title{
				font-size:$uni-font-size-lg;
				font-weight:bold;
				color:#000;
				}
				.item-desc{
					padding-top:$uni-spacing-col-sm;
					font-size:$uni-font-size-base;
					color:$uni-text-color;
				}
				.item-bottom-box{
					margin-top:$uni-spacing-col-sm;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.item-author{
						font-size:$uni-font-size-sm;
						color:$uni-text-color-grey;
					}
					.hot-box{
						.hot-icon{
							width:$uni-img-size-sm;
							height:$uni-img-size-sm;
							vertical-align: top;
						}
						.hot-text{
							//距离图片要有一定的距离
							margin-left:$uni-spacing-row-sm;
							font-size:$uni-font-size-sm;
							color:$uni-text-color-hot;
						}
					}
				}
			}
		}
	}
</style>
