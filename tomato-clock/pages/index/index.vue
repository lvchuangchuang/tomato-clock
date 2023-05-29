<template>
	<view>
		<view class="box0" v-show="isShow" >
			
			<view class="slider">
				<slider min="1" max="120"
					show-value activeColor="#E7624F" backgroundColor="#777"
					value='25' block-size="25"
					@change="sliderChange">
				</slider>
			</view>
			
			<view class="task_text">
				<view class="task_title">
					选择一个任务
				</view>
				<view class="task_desc">
					在接下来的{{time}}分钟，你将专注于这件事
				</view>
			</view>
			
			<view class="task_cate">
				
				<view v-for="(item,index) in cateArr" 
				:key="item.icon"
				class="cate_item"
				@click='clickCate(index)'>
					
					<view class="cate_icon">
						<image :src="item.icon"></image>
					</view>
					
					<view class="cate_text" >
						
						<view :class="cateActive===index ? 'cate_active':'' ">
							<view>
								{{item.text}}
							</view>
						</view>
					</view>
					
				</view>
			
			</view>
			
			<view class="start" v-show="isShow3"
			@click="startToWork()">
				开始自律
			</view>
			
		</view>
		
		
		<view class="clock" v-show="isShow2" style="background-color: #fc9d9a;">
			
			<view class="progress">
				
				<canvas  canvas-id="progress_bg" id="progress_bg" class="progress_bg" >
					
				</canvas>
				<canvas canvas-id="progress_active" id="progress_active" class="progress_active">
					
				</canvas>
				<canvas canvas-id="progress_text" id="progress_text"  class="progress_text">
					
				</canvas>
				<view class="progress_text">
					{{timeStr}}
				</view>
			</view>
			
			<view class="btn">
				<view class="okBtn" @click="ok" v-show="okShow">
					返回
				</view>
				<view class="stopBtn" @click="stop" v-show="stopShow">
					暂停
				</view>
				<view class="continueBtn" v-show="continueCancleShow">
					<view class="coutinueBtn" @click="ctn">
						继续
					</view>
					<view class="cancleBtn" @click="cancle">
						放弃
					</view>
				</view>
			</view>
			
		</view>
		

	</view>
	
</template>

