var Alert = require('../modules/alert.js');
var app = new Vue({
	el:"#bureau-city-v",
	data:{
		headGuide:1,
		EranPoint:null,
		pointTally:null,
		itemList:null,
		count: 0,
		timestamp: 0
	},
/*	methods:{
		ticket:function(){
			$(".bureau-city-second").hide();
			$(".bureau-city-three").hide();
			$(".bureau-city-one").show();
		},
		Earn-ticket:function(){
			
		},
		ticket-Record:function(){
			$(".bureau-city-one").hide();
			$(".bureau-city-second").hide();
			$(".bureau-city-three").hide();
		}
	}*/
});
//赚局票
$(".bureau-city-fixed").find(".guide").each(function(index) {
		$(this).on("click", function(){
			app.headGuide = index + 1;
			if(app.headGuide==1){
				getItemList();
			}else if(app.headGuide==2){
				getTicket();
			}else{
				getRecord();
			}
		})

	});
//赚局票
function getTicket(){
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
				app.EranPoint=data.data.point_task.finished_point_task.concat(data.data.point_task.active_point_task);
			}
		},
		error: function(){
			Alert.show({
		        content: "哎呀，获取信息失败了，请重试",
		        type: "alert",
		        sureBtnText: "刷新一下",
		        sure: function(){
		            window.location.reload();
		        }
		    });
		}
	})
}
//获取局票记录
function getRecord(){
	$.ajax({
		url: urlPointTally,
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
				if(data.data.point_tally.length != 0){
					if(app.pointTally == null){
						app.pointTally = data.data.point_tally;
					}else{
						app.pointTally = app.pointTally.concat(data.data.point_tally);
					}
				}
			}
		},
		error: function(){
			Alert.show({
		        content: "哎呀，获取信息失败了，请重试",
		        type: "alert",
		        sureBtnText: "刷新一下",
		        sure: function(){
		            window.location.reload();
		        }
		    });
		}
	})
}
$(function(){
	getItemList();
})
//局市
function getItemList(){
	$.ajax({
		url: urlShop,
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
			
			if(data.status == 0){
				app.itemList=data.data;
				console.info(data.data);
			}
		},
		error: function(){
			Alert.show({
		        content: "哎呀，获取信息失败了，请重试",
		        type: "alert",
		        sureBtnText: "刷新一下",
		        sure: function(){
		            window.location.reload();
		        }
		    });
		}
	})
}
