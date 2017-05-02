var Alert = require('../modules/alert.js');
 var id = $.getUrlParam("id");
//var id = "575783656da0df463f001616";
var referee = $.getUrlParam("referee");
var type = $.getUrlParam("type");
//alert(id)
var app = new Vue({
	el: '#class-details-v',
	data: {
		closeTime: 150, //选择后保持时间
		classInfo: null,
		payStep: 1,
		minWeek: 1,
		week: 1,
		jsSdK: null,
		rulesHide: true,
		isMonitor: false, //是否是班长
		today: getToday(), //今日日期
		chooseStartDay: "", //选择开跑日期
		joinType: "participation", //不插班
		isContinue: false, //是否续班
		perWeekMoney: 0, //每周金额
		perDayMoney: 0, //每天金额
		dayType: "first", //加入日期类型，例如：第一天(first)，中途(cut)，最后一天(last)
		chooseType: '', //开跑类型 today tomorrw nextWeek cutAndJoin
		finishedDay: [], //已开跑天数

		moneyInfo: null, //跑步日期以及金额信息
		accountInfo: null, //账户金额
		totalMoney: 0, //最终除开账户金额的总支付金额
		firstTotalMoney: 0, //初始除开账户金额的总支付金额
		addWeek: 0, //用户自己增加的周数
		isCut: false, //是否插班

		orderId: '', //生成订单编号
		planeFinishDay: '',
		useWeipay: true, //是否微信支付(账户余额不够支付)，是就true

		startDateList: [], //新版支付-选择日期列表
		startDate: '', //新版支付-选择的日期

		rankList:[],//排行榜
		
		team: null,

		rankListImg:[],
		totalRank:0,

		
	},
	methods: {
		showCode: function() {
			MtaH5.clickStat('classDetail_showCode');
			if (!this.classInfo.qrcode && !this.isMonitor) {
				Alert.show({
					content: "班级二维码暂未上传，可等班长上传后再来尝试。",
					type: "alert",
					sureBtnText: '我知道了'
				});
			} else if (this.isMonitor && !this.classInfo.qrcode) {
				Alert.show({
					content: "班级二维码暂未上传，点击前往班级设置页上传",
					type: "confirm",
					sureBtnText: '班级设置',
					sure: function(){
						window.location.href = "/page/team/management?id=" + id;
					}
				});
			} else {
				$(".fullpage-pop").show();
				var height = parseInt($(".fullpage-pop-head").height()) + parseInt($(".fullpage-pop-body").css("padding").replace('px', '')) + parseInt($(".fullpage-pop-body").find("img").height());
				var winHeight = parseInt($(window).height());
				var iconHeight = parseInt($(".fullpage-pop-body").find(".iconfont").height());
				//console.log((winHeight - height - iconHeight)/2)
				$(".fullpage-pop-body").find(".icon-guanbi1").css("margin-top", ((winHeight - height - iconHeight) / 2));
			}
		},
		hideCode: function() {
			$(".fullpage-pop").hide();
		},
		gotoManage: function() {
			window.location.href = "/page/team/management?id=" + id;
		},
		showInvite: function() {
			
			MtaH5.clickStat('shareClass_showInvite');
			// console.log(this.classInfo.user);

			// if (this.classInfo.user.participate) {
				$.ajax({
					url: urlGetInviteCard,
					type: "get",
					async: true,
					dataType: "json",
					beforeSend: function() {
						$("#loadingToast").show();
					},
					complete: function() {
						$("#loadingToast").hide();
					},
					data: {
						team_id: id
					},
					success: function(data) {
						Alert.show({
							content: "邀请卡已通过不跑就出局公众号发送给你，请前往保存分享",
						    type: "confirm",
				            sureBtnText: "前往下载",
				            cancelBtnText:"取消",
				            sure:function(){
				            	wx.closeWindow();

				            },
				   
						    });
					},
					error: function() {
						Alert.show({
							content: "邀请卡已通过不跑就出局公众号发送给你，请前往保存分享",
						    type: "confirm",
				            sureBtnText: "前往下载",
				            cancelBtnText:"取消",
				            sure:function(){
				            	wx.closeWindow();
				            },
				     
						    });
					},
				})
			
			// }
			// else{
			// 	$("#shareit").show();
			// }
		},
		// 点赞
		favor: function(index){
			if(app.rankList[index].thumb_up){
				cancelFavorUserOther(index);
			}else{
				favorUserOther(index);
			}
		},
		showRules: function(type) {
			MtaH5.clickStat('classDetail_KDM');
			this.rulesHide = !type;
		},
		gotoWall: function() {
			MtaH5.clickStat('run_wall');
			window.location.href = "/page/team/wall?id=" + this.classInfo.id;
		},
		//排行榜
		gotoRankList: function() {
			MtaH5.clickStat('rankList');
			window.location.href = "/page/rank?id=" + this.classInfo.id;
		},
		//创建跑班
		gotoCreateClass: function() {
			MtaH5.clickStat('classDetail_createClass');
			window.location.href = "/page/team/creation";
		},
		
		//平台介绍
		gotoIntroUs: function() {
			MtaH5.clickStat('classDetail_introduction');
			window.location.href = "https://mp.weixin.qq.com/s/8HYD_gw-tdLf3lpqWio4aQ";
		},
		joinClass: function(type) {
			if (type == 'continue') {
				MtaH5.clickStat('classDetail_continue');
				this.isContinue = true;
				if (this.classInfo.last_date.split(" ")[0] < this.classInfo.whole_start_date) {
					this.payStep = 2;
					app.chooseType = 'nextWeek';
					getMoneyInfo(this.classInfo.whole_start_date, app.chooseType);
				}
				$(".bottom-pop").addClass("active");
				$(".content").addClass('ios-blur');
			} else if (type == 'normal') {
				MtaH5.clickStat('classDetail_joinclass');
				if (this.classInfo.need_cut) {
					this.dayType = "cut";
					if (addByTransDate(this.classInfo.team_cycle.start_date, 6) == getToday()) {
						this.dayType = "last";
					}
				} else {
					if (this.classInfo.team_cycle.start_date == getToday()) {
						this.dayType = "first";
					} else if (addByTransDate(this.classInfo.team_cycle.start_date, 6) == getToday()) {
						this.dayType = "last";
					} else if (this.classInfo.team_cycle.start_date > getToday()) {
						this.dayType = "unstart";
						this.payStep = 2;
						getMoneyInfo(this.classInfo.team_cycle.start_date);
					}
				}
				$(".bottom-pop").addClass("active");
				$(".content").addClass('ios-blur');
			}
		},
		hidePop: function() {
			$(".bottom-pop").removeClass("active");
			$('.choose-radios').removeClass('active');
			$(".content").removeClass('ios-blur');
			this.payStep = 1;
			this.chooseStartDay = '';
			this.firstTotalMoney = 0;
			this.totalMoney = 0;
			this.addWeek = 0;
			this.week = this.minWeek;
		},
		joinAndPay: function() {
			this.payStep = 2;
			//console.log(this.chooseStartDay);
		},
		preStep: function() {
			this.payStep = 1;
		},
		useRoAccount: function() {
			$("#use-ro-account").toggleClass('active');
			if (app.accountInfo.money >= app.totalMoney && $('#use-ro-account').attr('class').indexOf('active') != -1) {
				this.useWeipay = false;
			} else {
				this.useWeipay = true;
			}
		},
		changeWeek: function(number) {
			if (number == "-1") {
				if (this.week > this.minWeek) {
					this.week = this.week + number;
					this.addWeek = this.addWeek + number;
				}
			} else {
				this.week = this.week + number;
				this.addWeek = this.addWeek + number;
			}

			app.planeFinishDay = addByTransDate(this.moneyInfo.finish_date, this.addWeek * 7);
			changeMoney();
		},
		weiPay: function() {
			//微信支付
			getOrderId();
		},
		showPay: function(){

		},
		hidePay: function(){
			$(".bottom-pay-pop").removeClass('show');
		},
		startRunAlert: function(){
			Alert.show({
				content: "选择后需从开跑日期（含当天）按要求开始打卡"
			});
		},
		pay: function(){
			app.payStep = 2;
		},
		shareCalss: function(){
			MtaH5.clickStat('shareClass_button');
			$("#shareit").show();
		}
	}
});

