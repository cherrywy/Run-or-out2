var Alert = require('../../modules/alert.js');
var app = new Vue({
	el: '#act-index-v',
	data: {
		info: null,
		jsSdK: null,
	},
	methods: {
		sendInvite: function() {
			$.ajax({
				url: "https://www.runorout.cn/activity/hundred_day/publicize",
				type: "get",
				async: true,
				dataType: "json",
				beforeSend: function() {
					$("#loadingToast").show();
				},
				complete: function() {
					$("#loadingToast").hide();
				},
				success: function(data) {
					if (data.status == 200) {
						Alert.show({
							content: "邀请卡已通过不跑就出局公众号发送给你，拿去嘚瑟吧",
							type: "alert",
							sureBtnText: "好"
						})
					} else {
						Alert.show({
							content: data.message,
							type: "alert",
						})
					}
				},
				error: function() {
					Alert.show({
						content: "发送邀请卡失败，请重试",
						type: "alert",
					})
				}
			})
		}
	}
})

$(function() {

	getConfig();

	wx.config({
		debug: false,
		appId: app.jsSdK.appId, // 必填，公众号的唯一标识
		timestamp: app.jsSdK.timestamp, // 必填，生成签名的时间戳
		nonceStr: app.jsSdK.nonceStr, // 必填，生成签名的随机串
		signature: app.jsSdK.signature, // 必填，签名，见附录1
		jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});

	getInitInfo();

	$(".rules").on("click", function() { //打开规则
		$(".rules-page").show();
	})

	$(".icon-guanbi1").on("click", function() { //关闭规则
		$(".rules-page").hide();
	})
})

function toRankIndex() {
	var timestamp = new Date().getTime();
	window.location.href = "https://www.runorout.cn/page/activity/rank?time=" + timestamp;
}

function toHelper() {
	var timestamp = new Date().getTime();
	window.location.href = "https://www.runorout.cn/page/activity/helper?time=" + timestamp;

}

function getInitInfo() {
	$.ajax({
		url: "https://www.runorout.cn/init/hundred_day",
		type: "get",
		async: true,
		dataType: "json",
		beforeSend: function() {
			$("#loadingToast").show();
		},
		complete: function() {
			$("#loadingToast").hide();
		},
		success: function(data) {
			if (data.status == 200) {
				app.info = data.data;

				app.shareData = {
					appid: app.jsSdK.appId,
					imgUrl: (app.info.teams.hundred_day.avatar).replace("https", "http"),
					link: ("https://www.runorout.cn/page/activity"),
					title: "已有" + (parseInt(app.info.teams.hundred_day.people) + parseInt(app.info.teams.loose_hundred_day.people)) + "人加入了不跑就出局百日挑战赛，一起来吧！",
					desc: "坚持跑步100天，不跑扣钱，跑了分钱！"
				};

				app.shareDataTimeLine = {
					appid: app.jsSdK.appId,
					imgUrl: (app.info.teams.hundred_day.avatar).replace("https", "http"),
					link: ("https://www.runorout.cn/page/activity"),
					title: "已有" + (parseInt(app.info.teams.hundred_day.people) + parseInt(app.info.teams.loose_hundred_day.people)) + "人加入了不跑就出局百日挑战赛，一起来吧！",
					desc: "坚持跑步100天，不跑扣钱，跑了分钱！"
				};

				wx.ready(function() {
					wx.onMenuShareAppMessage(app.shareData);
					wx.onMenuShareTimeline(app.shareDataTimeLine);
				});
			} else {
				Alert.show({
					content: data.message,
					type: "alert",
				})
			}
		},
		error: function() {
			Alert.show({
				content: "哎呀，获取活动信息失败，请重试",
				type: "alert",
				sureBtnText: "刷新一下",
				sure: function() {
					window.location.reload();
				}
			})
		}
	})
}

function getConfig() {
	$.ajax({
		url: urlGetConfig,
		type: "get",
		async: false,
		dataType: "json",
		data: {
			url: location.href.split('#')[0]
		},
		success: function(data) {
			app.jsSdK = data;
		}
	})
}