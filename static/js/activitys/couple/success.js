var Alert = require('../../../modules/alert.js');
var app = new Vue({
	el: '#pay-success',
	data: {
		jsSdK: null,
		user: null,
		couple: null,
		team: null,
	},
	methods: {
		sendInvite : function(){
			$("#shareit").show();
		}
	}
})
$(function(){
	getConfig();
	getInfo();

	$("#shareit").on("click",function(){
		$("#shareit").hide();
	})

	$("#rules").on("click", function(){//打开规则
		$(".rules-page").show();
	})

	$(".icon-guanbi1").on("click", function(){//关闭规则
		$(".rules-page").hide();
	})

	wx.config({
        debug: false,
        appId: app.jsSdK.appId, // 必填，公众号的唯一标识
        timestamp: app.jsSdK.timestamp, // 必填，生成签名的时间戳
        nonceStr: app.jsSdK.nonceStr, // 必填，生成签名的随机串
        signature: app.jsSdK.signature,// 必填，签名，见附录1
        jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
});

function getInfo(){
	$.ajax({
		url: "https://www.runorout.cn/init/activity/couple/success",
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
				app.user = data.data.user;
				app.couple = data.data.couple;
				app.team = data.data.team;
				app.shareData = {
		            appid: app.jsSdK.appId,
		            imgUrl: ("https://www.runorout.cn/images/couple.jpg").replace("https","http"),
		            link: ("https://www.runorout.cn/page/pay/couple_join?id=" + app.team.id + "&invite=" + app.user.id),
		            title: app.user.nickname+"向你发出一个爱的邀请",
		            desc: "我想和你一起跑，让我们的爱永不止步"
		        };

		        wx.ready(function(){
			        wx.onMenuShareAppMessage(app.shareData);
			    });
			}else{
				Alert.show({
			        content: data.message,
			        type: "alert",
			    })
			}
		},
		error: function(){
			Alert.show({
		        content: "活动加载失败，请重试",
		        type: "alert",
		    })
		}
	})
}

function getConfig(){
    $.ajax({
		url: urlGetConfig,
		type: "get",
		async: false,
		dataType: "json",
		data: {
			url: location.href.split('#')[0]
		},
		success:function(data){
			app.jsSdK = data;
		}
	})
}