Vue.filter('waitDay', function(value) {
	if (value != null && value != '') {
		return DateDiff(value, getToday());
	} else {
		return '--';
	}
});

Vue.filter('preDate', function(value) {
	if (value != null && value != '') {
		return addByTransDate(value, -1);
	} else {
		return '--';
	}
});

Vue.filter('nextDate', function(value) {
	if (value != null && value != '') {
		return addByTransDate(value, 1);
	} else {
		return '--';
	}
});

Vue.filter('finishDate', function(value) {
	if (value != null && value != '') {
		return addByTransDate(value, 6);
	} else {
		return '--';
	}
});

Vue.filter('yearCutChinese', function(value) {
	if (value != null && value != '') {
		var arr = value.split(" ")[0].split("-");
		return parseInt(arr[1]) + "月" + parseInt(arr[2]) + "日";
	} else {
		return '--';
	}
});

$(function() {
	getList(urlInitRankList);
	getConfig();

	wx.config({
		debug: false,
		appId: app.jsSdK.appId, // 必填，公众号的唯一标识
		timestamp: app.jsSdK.timestamp, // 必填，生成签名的时间戳
		nonceStr: app.jsSdK.nonceStr, // 必填，生成签名的随机串
		signature: app.jsSdK.signature, // 必填，签名，见附录1
		jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});

	getInfo();
   
     //分享班级
 //     $(".money").on("click", function() {
	// 	$("#shareit").show();
	// });
	//关闭分享班级
	$(".btn-close").on("click", function() {
		$("#shareit").hide();
	});

	//选择周期
	$(".bottom-pop").on("click", ".choose-radios", function() {
		$(this).addClass("active").siblings(".choose-radios").removeClass("active");
		getMoneyInfo($(this).attr("choose-day"), $(this).attr("choose-type"));
	});
});

