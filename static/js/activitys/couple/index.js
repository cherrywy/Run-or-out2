var Alert = require('../../../modules/alert.js');
var app = new Vue({
	el: '#couple-index',
	data: {
		jsSdK: null,
		user: null,
		team: null,
	},
	methods: {
		
	}
})
$(function(){
	getConfig();
	getInfo();
	$(".block").on("click",".choose-item",function(){
		$(this).addClass('active').siblings().removeClass('active');
	})

	$("#rules").on("click", function(){//打开规则
		$(".rules-page").show();
	})

	$(".icon-guanbi1").on("click", function(){//关闭规则
		$(".rules-page").hide();
	})

	// wx.config({
 //        debug: false,
 //        appId: app.jsSdK.appId, // 必填，公众号的唯一标识
 //        timestamp: app.jsSdK.timestamp, // 必填，生成签名的时间戳
 //        nonceStr: app.jsSdK.nonceStr, // 必填，生成签名的随机串
 //        signature: app.jsSdK.signature,// 必填，签名，见附录1
 //        jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
 //    });

});

function getInfo(){
	$.ajax({
		url: "https://www.runorout.cn/init/activity/couple",
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
				app.team = data.data.team;

				app.shareData = {
		            appid: app.jsSdK.appId,
		            imgUrl: ("https://www.runorout.cn/images/couple.jpg").replace("https","http"),
		            link: ("https://www.runorout.cn/page/activity/couple"),
		            title: "情侣跑 - 不跑就出局",
		            desc: "加入七夕情侣跑，跑步又脱单"
		        };

		        app.shareDataTimeLine = {
		            appid: app.jsSdK.appId,
		            imgUrl: ("https://www.runorout.cn/images/couple.jpg").replace("https","http"),
		            link: ("https://www.runorout.cn/page/activity/couple"),
		            title: "加入七夕情侣跑，跑步又脱单"
		
		        };

		        wx.ready(function(){
			        wx.onMenuShareAppMessage(app.shareData);
					wx.onMenuShareTimeline(app.shareDataTimeLine);
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

function join(){
	if(!app.user.participate){
		var teamId = $(".choose-item.active").attr("data-team-id");
		var timestamp=new Date().getTime();
		window.location.href = "https://www.runorout.cn/page/pay/couple_pay?id=" + teamId + "&time=" + timestamp;
	}
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