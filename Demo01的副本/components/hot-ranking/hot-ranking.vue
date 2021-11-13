<template>
	<view class="ranking-container">
		<image :src="getRankingBg" class="ranking-bg"></image>
		<text :class="{'text-white':ranking<=3}" class="ranking-text">{{ranking}}</text>
	</view>
</template>

<script>
	export default {
		props:{
			ranking:{
				type:Number,
				required:true
			}
		},
		name:"hot-ranking",
		data() {
			return {
				
			};
		},
		//计算属性
		//当依赖值发生变化时 计算属性就会发生变化
		//每个计算属性都必须要有一个返回值
		computed:{
			getRankingBg(){
				if(this.ranking<=3){
					//使用require来导入我们的图片
					return require(`@/static/images/ranking-${this.ranking}.png`);
				}
				return require(`@/static/images/ranking-other.png`);
				
			}
		};
	}
</script>

<style lang="scss" scoped>
	.ranking-container{
		position:relative;
		text-align:center;
		width:18px;
		height:20px;
		.ranking-bg{
			width:100%;
			height:100%;
			
		}
		.ranking-text{
			position:absolute;
			left:50%;
			height:50%;
			transform:translate(-55%,-55%);
			font-size:$uni-font-size-sm;
			font-weight:bold;
			color:#333;
		}
		.text-white{
			color:#fff;
		}
	}
</style>