function getInfo() {
	$.ajax({
		url: urlGetClassInfo + "/" + id,
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
				app.classInfo = data.data;
				app.perWeekMoney = app.classInfo.money * app.classInfo.duration;
				var oneLeft = $("#icon-peolple").css("width").replace('px', '') / 7;
				var iconPeopleLeft = 0;
				for (var i = 0; i < 7; i++) {
					if (i <= DateDiff(getToday(), app.classInfo.team_cycle.start_date)) {
						app.finishedDay.push({
							finished: true,
							date: addByTransDate(app.classInfo.team_cycle.start_date,i)
						});
						iconPeopleLeft += oneLeft;
					} else {
						app.finishedDay.push({
							finished: false,
							date: addByTransDate(app.classInfo.team_cycle.start_date,i)
						});
					}
				}
				if (iconPeopleLeft != 0) {
					iconPeopleLeft = iconPeopleLeft - oneLeft / 2 - 5;
				}
				$('#icon-peolple').css('padding-left', iconPeopleLeft);

				if (app.classInfo.monitor.id == app.classInfo.user.id) {
					app.isMonitor = true;
				}

				if (type == "joinClass") {
					app.showCode();
				}

				app.shareData = {
					appid: app.jsSdK.appId,
					imgUrl: (app.classInfo.avatar ? app.classInfo.avatar : 'https://www.runorout.cn/images/photo.png').replace("https", "http"),
					link: ("https://www.runorout.cn/page/team/detail?ADTAG=bjlj&id=" + id),
					title: (app.classInfo.monitor.name ? app.classInfo.monitor.name : app.classInfo.name.replace("的跑班", "")) + "，" + (app.classInfo.monitor.introduction ? app.classInfo.monitor.introduction : "") + "邀你加入[" + app.classInfo.name + "]跑班",
					desc: (app.classInfo.participation_user ? app.classInfo.participation_user.length : 0) + "名跑友将在" + DateDiff(app.classInfo.team_cycle.finish_date, getToday()) + "天后均分契约金池" + (app.classInfo.total_contrast / 100) + "元 | 不跑就出局"
				};

				app.shareDataTimeLine = {
					appid: app.jsSdK.appId,
					imgUrl: (app.classInfo.avatar ? app.classInfo.avatar : 'https://www.runorout.cn/images/photo.png').replace("https", "http"),
					link: ("https://www.runorout.cn/page/team/detail?ADTAG=bjlj&id=" + id),
					title: (app.classInfo.monitor.name ? app.classInfo.monitor.name : app.classInfo.name.replace("的跑班", "")) + "，在不跑就出局创建了[" + app.classInfo.name + "]跑班，" + "实时契约金" + ((app.classInfo.total_contrast / 100)) + "元"

				};

				wx.ready(function() {
					wx.onMenuShareAppMessage(app.shareData);
					wx.onMenuShareTimeline(app.shareDataTimeLine);
				
				});

			}
		},
		error: function() {
			Alert.show({
				content: "加载班级信息失败，请重试",
				type: "alert",
				sureBtnText: "刷新一下",
				sure: function() {
					window.location.reload();
				}
			})
		}
	});
}

