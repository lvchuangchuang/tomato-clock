<template>
	<view>
		<view class="Finish">
			<view class="Finish_Item" v-for="(item,index) in sum" :key="index">
				<view class="Finish_Item_Title">
					{{item.title}}
				</view>
				<view class="Finish_Item_val" > 
					{{item.val}}
				</view>
			</view>
		</view>
	
		<view class="detail">
			<view class="detail_title">
				<view class="detail_title_text">
					分类统计
				</view>
				<view class="detail_title_type">
					<text :class="cateActive===0 ? 'cate_active':'' " @click="changeTime" >今日数据</text>
					<text :class="cateActive===1 ? 'cate_active':'' " @click="changeTime">查看历史</text>
				</view>
			</view>
			
			<view class="detail_list" v-if="list.length > 0">
				<view class="list_title">
					<view class="list_title_date">完成时间</view>
					<view class="list_title_cate">完成类型</view>
					<view class="list_title_time">专注时长</view>
				</view>
				
				
				<view class="list_item"
				 v-for="(item,index) in list" :key="index">
					<view class="list_item_date">
						{{item.date}} 
					</view>
					<view class="list_item_cate">
						{{cateArr[item.cate].text}} 
					</view>
					<view class="list_item_time">
						{{item.time}}分钟
					</view>
			
				</view>
			</view>
			<view class="detail_list" v-if="list.length === 0">
				暂无数据
			</view>
			
		</view>
	</view>
</template>

<script>
	import util from '../../utils/util.js'
	const utils = require("../../utils/util.js")
export default {
	data() {
		return {
			logs: [],
			cateActive: 0,
			dayList:[],
			list:[],
			sum: [
				{
					title: '今日番茄次数',
					val: '0'
				},
				{
					title: '累积番茄次数',
					val: '0'
				},
				{
					title: '今日专注时长',
					val: '0分钟'
				},
				{
					title: '累积番茄时长',
					val: '0分钟'
				},
			],
			cateArr: [
				{
					icon: '../../static/images/work.png',
					text: '工作',
				},
				{
					icon: '../../static/images/study.png',
					text: '学习',
				},
				{
					icon: '../../static/images/think.png',
					text: '思考',
				},
				{
					icon: '../../static/images/write.png',
					text: '写作',
				},
				{
					icon: '../../static/images/sport.png',
					text: '运动',
				},
				{
					icon: '../../static/images/read.png',
					text: '阅读',
				}
			],
		}
	},
	
	methods: {
		changeTime(){
			if(this.cateActive === 1){
				console.log("现在是今日")
				this.list = this.dayList
				this.cateActive = 0
				// console.log(this.list)
			}
			else if(this.cateActive === 0){
				var logs = uni.getStorageSync('logs') || []
				this.list = logs
				console.log("现在是历史")
				this.cateActive = 1
				// console.log(this.list)
			}
			
		},
	},
	
	onPullDownRefresh() {
		
		setTimeout(() => {
			this.$forceUpdate()
			console.log("强制更新完成")
			uni.stopPullDownRefresh();
		}, 1000)
	},
	onShow() {
		
	},
	onReady() {
	},
	onLoad() {
		var logs = uni.getStorageSync('logs') || []
		var day = 0
		var total =  logs.length
		var dayTime = 0
		var totalTime = 0
		var dayList = []
		 if(logs.length > 0){
			 for(var i = 0; i < logs.length; i++){
				if(logs[i].date.substr(0,10) == utils.formatTime(new Date).substr(0,10)){
					 day = day + 1
					 dayTime = dayTime + parseInt(logs[i].time)
					 dayList.push(logs[i])
					 this.dayList = dayList
					 this.list = this.dayList
				}
				totalTime = totalTime + parseInt(logs[i].time)
			 }
			 
			 this.sum[0].val = day  // 今日次数
			 this.sum[1].val = total // 累计次数
			 this.sum[2].val = dayTime + '分钟'  // 今日时长
			 this.sum[3].val = totalTime + '分钟'  // 总共时长
		 }
	}
}
</script>

<style lang="scss">
	.Finish{
		display: flex;
		flex-wrap: wrap;
		width: 100vw;
		height: 350rpx;
		border: 15rpx solid #eeeeee;
		border-radius: 1%;

		
		.Finish_Item{
			width: 375rpx;
			height: 160rpx;
			text-align: center;
			
			.Finish_Item_Title{
				height: 120rpx;
				line-height: 100rpx;
				color: #68747e;
			}
			.Finish_Item_val{
				height: 45rpx;
				line-height: 10rpx;
				font-size: 125%;
				color: #e7624f;
			}
		}
	}
	.detail{
		width: 700rpx;
		margin: 0 auto;
		.detail_title{
			display: flex;
			height: 60rpx;
			line-height: 60rpx;
			.detail_title_text{
				flex: 1;
				font-size: 30rpx;
			}
			.detail_title_type{
				flex: 1;
				text-align: right;
				font-size: 28rpx;
				margin-top: 6rpx;
				text{
					padding: 10rpx;
					border: 5rpx solid  #eee ;
				}
			}
		}
		.detail_list{
			margin-top: 20rpx;
			.list_title{
				display: flex;
				color: #e7624f;
				.list_title_date{
					width: 300rpx;
					font-size: 30rpx;
					text-align: center;
				}
				.list_title_cate{
					width: 200rpx;
					font-size: 30rpx;
					text-align: center;
				}
				.list_title_time{
					width: 200rpx;
					font-size: 30rpx;
					text-align: right;
					margin-right: 15rpx;
				}
			}
			.list_item{
				display: flex;
				height: 50rpx;
				border: 2rpx solid #eeeeee;
				margin-top: 10rpx;
				.list_item_date{
					width: 300rpx;
					font-size: 28rpx;
					text-align: center;
				}
				.list_item_cate{
					width: 200rpx;
					font-size: 28rpx;
					text-align: center;
				}
				.list_item_time{
					width: 150rpx;
					font-size: 28rpx;
					text-align: right;
				}
			}
		}
	}
	.cate_active{
		color: #e7624f;
	}
</style>