<script>
	const utils = require("../../utils/util.js")
	const music = require('../../utils/music.js')
	export default {
		data() {
			return {
				rate: 0,
				isShow3: true,
				isShow2: true, 
				isShow: false,// 这两个show用于显示界面
				okShow: false, // 返回
				stopShow: true,  // 暂停
				continueCancleShow: false, // 继续
				startShow: true, // 立刻开始
				systemInfo:{},  // 系统信息
				isStarting: false,
				time: 25, 
				timeStr:'05:00',
				timer:0,
				minTime: 300000,
				cateActive:100,
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
		onReady:function(){
			this.getSystemInfo()
			this.drawBg()
			this.drawAnother()
			this.startWork()
		},
		methods: {
			sliderChange(e) {
				var flag = e.detail.value
				this.time = flag
				console.log('value 发生变化：' + this.time)
		    },
			clickCate(e){
				console.log("这是clickcate"+e)
				this.cateActive = e
				// console.log(this.cateActive)
			},
			getSystemInfo: function() {
				uni.getSystemInfo({
					success: (res) => {
						this.systemInfo = res
						this.rate = 750 / res.windowWidth
					},
				})
				// console.log(this.rate)
				
			},
			drawBg(){
				console.log("我画了个圆，看不看得到是你的事情")
				var lineWidth = 6 / this.rate
				var P = (400/this.rate/2)
				// console.log(lineWidth)
				var ctx = uni.createCanvasContext('progress_bg',this)
				ctx.setLineWidth(lineWidth)
				ctx.setStrokeStyle("#000000")
				ctx.setLineCap('round')
				ctx.beginPath()
				ctx.arc(P, P, P-2 * lineWidth,0,2*Math.PI,false)
				ctx.stroke()
				ctx.draw()
			},
			drawAnother(){
				// clearInterval(this.timer)
				if(this.isStarting){
					console.log("这是进度条，看不看得到是你的事情")
					const _this = this
					const timer = setInterval(()=>{
						// console.log("执行了定时器")
						var angle =1.5 + 2 * (_this.time * 60 * 1000 - _this.minTime) / (_this.time*60*1000)
						// console.log("这是angle"+angle)
						var currentTime = _this.minTime
						_this.minTime -= 10
						if(angle < 3.5){
							// console.log(angle)
							if(currentTime % 1000 == 0){ 
								var timeStr1 = currentTime / 1000; // s
								var timeStr2 = parseInt(timeStr1 / 60) // m
								var timeStr3 = (timeStr1 - timeStr2 * 60) >= 10 ? (timeStr1 - timeStr2 * 60) : '0'+ (timeStr1 - timeStr2 * 60)
								var timeStr2 = timeStr2 >= 10 ? timeStr2 : '0' + timeStr2
								_this.timeStr = timeStr2+":"+timeStr3
							}
							var lineWidth = 6 / _this.rate
							var P = (400/_this.rate/2)
							var ctx = uni.createCanvasContext('progress_active',_this)
							ctx.setLineWidth(lineWidth)
							ctx.setStrokeStyle("#fff")
							ctx.setLineCap('round')
							ctx.beginPath()
							ctx.arc(P, P, P - 2 * lineWidth,1.5*Math.PI,angle*Math.PI,false)						
							ctx.stroke()
							ctx.draw()
						}
						else{
							var logs = uni.getStorageSync('logs') || []
							logs.unshift({
								date: utils.formatTime(new Date),
								cate: _this.cateActive,
								time: _this.time
							})
							
							uni.setStorageSync('logs',logs)
							_this.timeStr = '00:00'
							_this.okShow = true
							_this.stopShow = false
							_this.continueCancleShow = false
							console.log(logs)
							clearInterval(timer)
							music.finish_work()
							
						}
					},10)	
					_this.timer = timer
				}
			},
			startWork(){
				console.log("注意，我要开始自律了")
				// this.start()
				this.isShow = !this.isShow
				this.isShow2 = !this.isShow2
				this.minTime =  this.time * 60 * 1000
				this.timeStr = parseInt(this.time) >= 10 ? this.time + ':00' : '0' + this.time + ':00'
			},
			//因为在onready里startwork调用了一次，如果再次调用整个startWork就会让进度条速度过快，所以
			//新写一个方法解决这个问题
			startToWork(){
				const _this = this
				if(this.cateActive !== 100){
					var countdown = 3
					_this.isShow3 = false
					// 开始按钮后 将选择功能丧失
					
					
					const fn = setInterval(function() {
						uni.showToast({
							title: '计时将在' + countdown + '秒后开始' ,
							icon: 'none',
						})
						if (countdown!==0) {
							countdown--
							music.play_didi()
							console.log(_this.isShow3)
							
						}
						else{
							clearInterval(fn)
							_this.start()
							_this.startWork()
						}
					}, 1500);
				}
				else{
					uni.showModal({
						title: "提示",
						content: "请从下方选择学习类型！"
					})
				}
				
			},
			start(){
				this.startShow = false
				this.isStarting = true
				console.log("我开始了")
				this.ctn()
			},
			// ctn是继续的意思，uniapp中continue不能叫做方法名字
			ctn(){
				this.drawAnother()
				this.stopShow = true
				this.continueCancleShow = false
				this.okShow = false
				this.isShow3 = true
				console.log("我继续了")
			},
			stop(){
				clearInterval(this.timer)
				this.stopShow = false
				this.continueCancleShow = true
				this.okShow = false
				console.log("我暂停了")
			},
			cancle(){
				uni.showModal({
				    title: '提示',
					content: '你确定要放弃?',
					cancelText: "取消", // 取消按钮的文字  
					confirmText: "放弃", // 确认按钮文字  
					showCancel: true, // 是否显示取消按钮，默认为 true
					confirmColor: '#f55850',
					cancelColor: '#39B54A',
					success: (res) => {
						if(res.confirm) {  
							clearInterval(this.timer)
							this.stopShow = false
							this.continueCancleShow = false
							this.okShow = false
							this.startShow = true
							this.startWork()
							console.log("我放弃了")
						}
						else {  
								//点击了取消
						}  
					} 
				})
				
				
				
				
			},
			ok(){
				this.stopShow = true
				this.continueCancleShow = false
				this.okShow = false
				this.startWork()
				console.log("我ok了")
			},
			refresh(){
				uni.navigateTo({
					url: '../../index/index'
				})
				console.log("我刷新了")
			}
			
		}
	}
</script>

<style lang="scss">
	page {
		overflow-y: hidden; 
	}
	.clock{
		width: 100vw;
		height: 100vh;
		padding-top: 0.1%;
		background: #e7624f;
	}
	.progress{
		width: 400rpx;
		height: 400rpx;
		// border-radius: 100%;
		background-color: #fc9d9a;
		margin: 140rpx auto;
		position: relative;
		.progress_bg{
			position: absolute;
			left: 0;
			top: 0;
			width: 400rpx;
			height: 400rpx;
		}
		.progress_active{
			position: absolute;
			left: 0;
			top: 0;
			width: 400rpx;
			height: 400rpx;
		}
		.progress_text{
			
			width: 160rpx;
			height: 60rpx;
			line-height: 60rpx;
			font-size: 45rpx;
			color: #FFFFFF;
			text-align: center;
			position: absolute;
			left: 120rpx;
			top: 170rpx;
			
		}
	}
	.btn{
		.okBtn{
			width: 275rpx;
			height: 90rpx;
			border: 2rpx solid #ffffff;
			border-radius: 20rpx;
			margin: 10rpx auto;
			line-height: 90rpx;
			text-align: center;
			color: #ffffff;
		}
		.stopBtn{
			width: 275rpx;
			height: 90rpx;
			border: 2rpx solid #ffffff;
			border-radius: 20rpx;
			margin: 10rpx auto;
			line-height: 90rpx;
			text-align: center;
			color: #ffffff;
		}
		.continueBtn{
			width: 275rpx;
			height: 90rpx;
			border: 2rpx solid #ffffff;
			border-radius: 20rpx;
			margin: 10rpx auto;
			line-height: 90rpx;
			text-align: center;
			color: #ffffff;
		}
		.cancleBtn{
			width: 275rpx;
			height: 90rpx;
			border: 2rpx solid #ffffff;
			border-radius: 20rpx;
			margin: 10rpx auto;
			line-height: 90rpx;
			text-align: center;
			color: #FFFFFF;
		}
		.startBtn{
			width: 275rpx;
			height: 90rpx;
			border: 2rpx solid #ffffff;
			border-radius: 20rpx;
			margin: 10rpx auto;
			line-height: 90rpx;
			text-align: center;
			color: #FFFFFF;
		}
	}
	
	.start{
		width: 275rpx;
		height: 90rpx;
		border: 2rpx solid #e7624f;
		border-radius: 20rpx;
		margin: 120rpx auto;
		line-height: 90rpx;
		text-align: center;
		color: #e7624f;
		
	}
	.box0{
		height: 100vh;
		width: 100%;//750rpx不太好
		background-color: lavenderblush;
	}
	.slider{
		width: 650rpx;
		padding-top: 15rpx;
		margin:0rpx auto;
		margin-left: 75rpx;
		line-height: 5%;
	}
	.task_text{
		height: 120rpx;
		margin: 20rpx auto;
		text-align: center;
		.task_title{
			font-size: 35rpx;
			height: 80rpx;
			line-height: 80rpx;
			font-weight: 700;
		}
		.task_desc{
			font-size: 30rpx;
			line-height: 50rpx;
		}
	} 
	.task_cate{
		display: flex;
		width: 660rpx;
		flex-wrap: wrap;
		.cate_item{
			width: 220rpx;
			height: 150rpx;
			margin-bottom: 40rpx;
			.cate_icon{
				height: 90rpx;
				margin-top: 25%;
				line-height: 20rpx;
				margin-left: 90rpx;
				text-align: center;
				image{
					width: 60rpx;
					height: 60rpx;
					margin: 0 auto;
				}
				
			}
			.cate_text{
				line-height: 20rpx;
				margin-left: 90rpx;
				text-align: center;
				.cate_active{
					view{
						color: #e7624f;
					}
				}
			}
		}
	}
	
</style>