function getMoneyInfo(startDate, choosedType) {
	var cycle = app.classInfo.cut_required_cycle;
	if (app.dayType == 'first' && choosedType == 'tomorrow') {
		cycle = app.classInfo.required_cycle2;
	} else if (app.dayType == 'first' && choosedType == 'today') {
		cycle = app.classInfo.required_cycle;
	} else if (app.dayType == 'unstart') {
		cycle = app.classInfo.cycle;
	} else {
		if (choosedType == 'nextWeek') {
			cycle = app.classInfo.cycle;
		} else if (choosedType == 'tomorrow') {
			cycle = app.classInfo.cut_required_cycle2;
		}
	}

	var product = {
		team_id: id,
		cycle: cycle,
		start_date: startDate
	};
	$.ajax({
		url: urlGetOrderMoney,
		type: "get",
		async: true,
		data: {
			type: "flexible_participation",
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
			//console.log(data);
			if (data.status == 200) {
				app.moneyInfo = data.data;
				app.minWeek = data.data.min_cycle;
				app.week = data.data.min_cycle;
				app.totalMoney = data.data.price;
				app.firstTotalMoney = data.data.price;
				setTimeout(function() {
					app.chooseStartDay = startDate;
					app.chooseType = choosedType;
				}, 0);
				// if((dayType=='first'&&chooseType=='today')||(dayType=='last'&&chooseType=='tomorrow')||(dayType=='cut'&&chooseType=='nextWeek')){
				// 	app.isCut = false;
				// }else{
				// 	app.isCut = true;
				// }
				app.planeFinishDay = app.moneyInfo.finish_date;
				getUserAccountMoney();
			}
		},
		error: function() {
			Alert.show({
				content: "加载金额失败，请重试",
				type: "alert",
				sureBtnText: "确定",
				sure: function() {
					app.hidePop();
				}
			})
		}
	})
}

