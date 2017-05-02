var Alert = require('../../../modules/alert.js');
var app = new Vue({
	el: '#house-success',
	data: {
		
	},
	methods: {
		invite: function(){
			$.ajax({
				url: '/ajax/fangduoduo/share',
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
					Alert.show({
				        content: "一键约跑活动邀请卡已发送，好友扫码可一键报名参赛，去微信号查看邀请卡吧!",
				        sure: function(){
				        	WeixinJSBridge.call('closeWindow');
				        }
				    });
				},
				error:function(){
					Alert.show({
				        content: "一键约跑活动邀请卡已发送，好友扫码可一键报名参赛，去微信号查看邀请卡吧!",
				        sure: function(){
				        	WeixinJSBridge.call('closeWindow');
				        }
				    });
				}
			});
		},
		closePage: function(){
			var timestamp=new Date().getTime();
			window.location.href = "/page/activity/fangduoduo?time=" + timestamp;
		}
	}
})
$(function(){
	
})