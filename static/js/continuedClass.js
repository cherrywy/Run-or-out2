var Alert = require('../modules/alert.js');

var app = new Vue({
	el: 'v-continued-class',
	data: {
		isChecked:true,
		toastText:""
	},
	methods: {

	}
});

$(function() {
	getInfo();
	
	$("#check-work-alert").on("click", function() {
		
		var isChecked = $(this).is(':checked');
		if (isChecked) {
			MtaH5.clickStat('openContinuedClass');
			changeSet(true);
			app.isChecked=true;
		} else {
			MtaH5.clickStat('closeContinuedClass');
			changeSet(false);
			app.isChecked=false;
		}
	});
});

function getInfo(){
	$.ajax({
		url: urlContinuedClass,
		type: "get",
		dataType: "json",
		beforeSend:function(){
			$("#loadingToast").show();
		},
		complete:function(){
			$("#loadingToast").hide();
		},
		success:function(data){
			if(data.status==0){
				if(data.data.autorenew){			
					$("#check-work-alert").prop("checked",true);
				}else{
					$("#check-work-alert").removeAttr("checked");
				}
				app.isChecked=data.data.autorenew;
			}
		},
		error: function(){
			Alert.show({
		        content: "哎呀，加载续班信息失败了，请重试",
		        type: "alert",
		        sureBtnText: "刷新一下",
		        sure: function(){
		            window.location.reload();
		        }
		    })
		}
	})
}

function changeSet(status){
	$.ajax({
		url:  urlContinuedClassSet,
		type: "post",
		async: true,
		data:{
			autorenew:status
		},
		dataType: "json",
		beforeSend:function(){
			$("#loadingToast").show();
		},
		complete:function(){
			$("#loadingToast").hide();
		},
		success:function(data){
			if(data.status == 0){
				if(data.data.autorenew){
					$("#tanchuang").show();
						
						setTimeout(function(){
							$("#tanchuang").hide();
						},2000);
				}else{
						$("#tanchuang1").show();
						
						setTimeout(function(){
							$("#tanchuang1").hide();
						},2000);
				}
				
			}
		},
		error: function(){
			Alert.show({
		        content: "哎呀，服务器出错了，请重新设置",
		        type: "alert",
		    })
		}
	})
}
/*function changeSet(status){
	$.ajax({
		url:  urlSettingTime,
		type: "post",
		async: true,
		data:{
			alert_sign_in: status,
			alert_sign_in_at: app.alertTime
		},
		dataType: "json",
		beforeSend:function(){
			$("#loadingToast").show();
		},
		complete:function(){
			$("#loadingToast").hide();
		},
		success:function(data){
			if(data.status == 0){
				
			}
		},
		error: function(){
			Alert.show({
		        content: "哎呀，服务器出错了，请重新提交",
		        type: "alert",
		    })
		}
	})
}

function timeTranse(time) {
	var hour = parseInt(time / 3600);
	var minute = parseInt((time / 60) % 60);
	if (minute < 10) {
		minute = "0" + minute;
	}
	return (hour + ":" + minute);
}

function timeReserve(time) {
	var timeArr = time.split(":");
	return (parseInt(timeArr[0]) * 60 + parseInt(timeArr[1])) * 60;
}*/