function getUserAccountMoney() {
	$.ajax({
		url: urlGetUserAccoutMoney,
		type: "get",
		async: true,
		dataType: "json",
		success: function(data) {
			if (data.status == 0) {
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

function changeMoney() {
	app.totalMoney = app.firstTotalMoney + app.perWeekMoney * app.addWeek;
	if (app.accountInfo.money >= app.totalMoney && $('#use-ro-account').attr('class').indexOf('active') != -1) {
		app.useWeipay = false;
	} else {
		app.useWeipay = true;
	}
}

function getOrderId() {
	var product = {
		team_id: id,
		cycle: app.week,
		start_date: app.chooseStartDay
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
				app.orderId = data.data.order_no;
				if (app.accountInfo.money >= app.totalMoney && $('#use-ro-account').attr('class').indexOf('active') != -1) {
					payByAccount();
					this.useWeipay = false;
				} else {
					useWeiPay();
					this.useWeipay = true;
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

function useWeiPay() {
	//调用微信支付
	var turelyMoney = 0;
	if ($('#use-ro-account').attr('class').indexOf('active') == -1) {
		turelyMoney = app.totalMoney;
	} else {
		turelyMoney = app.totalMoney - app.accountInfo.money;
	}

	$.ajax({
		url: urlGetWeiPayId,
		type: "post",
		async: true,
		data: {
			order_no: app.orderId,
			money: turelyMoney
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
							content: "支付成功!",
							type: "alert",
							sureBtnText: "确定",
							sure: function() {
								window.location.href = '/page/team/detail?id=' + id + "&type=joinClass" + (referee ? ("&referee=" + referee) : "");
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
	$.ajax({
		url: urlPayByAccount,
		type: "post",
		async: true,
		data: {
			order_no: app.orderId,
			money: app.totalMoney
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
					content: "支付成功!",
					type: "alert",
					sureBtnText: "确定",
					sure: function() {
						window.location.href = '/page/team/detail?id=' + id + "&type=joinClass" + (referee ? ("&referee=" + referee) : "");
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

//新版支付
function getStartDateList(){
	
}
//排行榜
function getList(url){
	// console.log(id);
	$.ajax({
		url: url ,
		type: "get",
		async: true,
		data:{
			team_id:id,
		},
		dataType: "json",
		beforeSend:function(){
			$("#loadingToast").show();
		},
		complete:function(){
			$("#loadingToast").hide();
		},
		success:function(data){
			
			if(data.status == 200){
				 
					app.class = data.data.team;
					app.class.team_id = id;
				
					if(data.data.rank_list.length>5){
						for(var i=0;i<5;i++){
						app.rankList.push(data.data.rank_list[i]);	
						}
					}else{
						app.rankList=data.data.rank_list;
					} 

					if(data.data.rank_list.length>5){
						if(data.data.rank_list.length<=11){
							for(var i=5;i<data.data.rank_list.length;i++){
								app.rankListImg.push(data.data.rank_list[i]);
							}
						}else{
							for(var i=5;i<11;i++){
								app.rankListImg.push(data.data.rank_list[i]);
							}
						}
					} 
					app.totalRank=data.data.rank_list.length;
		          
		          }
		      },
		error: function(){
			
			getList(urlClassRankList);
			netWorkError();
		}

	})
}
//点赞
function favorUserOther(index){
	$.ajax({
		url: urlFavorUser,
		type: "post",
		async: true,
		data:{
			id:app.rankList[index].id
			
		},
		dataType: "json",
		beforeSend:function(){
			$("#loadingToast").show();
		},
		complete:function(){
			$("#loadingToast").hide();
		},
		success:function(data){
			if(data.status == 200){
				app.rankList[index].thumb_up_count = app.rankList[index].thumb_up_count + 1;
				app.rankList[index].thumb_up = true;
				if(app.user){
					if(app.rankList[index].id==app.user.id){
						app.user.thumb_up_count = app.user.thumb_up_count + 1;
						app.user.thumb_up = true;
					}
				}
			}
		},
		error: function(){
			Alert.show({
		        content: "网络连接失败，请重试",
		        type: "alert",
		    });
		}
	})
}
function cancelFavorUserOther(index){
	$.ajax({
		url: urlCancelFavor,
		type: "post",
		async: true,
		data:{
			id:app.rankList[index].id
			
		},
		dataType: "json",
		beforeSend:function(){
			$("#loadingToast").show();
		},
		complete:function(){
			$("#loadingToast").hide();
		},
		success:function(data){
			if(data.status == 200){
				app.rankList[index].thumb_up_count = app.rankList[index].thumb_up_count - 1;
				app.rankList[index].thumb_up = false;
				if(app.user){
					if(app.rankList[index].id==app.user.id){
						app.user.thumb_up_count = app.user.thumb_up_count - 1;
						app.user.thumb_up = false;
					}
				}
			}
		},
		error: function(){
			Alert.show({
		        content: "网络连接失败，请重试",
		        type: "alert",
		    });
		}
	})
}
Vue.filter('backgroundColor', function (value) {
	//console.log(value)
	var color = "";
    if(value < 5 && value > 0){
    	color = "#59ba3a";
    }else if(value >= 5 && value < 10){
    	color = "#3d9fe6";
    }else if(value >= 10 && value < 21){
    	color = "#ea8c2e";
    }else if(value >= 21 && value < 41){
    	color = "#f14246";
    }else if(value >= 41 && value < 99){
    	color = "#8d4bbb";
    }else if(value >= 99){
    	color = "#b8a027";
    }else if(value == null){
    	color = "#fff";
    }else{
    	color = "#c8c8c8";
    }
    return color;
});

Vue.filter('cutDateToDay', function (value) {
	//console.log(value)
	var arr = value.split('-');
    return arr[2];
});
