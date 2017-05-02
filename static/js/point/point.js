var Alert = require('../../modules/alert.js');
var app = new Vue({
	el: '#v-shop-points',
	data: {
		pointTask: null,
		userData: null,
		help: false,
	},
	methods: {
		doPointTask: function(type , url){
			if(type == 'page'){
				var timestamp=new Date().getTime();
				window.location.href = url + "?time=" + timestamp;
			}else{
				$.ajax({
					url: url,
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
							Alert.show({
						        content: data.message,
						        type: "alert"
						    });
						}else{
							Alert.show({
						        content: data.message,
						        type: "alert"
						    });
						}
					},
					error:function(){
						Alert.show({
					        content: "啊哦，出问题了，请重试",
					        type: "alert"
					    })
					}
				});
			}
		},
		showHelp: function(){
			this.help = true;
		},
		hidePop: function(){
			this.help = false;
		},
	}
});


$(function(){
	info();
});

function info(){
	$.ajax({
		url: urlPointTask,
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
				app.pointTask = data.data.point_task;
				app.userData = data.data.user_data;
			}
		},
		error:function(){
			Alert.show({
		        content: "加载积分信息失败，请重试",
		        type: "alert",
		        sureBtnText: "刷新一下",
		        sure: function(){
		            window.location.reload();
		        }
		    })
		}
	});
}