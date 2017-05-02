var Alert = require('../modules/alert.js');
var app = new Vue({
	el: '#check-work-v',
	data: {
		closeTime: 150, //选择后保持时间
		signIn: null, //打卡信息
		team: null, //班级信息
		showRule: false, //是否展示规则
		channels: null, //类型集合
		nowChannel: 0,
		hasSignIn: false, //是否还有作业
		loading: false, //加载页面
		user: null, //被查者信息
		history: null, //检查历史
		historyIndex: 0, //当前历史
		waitTime: 60,
		canStartTime: true, //是否可以开始计时，开始计时则不再次触发
	},
	methods: {
		showRules: function() {
			this.showRule = true;
		},
		hideRules: function() {
			this.showRule = false;
			location.hash = '';
		},
		prevSign: function() {
			if (this.history) {
				this.historyIndex++;
				if (this.historyIndex < this.history.length) {
					if (app.canStartTime) {
						time();
					}
					initHistory(this.history[this.historyIndex]);
				} else {
					this.historyIndex = this.history.length - 1;
				}
			}
			//console.log("prev---->"+this.historyIndex+" , "+this.history.length);
		},
		nextSign: function() {
			if (this.history && this.historyIndex > 0) {
				this.historyIndex--;
				initHistory(this.history[this.historyIndex]);
			}
			//console.log("next---->"+this.historyIndex+" , "+this.history.length);
		},
		showNopass: function() {
			if (!app.hasSignIn) {
				return false;
			}
			$("#no-pass-pop").show();
			$("body").addClass("overflow-hidden");
		},
		hideNoPass: function() {
			$("#no-pass-pop").hide();
			$("body").removeClass("overflow-hidden");
		}
	}
});

location.hash = '';

$(window).on('hashchange', function() {
	var hash = location.hash.split("#")[1];
	if (hash == 'showRules') {
		app.showRules();
	} else {
		app.hideRules();
	}
});

$(function() {
	getChannel();
	//选择不通过理由
	$("#no-pass-pop").on("click", ".reason", function() {
		$(this).addClass("active").siblings(".reason").removeClass("active");
	});

	//关闭所有页面
	$(".pop-out-mask").on("click", function() {
		$("#check-rules").hide();
		$("#no-pass-pop").hide();
		$("body").removeClass("overflow-hidden");
	});

	$(".check-work-head").on("click", ".check-head-item-list", function() {
		$(".check-head-item-list").removeClass('active');
		$(this).addClass('active');
		app.nowChannel = $(this).parent().index();
		init();
		updateChannel();
	});
});

function previewImg() {
	// var url = $("#work-img").attr("src");
	// if(app.hasSignIn){
	// 	wx.previewImage({
	// 	    current: url, // 当前显示图片的http链接
	// 	    urls: [url] // 需要预览的图片http链接列表
	// 	});
	// }
}

function getChannel() {
	$.ajax({
		url: urlCheckSignInInit,
		type: "get",
		async: false,
		dataType: "json",
		success: function(data) {
			if (data.status == 0) {
				app.channels = data.data.channels;
				if (app.channels && app.channels.length != 0) {
					setTimeout(function() {
						$("#owl-info-list").owlCarousel({
							margin: 0,
							loop: false,
							autoWidth: true,
							items: 2
						});
					}, 0);

					for (var i = 0; i < app.channels.length; i++) {
						if (app.channels[i].count != 0) {
							app.nowChannel = i;
							setTimeout(function() {
								$('.check-head-item-list').removeClass('active');
								$('.owl-item:eq(' + i + ')').find('.check-head-item-list').addClass('active');
							}, 50)
							init();
							break;
						} else {
							app.hasSignIn = false;
							app.loading = false;
						}
					}

				} else {
					Alert.show({
						content: '陛下需先报名班级且班级已开跑才可审查作业',
						sureBtnText: '朕知道了'
					});
				}
			} else {
				Alert.show({
					content: data.message
				});
			}
		},
		/*error: function() {
			Alert.show({
				content: "哎呀，作业分配机器人冒烟儿了，请重试",
				type: "alert",
				sureBtnText: "刷新一下",
				sure: function() {
					window.location.reload();
				}
			});
		}*/
	});
}

