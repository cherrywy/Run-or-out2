var Alert = require('../../../modules/alert.js');
var app = new Vue({
	el: '#house-index',
	data: {
		user: null,
		price: 0,
		teamId: '57e0fbb46da0df3e0a1abc22',
		orderId: ''
	},
	methods: {
		joinNow: function() {
			$(".bottom-pop").addClass("active");
			var product = {
				team_id: this.teamId,
				cycle: 1
			};
			$.ajax({
				url: urlGetOrderMoney,
				type: "get",
				async: true,
				data: {
					type: "fang_duo_duo",
					product: product
				},
				beforeSend: function() {
					$("#loadingToast").show();
				},
				complete: function() {
					$("#loadingToast").hide();
				},
				dataType: "json",
				success: function(data) {
					if (data.status == 200) {
						app.price = data.data.price;
					}
				},
				error: function() {
					alert("网络错误")
				}
			});
		},
		hidePop: function() {
			$(".bottom-pop").removeClass("active");
			// $(".content").removeClass('ios-blur');
		},
		invite: function() {
			$.ajax({
				url: '/ajax/fangduoduo/share',
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
					Alert.show({
						content: "一键约跑活动邀请卡已发送，好友扫码可一键报名参赛，去微信号查看邀请卡吧!",
						sure: function() {
							WeixinJSBridge.call('closeWindow');
						}
					});
				},
				error: function() {
					Alert.show({
						content: "一键约跑活动邀请卡已发送，好友扫码可一键报名参赛，去微信号查看邀请卡吧!",
						sure: function() {
							WeixinJSBridge.call('closeWindow');
						}
					});
				}
			});
		},
		weiPay: function() {
			getOrderId();
		}
	}
})
$(function() {
	getConfig();
	getInfo();

	wx.config({
		debug: false,
		appId: app.jsSdK.appId, // 必填，公众号的唯一标识
		timestamp: app.jsSdK.timestamp, // 必填，生成签名的时间戳
		nonceStr: app.jsSdK.nonceStr, // 必填，生成签名的随机串
		signature: app.jsSdK.signature, // 必填，签名，见附录1
		jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
});

function getInfo() {
	$.ajax({
		url: "/init/fangduoduo",
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
			if (data.status == 0) {
				app.user = data.data.user;

				app.shareData = {
					appid: app.jsSdK.appId,
					imgUrl: ("https://www.runorout.cn/images/house/share.jpg"),
					link: ("https://www.runorout.cn/page/activity/fangduoduo"),
					title: "一键约跑-黄金挑战赛正式开赛!",
					desc: "房多多&不跑就出局联合发起，9.26正式开跑！跑步赢奖金，iPhone7 Plus等你来拿！"
				};

				app.shareDataTimeLine = {
					appid: app.jsSdK.appId,
					imgUrl: ("https://www.runorout.cn/images/house/share.jpg"),
					link: ("https://www.runorout.cn/page/activity/fangduoduo"),
					title: "房多多&不跑就出局联合发起，9.26正式开跑！跑步赢奖金，iPhone7 Plus等你来拿！"

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
				content: "活动加载失败，请重试",
				type: "alert",
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

function getOrderId() {
	var product = {
		cycle: 1,
		team_id: app.teamId,
	};
	$.ajax({
		url: urlPayOrder,
		type: "post",
		async: true,
		data: {
			type: "fang_duo_duo",
			product: product
		},
		dataType: "json",
		beforeSend: function() {
			$("#loadingToast").show();
		},
		success: function(data) {
			if (data.status == 200) {
				app.orderId = data.data.order_no;
				getWeiPayIdOnlyWei();
			} else {
				$("#loadingToast").hide();
				Alert.show({
					content: data.message,
					type: "alert",
				})
			}
		},
		error: function() {
			Alert.show({
				content: "网络错误，请重试",
				type: "alert",
			})
			$("#loadingToast").hide();
		}
	})
}

function getWeiPayIdOnlyWei() {
	$.ajax({
		url: urlGetWeiPayId,
		type: "post",
		async: true,
		data: {
			order_no: app.orderId
		},
		dataType: "json",
		beforeSend: function() {
			$("#loadingToast").show();
		},
		success: function(data) {
			if (data.status == 200) {
				$("#loadingToast").hide();
				var weiConfig = data.data;
				var webarr = weiConfig.parameters;

				wx.chooseWXPay({
					timestamp: webarr.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
					nonceStr: webarr.nonceStr, // 支付签名随机串，不长于 32 位
					package: webarr.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
					signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
					paySign: webarr.paySign, // 支付签名
					success: function(res) {
						//$("#alert-out-create").show();
						Alert.show({
							content: "报名成功",
							type: "alert",
							sure: function() {
								window.location.href = "/page/activity/fangduoduo/success";
							}
						})
					}
				});
			} else {
				$("#loadingToast").hide();
			}
		},
		error: function() {
			$("#loadingToast").hide();
		}
	})
}