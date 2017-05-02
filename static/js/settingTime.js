var Alert = require('../modules/alert.js');

var app = new Vue({
	el: '#v-setting-time',
	data: {
		showTime: false,
		alertTime: '61200'
	},
	methods: {

	}
});

$(function() {
	getInfo();
	$("#check-work-alert").on("click", function() {
		var isChecked = $(this).is(':checked');
		if (isChecked) {
			changeSet(true);
			app.showTime = true;
		} else {
			changeSet(false);
			app.showTime = false;
		}
	});

	var opt = {};
	opt.default = {
		preset: 'time',
		theme: 'android-ics light', //皮肤样式
		display: 'bottom', //显示方式 
		mode: 'scroller', //日期选择模式
		lang: 'zh',
		stepMinute: 10
	};
	$("#choose-time-hide").mobiscroll($.extend(opt['date'], opt['default']));
	$("#choose-time").on("click", function() {
		$("#choose-time-hide").focus();
	})
	$("#choose-time-hide").on("change", function() {
		app.alertTime = timeReserve($("#choose-time-hide").val());
		changeSet(true);
	})
});

function getInfo(){
	$.ajax({
		url: urlSettingTimeInit,
		type: "get",
		dataType: "json",
		beforeSend:function(){
			$("#loadingToast").show();
		},
		complete:function(){
			$("#loadingToast").hide();
		},
		success:function(data){
			if(data.status == 0){
				if(data.data.alert_sign_in){
					$("#check-work-alert").prop("checked",true);
					app.showTime = true;
				}else{
					$("#check-work-alert").removeAttr("checked");
					app.showTime = false;
				}
				app.alertTime = data.data.alert_sign_in_at;
			}

		},
		error: function(){
			Alert.show({
		        content: "哎呀，加载班级信息失败了，请重试",
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
}