function updateChannel() {
	$.ajax({
		url: urlCheckSignInInit,
		type: "get",
		async: true,
		dataType: "json",
		success: function(data) {
			if (data.status == 0) {
				app.channels[app.nowChannel].count = data.data.channels[app.nowChannel].count;
			} else {
				Alert.show({
					content: data.message
				});
			}
		}
	});
}

function init() {
	app.canStartTime = true;
	$.ajax({
		url: urlGetAjaxCheckSignIn + '/' + app.channels[app.nowChannel].id,
		type: "get",
		async: true,
		dataType: "json",
		beforeSend: function() {
			app.loading = true;
			$("#loadingToast").show();
		},
		complete: function() {
			app.loading = false;
			$("#loadingToast").hide();
		},
		success: function(data) {
			if (data.status == 0) {
				if (data.data.length == 0) {
					app.hasSignIn = false;
				} else {
					app.hasSignIn = true;
					app.signIn = data.data.signIn;
					app.team = data.data.team;
					app.user = data.data.user;
					app.history = data.data.history;
					app.historyIndex = 0;
				}
			} else {
				if (data.status == '40006') {
					app.hasSignIn = false;
					app.signIn = null;
					app.team = null;
					app.user = null;
					app.history = null;
					app.historyIndex = 0;
				}
				// Alert.show({
				//        content: data.message
				//    });
			}
		},
		error: function() {
			Alert.show({
				content: "哎呀，作业分配机器人冒烟儿了，请重试",
				type: "alert",
				sureBtnText: "刷新一下",
				sure: function() {
					window.location.reload();
				}
			});
		}
	})
}

function initHistory(signInId) {
	$.ajax({
		url: urlGetAjaxCheckSignInHistory + '/' + signInId,
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
			if (data.data.length == 0) {
				app.hasSignIn = false;
			} else {
				app.hasSignIn = true;
				app.signIn = data.data.signIn;
				app.team = data.data.team;
				app.user = data.data.user;
			}
		},
		error: function() {
			Alert.show({
				content: "哎呀，作业分配机器人冒烟儿了，请重试",
				type: "alert",
				sureBtnText: "刷新一下",
				sure: function() {
					window.location.reload();
				}
			});
		}
	})
}

function checkWork(type) {
	
	if (!app.hasSignIn) {
		return false;
	}
	var message = "";
	if (type == "pass") {
		MtaH5.clickStat('checkRunWork_pass');//通过
	} else if (type == "reject") {
		MtaH5.clickStat('checkRunWork_reject');//不通过-理由-确定
		if ($(".reason.active textarea")[0]) {
			message = $(".reason.active textarea").val();
			if (message == "" || message == null) {
				Alert.show({
					content: "请填写不予通过理由"
				});
				return false;
			}
		} else {//跳过
			
			message = $("#no-pass-pop").find(".active").html();
			if (message == null || message == '') {
				Alert.show({
					content: "请选择不予通过理由"
				});
				return false;
			}
		}
	} else if (type == "ignore") {
		MtaH5.clickStat('checkRunWork_ignore');
		message = "";
	}
	$.ajax({
		url: urlJudgmentSignIn + "/" + app.signIn.id,
		type: "post",
		async: true,
		dataType: "json",
		data: {
			action: type,
			message: message
		},
		beforeSend: function() {
			$("#loadingToast").show();
		},
		complete: function() {
			$("#loadingToast").hide();
			app.hideNoPass();
		},
		success: function(data) {
			if (data.status == 0) {
				updateChannel();
				if (type == 'ignore') {
					init();
				} else {
					setTimeout(function() {
						init();
						Alert.hide();
					}, 1000);

					Alert.show({
						content: "朕已阅，下一个"
					})
				}
			} else {
				Alert.show({
					content: data.message
				})
				init();
			}
		},
		error: function() {
			Alert.show({
				content: "哎呀，作业分配机器人冒烟儿了，请重试",
				type: "alert",
				sureBtnText: "刷新一下",
				sure: function() {
					init();
					Alert.hide();
				}
			})
		}
	})
}

function time() {
	app.canStartTime = false;
	if (app.waitTime == 0) {
		app.waitTime = 60;
		if (app.historyIndex != 0) {
			Alert.show({
				content: "陛下驻足时间过长，这就呈上新的作业给您审核",
				type: "alert",
				sureBtnText: "准奏",
				sure: function() {
					init();
					Alert.hide();
				}
			})
		}
	} else {
		app.waitTime--;
		setTimeout(function() {
				time();
			},
			1000)
	}
}