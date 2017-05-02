var Alert = require('../../../modules/alert.js');
var joined = $.getUrlParam("joined");
var app = new Vue({
	el: '#act-index-v',
	data: {
		info: null,
		jsSdK: null,
		useWeipay: true,
		isShowPop: false,
		isShowRules: false,
		hasJoined: false,
		user: null, //用户信息
		teamsGroup100: null, //100天组
		teamsGroup120: null, //120天组
		choosedTeamInfo: null, //点开的详情对象
		errorImagesRO: $('.errorImagesRO').attr('src'),
		accountInfo: null, //账户信息
		price: 0, //应付金额
		truePrice: 0, //实际支付
		choosedTeamId: '', //选中的teamId
		orderId: '', //订单编号
		requiredDay: 0,
		priority: 100, //如果100，这100天在前，如果120，则120天在前
	},
	methods: {
		sendInvite: function() {
			$.ajax({
				url: urlHead + "ajax/activity/hundred_day3/publicize",
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
						Alert.show({
							content: "邀请卡已通过不跑就出局公众号发送给你，分享给好友扫码后可一键报名参赛。",
							type: "alert",
							sureBtnText: "我知道了"
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
		},
		payPop: function(id,money,day) {
			$(".bottom-pop").addClass("active");
			$(".content").addClass('ios-blur');
			// this.price = money * 100;
			this.price = money * day;
			this.requiredDay = day;
			app.choosedTeamId = id;
			getUserAccountMoney();
		},
		hidePop: function() {
			$(".bottom-pop").removeClass("active");
			$(".content").removeClass('ios-blur');
		},
		useRoAccount: function() {
			$("#use-ro-account").toggleClass('active');
			changeMoney();
		},
		showPop: function(id,type){ //显示弹窗
			if(type == '100'){
				for(var i = 0; i < this.teamsGroup100.length; i ++){
					if(this.teamsGroup100[i].id == id){
						this.choosedTeamInfo = this.teamsGroup100[i];
						break;
					}
				}
			}else{
				for(var i = 0; i < this.teamsGroup120.length; i ++){
					if(this.teamsGroup120[i].id == id){
						this.choosedTeamInfo = this.teamsGroup120[i];
						break;
					}
				}
			}
			this.isShowPop = true;
		},
		closePop: function(){ //关闭弹窗
			this.isShowPop = false;
		},
		showRules: function(){
			this.isShowRules = true;
		},
		closeRules: function(){
			this.isShowRules = false;
		},
		weiPay: function(){
			getOrderId();
		},
		gotoRankList: function(){
			// Alert.show({
			// 	content: '比赛未开始，暂无排行榜哦~',
			// 	type: "alert",
			// });
			// return false;
			var timestamp=new Date().getTime();
            window.location.href = "/page/activity/hundred_day3/rank?time=" + timestamp;
		},
		gotoRules: function(){
			window.location.href = 'http://mp.weixin.qq.com/s?__biz=MzIwNjM2NzQ1Nw==&mid=100001452&idx=1&sn=d5b1cbb83da4bb983ef5ccea2d02b3d9&chksm=1723f922205470343be4cf6f2d40ffcf99491ded3ba6bca63482ebd7d7854c521a9b48249875&scene=0&from=groupmessage&isappinstalled=0#wechat_redirect';
		},
		gotoZanzhu: function(){
			window.location.href = 'http://mp.weixin.qq.com/s?__biz=MzIwNjM2NzQ1Nw==&mid=100001500&idx=1&sn=be7208850bf8f586119913ea25ce1740&chksm=1723f9522054704401b2c10981fe918301052aed722a4f2ee4f162d335d9fae6e5a8bb86afa3&scene=0#wechat_redirect';
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

})

function changeMoney(){
	if($('#use-ro-account').attr('class').indexOf('active') != -1){
		if(app.accountInfo.money >= app.price){
			app.useWeipay = false;
			app.truePrice = 0;
		}else{
			app.useWeipay = true;
			app.truePrice = app.price - app.accountInfo.money;
		}
	}else{
		app.useWeipay = true;
		app.truePrice = app.price;
	}
}

function getInitInfo() {
	$.ajax({
		url: urlHead + "init/activity/hundred_day3",
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
				app.teamsGroup100 = data.data.teams_group_100;
				app.teamsGroup120 = data.data.teams_group_120;
				app.hasJoined = app.user.participate;
				app.priority = data.data.priority;

				if(app.hasJoined && joined == 'success'){
					app.isShowRules = true;
				}

				app.shareData = {
					appid: app.jsSdK.appId,
					imgUrl: ("https://www.runorout.cn/public/static/images/activities/hundred3-icon_c1e7a74.jpg"),
					link: ("https://www.runorout.cn/page/activity/hundred_day3"),
					title: "寒战100天 - 不跑就出局",
					desc: "10大战队PK，千元加注奖金池"
				};

				app.shareDataTimeLine = {
					appid: app.jsSdK.appId,
					imgUrl: ("https://www.runorout.cn/public/static/images/activities/hundred3-icon_c1e7a74.jpg"),
					link: ("https://www.runorout.cn/page/activity/hundred_day3"),
					title: "寒战100天 - 不跑就出局",
					desc: "10大战队PK，千元加注奖金池"
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
			// Alert.show({
			// 	content: "哎呀，获取活动信息失败，请重试",
			// 	type: "alert",
			// 	sureBtnText: "刷新一下",
			// 	sure: function() {
			// 		window.location.reload();
			// 	}
			// })
		}
	})
}

function getUserAccountMoney() {
	$.ajax({
		url: urlGetUserAccoutMoney,
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
				app.accountInfo = data.data;
				changeMoney();
			}
		},
		error: function() {
			Alert.show({
				content: "加载账户金额失败",
				type: "alert",
				sureBtnText: "确定"
			})
		}
	})
}

function getOrderId() {
	var product = {
		team_id: app.choosedTeamId,
		cycle: 1,
	};
	$.ajax({
		url: urlPayOrder,
		type: "post",
		async: true,
		data: {
			type: "hundred_day_participation",
			product: product
		},
		dataType: "json",
		beforeSend: function() {
			$("#loadingToast").show();
		},
		success: function(data) {
			if (data.status == 200) {
				app.orderId = data.data.order_no;
				// console.log(app.useWeipay);
				if(app.useWeipay){
					useWeiXinPay();
				}else{
					payByAccount();
				}
			} else {
				$("#loadingToast").hide();
			}
		},
		error: function() {
			$("#loadingToast").hide();
		}
	})
}

function useWeiXinPay() {
	//调用微信支付
	// alert('wei');
	// return false;
	$.ajax({
		url: urlGetWeiPayId,
		type: "post",
		async: true,
		data: {
			order_no: app.orderId,
			money: app.truePrice
		},
		dataType: "json",
		success: function(data) {
			$("#loadingToast").hide();
			if (data.status == 200) {
				var weiConfig = data.data;
				var webarr = weiConfig.parameters;
				wx.chooseWXPay({
					timestamp: webarr.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
					nonceStr: webarr.nonceStr, // 支付签名随机串，不长于 32 位
					package: webarr.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
					signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
					paySign: webarr.paySign, // 支付签名
					success: function(res) {
						app.hidePop();
						Alert.show({
							content: "报名成功!",
							type: "alert",
							sureBtnText: "确定",
							sure: function() {
								window.location.href = '/page/activity/hundred_day3?joined=success';
							}
						});
					}
				});
			}
		},
		error: function() {
			$("#loadingToast").hide();
		}
	});
}

function payByAccount() {
	//调用账户支付
	// alert('account');
	// return false;
	$.ajax({
		url: urlPayByAccount,
		type: "post",
		async: true,
		data: {
			order_no: app.orderId,
			money: app.price
		},
		dataType: "json",
		beforeSend: function() {
			$("#loadingToast").show();
		},
		complete: function() {
			$("#loadingToast").hide();
		},
		success: function(data) {
			if (data.status == 200) {
				app.hidePop();
				Alert.show({
					content: "报名成功!",
					type: "alert",
					sureBtnText: "确定",
					sure: function() {
						window.location.href = '/page/activity/hundred_day3?joined=success';
					}
				});
			}
		},
		error: function() {
			Alert.show({
				content: "账户支付失败，请重试或联系管理员",
				type: "alert",
				sureBtnText: "确定"
			});
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
	});
}

Vue.filter('descriptionArr', function(value) {
    if (value != null && value != '') {
        return value.join("<br>");
    } else {
        return '暂无介绍哦~';
    }
})