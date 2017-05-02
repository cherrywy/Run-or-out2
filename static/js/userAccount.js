var Alert = require('../modules/alert.js');
var app = new Vue({
	el: '#user-account-v',
	data: {
		closeTime: 150,//选择后保持时间
		info: null,
		money: '',
		jsSdK: null
	},
	methods: {
		gotoWechat: function(){
			WeixinJSBridge.call('closeWindow');
		}
	}
})

$(function(){
	
	getConfig();
	wx.config({
		debug: false,
		appId: app.jsSdK.appId, // 必填，公众号的唯一标识
		timestamp: app.jsSdK.timestamp, // 必填，生成签名的时间戳
		nonceStr: app.jsSdK.nonceStr, // 必填，生成签名的随机串
		signature: app.jsSdK.signature, // 必填，签名，见附录1
		jsApiList: ['chooseImage', 'previewImage','uploadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
	
	wx.ready(function(){
		wx.hideOptionMenu();
	});
	
	getInfo();
	$("#success-pop").on("click",".bg",function(){
		$("#success-pop").hide();
	});
	
	$("#AccountTixian").on("click",function(){
		MtaH5.clickStat('AccountTixian');
		withdraw();
	});
})

function withdraw(){
	if(!app.money){
		return false;
	}
	var money = $("#money").val().trim();
	if(money==null||money==""){
		Alert.show({
	        content: "请输入提现金额",
	        type: "alert",
	    })
		return false;
	}

	if(!checkMoney(money)){
		Alert.show({
	        content: "金额不正确，最多为两位小数",
	        type: "alert",
	    })
		return false;
	}

	if(money < 1){
		Alert.show({
	        content: "因微信限制,最少提现金额为1元",
	        type: "alert",
	    })
		return false;
	}

	if(money > 200){
		Alert.show({
	        content: "因微信限制超过200元需分多次提现",
	        type: "alert",
	    })
		return false;
	}

	if(parseInt(money*100) > app.info.user_account.money){
		Alert.show({
	        content: "账户余额不足!",
	        type: "alert",
	    })
		return false;
	}

	$.ajax({
		url: urlWithdraw,
		type: "post",
		async: true,
		dataType: "json",
		data:{
			money: money*100
		},
		beforeSend:function(){
			$("#loadingToast").show();
		},
		complete:function(){
			$("#loadingToast").hide();
		},
		success:function(data){
			if(data.status == 200){
				$("#success-pop").show();
				getInfo();
			}else{
				Alert.show({
			        content: data.data.wechat_err_code_des,
			        type: "alert",
			    })
			}
		},
		error: function(){
			Alert.show({
		        content: "Run妹去银行了，请稍后再试，很快就好",
		        type: "alert",
		    })
		}
	})
}

function getInfo(){
	$.ajax({
		url: urlGetAccoutInfo,
		type: "get",
		async: true,
		dataType: "json",
		beforeSend:function(){
			$("#loadingToast").show();
		},
		complete:function(){
			$("#loadingToast").hide();
		},
		success:function(data){
			if(data.status == 200){
				app.info = data.data;
			}
		},
		error: function(){
			Alert.show({
		        content: "用户信息加载失败，请重试或联系Run妹",
		        type: "alert",
		        sure: function(){
		            window.location.reload();
		        }
		    })
		}
	})
}

function showDeal(){
	$("#deal").addClass("show");
}
function hideDeal(){
	$("#deal").removeClass("show");
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