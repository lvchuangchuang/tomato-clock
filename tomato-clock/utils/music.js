//music.js
var music={
		// 如果有更多声音的在下面接着创建
		play_didi(){
			const innerAudioContext = uni.createInnerAudioContext();
			innerAudioContext.autoplay = true;
			innerAudioContext.src = '../../static/music/button_tap.mp3';
			innerAudioContext.onPlay(() => {
		  		console.log('开始播放');
			});
			innerAudioContext.onError((res) => {
				console.log('播放错误');
			  	console.log(res.errMsg);
			  	console.log(res.errCode);
			});
		},
		finish_work(){
			const innerAudioContext = uni.createInnerAudioContext();
			innerAudioContext.autoplay = true;
			innerAudioContext.src = '../../static/music/finish_work.mp3';
			innerAudioContext.onPlay(() => {
				console.log('开始播放');
			});
			innerAudioContext.onError((res) => {
				console.log('播放错误');
			  	console.log(res.errMsg);
			  	console.log(res.errCode);
			});
		},
}

module.exports = music;

