var id = $.getUrlParam("id");
var type = $.getUrlParam("type"); //加入跑班或者创建跑班
var joinType = $.getUrlParam("joinType"); //加入跑班或者创建跑班
var startDate = $.getUrlParam("startDate"); //传递的开始日期
var referee =  $.getUrlParam("referee");
var oneWeekPrice = 0; //一周的价格
var oneDayPrice = 0;
var accountMoney = 0; //账户余额
var totalMoney = 0; //总价格
var halfMoney = 0; //半途续班
var week = 1;
var minWeek = 1;
var day = 1;
var discountMoney = 0; //用账户支付金额
var turelyMoney = 0; //实付金额
var orderId = "";
var jsSdK = null;

if (type == "joinClass") {
	$(".pay-title").html("加入跑班");
	$("#pay-weichat").attr("onclick", "MtaH5.clickStat('JoinClassPay')");
	if(joinType == "participation"){
	}else{
		week = 2;
		minWeek = 2;
		$(".flex-intro").show();
	}
	$("#week").html(week);
} else {
	$(".pay-title").html("创建跑班");
	//$("#pay-weichat").attr("onclick", "MtaH5.clickStat('CreateClassPay')")
}

$(function() {
	getConfig();

	wx.config({
		debug: false,
		appId: jsSdK.appId, // 必填，公众号的唯一标识
		timestamp: jsSdK.timestamp, // 必填，生成签名的时间戳
		nonceStr: jsSdK.nonceStr, // 必填，生成签名的随机串
		signature: jsSdK.signature, // 必填，签名，见附录1
		jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});

	getMoneyInfo();
	$(".pay-discount").on("click", function() {
		MtaH5.clickStat('pay_accountDeductible');
		$(this).toggleClass("active");
		if ($(this).attr("class").indexOf("active") != -1) {
			if (accountMoney > totalMoney) {
				discountMoney = totalMoney;
			} else {
				discountMoney = accountMoney;
			}
		} else {
			discountMoney = 0;
		}
		changeMoney();
	});
	$(".icon-read-deal").on("click", function() {
		$(this).parent().toggleClass("active");
		$("#pay-weichat").toggleClass("disabled");
	});

	$("#pay-weichat").on("click", function() {
		MtaH5.clickStat('pay_payImmediately');
		if ($(this).attr("class") == "disabled") {
			//$("#alert-out").show().find(".alert-word").html("请先同意用户协议");
			dialog.init({
		        content: "请先同意用户协议",
		        type: "alert"
		    })
			return false;
		}
		getOrderId();
	})
})

function showDeal() {
	$("#deal").addClass("show");
}

function hideDeal() {
	$("#deal").removeClass("show");
}

function showDelay() {
	$("#pay-delay").addClass("show");
}

function hideDelay() {
	$("#pay-delay").removeClass("show");
}

function changeWeek(value) {
	
	if(value==1){
		MtaH5.clickStat('pay_addWeek');
	}else{
		MtaH5.clickStat('pay_reduceWeek');
	}
	week += value;
	if(joinType == "participation"){
		if (week < minWeek) {
			week = minWeek;
		}
	}else{
		if (week < minWeek) {
			week = minWeek;
		}
	}
	
	if (joinType == "participation") {
		totalMoney = oneWeekPrice * week;
	} else {
		totalMoney = oneWeekPrice * (week - 1) + halfMoney;
	}

	if ($(".pay-discount").attr("class").indexOf("active") != -1) {
		if (accountMoney > totalMoney) {
			discountMoney = totalMoney;
		} else {
			discountMoney = accountMoney;
		}
	} else {
		discountMoney = 0;
	}

	changeMoney();
	$("#week").html(week);
}

function changeMoney() {
	console.log('-----');
	var totalMoneyYuan = toDecimal2(totalMoney / 100);
	//var oneWeekPriceYuan = toDecimal2(oneWeekPrice/100);
	turelyMoney = totalMoney - discountMoney;
	var turelyMoneyYuan = toDecimal2(turelyMoney / 100);
	var discountMoneyYuan = toDecimal2(discountMoney / 100);
	$(".pay-money").html("￥" + totalMoneyYuan);
	if (joinType == "participation") {
		$("#money-info").html("￥" + totalMoneyYuan + "=￥" + toDecimal2(oneDayPrice / 100) + "*" + day + "*" + week);
	} else {
		$("#pay-intro").html("契约金=每日契约金*每周出勤*报名周数+插班金额");
		$("#money-info").html("￥" + totalMoneyYuan + "=￥" + toDecimal2(oneDayPrice / 100) + "*" + day + "*" + (week-1) + "+￥" + toDecimal2(halfMoney/100));
	}
	
	$("#total-money").html("￥" + totalMoneyYuan);
	$("#truely-pay span").html("￥" + turelyMoneyYuan);
	$("#account-money-minus").html("-￥" + discountMoneyYuan);

	$(".pay-money-list").html(toDecimal2(oneDayPrice / 100) + "元/天");
	$(".pay-week-list").html(day + "天/周");
}

