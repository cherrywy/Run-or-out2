var Alert = require('../../modules/alert.js');
var app = new Vue({
	el:"#bureau-city-v",
	data:{
		headGuide:getLocalStorage("list")?getLocalStorage("list"):"1",
		EranPoint:null,
		pointTally:null,
		itemList:null,
		list:getLocalStorage("list")?getLocalStorage("list"):"1",
		isMoreshow:false,
		surplus:0,
		money:0,
		help:false,
		count: 10,
		timestamp: 0
	},
	methods:{
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
		checkWork:function(){
			Alert.show({
		        content: "每查5人作业奖1局票，每日最多获得10局票，查作业不足5人无局票奖励",
		        sureBtnText: "我知道了",
		    });
		}
	}
});

//赚局票
$(".bureau-city-fixed").find(".guide").each(function(index) {
		$(this).on("click", function(){
			app.headGuide = index + 1;
			if(app.headGuide==1){
				getItemList();
			}else if(app.headGuide==2){
				MtaH5.clickStat('EranTable');
				getTicket();
			}else{
				MtaH5.clickStat('ticketRecord');
				getRecord(0);
			}
			app.list=app.headGuide;
			setLocalStorage("list",app.list);
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
function getRecord(value){
	//value定义两种状态 0：刚进入页面时的加载  1： 点击加载更多
	$.ajax({
		url: urlPointTally,
		type: "get",
		async: true,
		data:{
			count:10,
			timestamp:app.timestamp
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
				app.timestamp=data.data.timestamp;
				if(data.data.point_tally.length!=0){	
					if(data.data.point_tally.length<10){
						app.isMoreshow=false;
					}else{
						app.isMoreshow=true;
					}
					//第一次进入页面加载
					if(value==0){
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
	getMoney();
	if(app.list==1){
		getItemList();
	}else if(app.list==2){
		getTicket();
	}else if(app.list==3){
		getRecord(0);
	}else{
		getItemList();
	}
})

function getMoney(){
	$.ajax({
		type:"get",
		url:urlGetUserAccoutMoney,
		async:true,
		dataType: "json",
		beforeSend:function(){
			$("#loadingToast").show();
		},
		complete:function(){
			$("#loadingToast").hide();
		},
		success:function(data){
			if(data.status==0){
				app.money=data.data.point;
			}
		}
	});
}
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
			}else{
				Alert.show({
				    content: data.message,
					type: "alert"
				});
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
function savePositionAndType() {
    setLocalStorage("list", app.list);
}
