var Alert = require('../modules/alert.js');
var app = new Vue({
	el: '#my-class-v',
	data: {
		closeTime: 150,//选择后保持时间
		currentClass:null,
		finishClass:null,
		currentCount:0,
		actCount:0,
		count:10,
		timestamp:0,
		pendingCount:0,
		historyCount:0,
		Fcount:0,
		finishedClass:[],
		nowClass: null,//当前	
		pendingClass: null,//待开始
		activities: null,//活动
		isShow:true,
	},
	methods: {
	}
});

$(function() {
	getInfo();
});

function getInfo() {
	$.ajax({
		url: urlGetMyClass,
		type: "get",
		async: true,
		dataType: "json",
		data:{
			count: app.count,
			timestamp: app.timestamp
		},
		beforeSend:function(){
			$("#loadingToast").show();
		},
		complete:function(){
			$("#loadingToast").hide();
		},
		success:function(data){
			if(data.status == 200){
				//正在参加
				app.nowClass=data.data.active;
				if(data.data.active){
					for(var i=0;i<app.nowClass.length;i++){
						if(app.nowClass[i].type=='activity'){
							$('#isActivity').removeClass('myclass-content').addClass('myclass-content triangle-topleft');
						}
					}
				}
				
				//历史记录
				app.finishedClass=app.finishedClass.concat(data.data.finished);
				if(data.data.finished){
					if(data.data.finished.length==10){
						app.Fcount=data.data.total-app.finishedClass.length;
						/*document.getElementById("request-more").style.display="";*/
					}else{
						/*document.getElementById("request-more").style.display="none";*/
						app.isShow=false;
					}
				}else{
					app.isShow=false;
					/*document.getElementById("request-more").style.display="none";*/
				}
				
				
				
				//用于分页
				app.timestamp = data.data.timestamp;
				if(data.data.teams==null||data.data.teams==""){
					app.hasMore = false;
				}else{
					app.hasMore = true;
					app.historyList = app.historyList?app.historyList.concat(data.data.teams):data.data.teams;
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

Vue.filter('status', function(value){
	if(value=='active'){
		value='进行中';
	}else if(value=='pending'){
		value='待开始';
	}else{
		value='已结束';
	}
	return value;
});