function getMoneyInfo() {
	var product = {
		team_id: id,
		cycle: 1,
		start_date: startDate
	};

	console.log(joinType+","+startDate);

	$.ajax({
		url: urlGetOrderMoney,
		type: "get",
		async: false,
		data: {
			type: "flexible_participation",
			product: product
		},
		dataType: "json",
		success: function(data) {
			//console.log(data);
			if (data.status == 200) {
				halfMoney = parseInt(data.data.fee);
				oneDayPrice = parseInt(data.data.money);
				day = parseInt(data.data.required_duration);
				oneWeekPrice = oneDayPrice * day;
				if(joinType == "participation"){
					totalMoney = parseInt(data.data.price);
				}else{
					totalMoney = parseInt(data.data.price)
				}
				//totalMoney = parseInt(1);
				week = data.data.min_cycle;
				minWeek = data.data.min_cycle;
				$("#week").html(week);
				$(".pay-class-name").html(data.data.team_name);
				$(".pay-distance-list").html("每次" + data.data.team_distance + "KM");
				$(".pay-start-day").html(data.data.startDate);
				getUserAccountMoney();
			}
		},
		error: function() {
			alert("网络错误")
		}
	})
}

function getUserAccountMoney() {
	$.ajax({
		url: urlGetUserAccoutMoney,
		type: "get",
		async: false,
		dataType: "json",
		success: function(data) {
			console.log(data);
			if (data.status == 0) {
				accountMoney = parseInt(data.data.money);
				//accountMoney = parseInt(0);
				$("#account-money").html(toDecimal2(accountMoney / 100));
				if (accountMoney > totalMoney) {
					discountMoney = totalMoney;
				} else {
					discountMoney = accountMoney;
				}
				changeMoney();
			}
		},
		error: function() {
			netWorkError();
		}
	})
}

function getOrderId() {
	var product = {
		team_id: id,
		cycle: week,
		start_date: startDate
	};
	$.ajax({
		url: urlPayOrder,
		type: "post",
		async: true,
		data: {
			type: "flexible_participation",
			referee: referee,
			product: product
		},
		dataType: "json",
		beforeSend: function() {
			$("#loadingToast").show();
		},
		success: function(data) {
			if (data.status == 200) {
				orderId = data.data.order_no;
				if (discountMoney == 0) {
					//$("#alert-out").show().find(".alert-word").html("微信支付还在调试!");
					getWeiPayIdOnlyWei();
				} else if (accountMoney >= totalMoney) {
					payByAccount();
				} else {
					getWeiAndAccount();
				}
			} else {
				$("#loadingToast").hide();
			}
		},
		error: function() {
			netWorkError();
			$("#loadingToast").hide();
		}
	})
}

function payByAccount() {
	$.ajax({
		url: urlPayByAccount,
		type: "post",
		async: true,
		data: {
			order_no: orderId,
			money: discountMoney
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
				if (type == "createClass") {
					$("#alert-out-create").show();
				} else if (type == "joinClass") {
					window.location.href = "/page/team/detail?id=" + id + "&type='joinClass'";
				}
			}
		},
		error: function() {
			netWorkError();
		}
	})
}

function toFill() {
	var tel = $("#alert-out-create input").val().trim();
	if (tel != null && tel != "") {
		if (!checkTel(tel)) {
			$("#wrong-tel").show();
			setTimeout(function() {
				$("#wrong-tel").hide();
			}, 1000);
			return false;
		}
		$.ajax({
			url: urlUpdateUserInfo,
			type: "put",
			async: true,
			dataType: "json",
			data: {
				mobile: tel
			},
			beforeSend: function() {
				$("#loadingToast").show();
			},
			complete: function() {
				$("#loadingToast").hide();
			},
			success: function(data) {
				if (data.status == 200) {
					window.location.href = "/page/team/management?id=" + id;
				}
			},
			error: function() {
				netWorkError();
			}
		})
	} else {
		window.location.href = "/page/team/management?id=" + id;
	}
}

function getWeiPayIdOnlyWei() {
	$.ajax({
		url: urlGetWeiPayId,
		type: "post",
		async: true,
		data: {
			order_no: orderId
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
						if (type == "createClass") {
							$("#alert-out-create").show();
						} else if (type == "joinClass") {
							window.location.href = "/page/team/detail?id=" + id + "&type='joinClass'";
						}
					}
				});
			} else {
				$("#loadingToast").hide();
			}
		},
		error: function() {
			alert("网络错误");
			$("#loadingToast").hide();
		}
	})
}

function getWeiAndAccount() {
	$.ajax({
		url: urlGetWeiPayId,
		type: "post",
		async: true,
		data: {
			order_no: orderId,
			money: turelyMoney
		},
		dataType: "json",
		beforeSend: function() {
			$("#loadingToast").show();
		},
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
						$("#alert-out-create").show();
					}
				});
			}
		},
		error: function() {
			alert("网络错误");
			$("#loadingToast").hide();
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
			jsSdK = data;
		}
	});
}