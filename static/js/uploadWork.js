var Alert = require('../modules/alert.js');
var hasShowDialog = false;
var min_required_distance = 2;//最小跑步距离
var jsSdK = null;

$(function(){
	getConfig();
	wx.config({
		debug: false,
		appId: jsSdK.appId, // 必填，公众号的唯一标识
		timestamp: jsSdK.timestamp, // 必填，生成签名的时间戳
		nonceStr: jsSdK.nonceStr, // 必填，生成签名的随机串
		signature: jsSdK.signature, // 必填，签名，见附录1
		jsApiList: ['chooseImage', 'previewImage', 'uploadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});

	init();
	var opt={};
	opt.default = {
		preset : 'time',
		theme: 'android-ics light', //皮肤样式
		display: 'bottom', //显示方式 
		mode: 'scroller', //日期选择模式
		lang: 'zh',
	};
	$("#choose-time-hide").mobiscroll($.extend(opt['date'], opt['default']));
	$("#choose-time").on("click",function(){
		$("#choose-time-hide").focus();
	})
	$("#choose-time-hide").on("change",function(){
		var time = $("#choose-time-hide").val().split(":");
		$("#choose-time").val(parseInt(time[0])*60+parseInt(time[1]));
	})

	//弹出问题弹窗
	$(".question-list").on("click",function(){
		$(".question-title").html($(this).find("span").html());
		$("#pop-question").show();
	})

	//关闭问题弹窗
	$(".icon-guanbi1").on("click",function(){
		$("#pop-question").hide();
	})

	$("#upload-foot").on("click",function(){
		$("#upload-success").hide();
		WeixinJSBridge.call('closeWindow');
	})
})

function init(){
	$.ajax({
		url: urlSignInInit,
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
				$("#total_day").html(data.data.user.total_day);
				min_required_distance = data.data.team.min_required_distance;
				if(data.data.signIn){
					var trueData = data.data.signIn;
					$("img").show().attr("src",trueData.pic);
					$(".upload-img-bg").css("background","url('"+trueData.pic+"') no-repeat center").css("background-size","cover").removeClass("hide");
					$("#distance").val(trueData.distance);
					$("#time").val(trueData.time);
					$("#choose-time").val(trueData.duration);
				}else{
					$("img").hide();
					$(".upload-img-bg").addClass("hide");
				}
			}
		},
		error: function(){
			Alert.show({
		        content: "网络错误，请重试",
		    })
		}
	})
}

function chooseImg(){
	wx.chooseImage({
	    count: 1, // 默认9
	    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
	    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
	    success: function (res) {
	    	//console.log(res)
	        var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
	        uploadImg(localIds);
	    },
	    error: function(){
	    	alert("failed");
	    }
	});
}

function uploadImg(imgId){
	wx.uploadImage({
	    localId: imgId.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
	    isShowProgressTips: 1, // 默认为1，显示进度提示
	    success: function (res) {
	        var serverId = res.serverId; // 返回图片的服务器端ID
	        getImgUrl(serverId);
	    }
	});
}

function previewImg(){
	var url = $("img").attr("src");
	wx.previewImage({
	    current: url, // 当前显示图片的http链接
	    urls: [url] // 需要预览的图片http链接列表
	});
}

function getImgUrl(serverId){
	$.ajax({
		url: urlUploadImg,
		type: "post",
		async: true,
		data:{
			media_id: serverId,
			type: "signIn"
		},
		dataType: "json",
		beforeSend:function(){
			$("#loadingToast").show();
		},
		complete:function(){
			$("#loadingToast").hide();
		},
		success:function(data){
			//console.log(data);
			if(data.status == 200){
				$("img").attr("src",data.data.url).show();
				$(".upload-img-bg").css("background","url('"+data.data.url+"') no-repeat center").css("background-size","cover").removeClass("hide");
			}
		},
		error: function(){
			Alert.show({
		        content: "网络错误，请重试",
		    })
		}
	})
}

function submitSignIn(){
	MtaH5.clickStat('uploadWork_upload');
	var imgUrl = $("img").attr("src");
	var distance = $("#distance").val().trim();
	var time = $("#choose-time").val().trim();
	//alert(imgUrl);
	if(imgUrl==null||imgUrl==""){
		
		Alert.show({
	        content: "请上传跑步截图"
	    });
		return false;
	}

	if(distance==null||distance==""){
		Alert.show({
	        content: "请填写跑步距离"
	    });
		return false;
	}

	if(distance < min_required_distance){
		Alert.show({
	        //content: "打卡距离未达到班级或参加活动要求最低公里数，请重新提交"
	        content:"今日打卡距离低于正在报名参加的班级(或活动)最低要求，需提交合适公里数才会被审核。",
	        sureBtnText : "我知道了"
	    });
		return false;
	}

	if(hasShowDialog){

	}else{
		if(distance > 50){
			Alert.show({
	        content: "检测你今天打卡距离超过50公里，请注意公里数输入是否正确。",
	        sureBtnText:"我知道了"
	    });
			hasShowDialog = true;
			return false;
		}
	}
	

	if(time==null||time==""){
		Alert.show({
	        content: "请选择跑步时间"
	    });
		return false;
	}

	var isTwo = checkMoney(distance);
	if(!isTwo){
		Alert.show({
	        content: "距离最多为两位小数"
	    });
		return false;
	}
	
	if(parseFloat(time)/parseFloat(distance)<2.2 || parseFloat(time)/parseFloat(distance)>15){
		Alert.show({
	        content: "今日打卡配速不在平台要求范围(2.2<配速<15)内,可能会被审核不通过,请注意数字输入是否正确。",
	        sureBtnText:"我知道了"
	    });
	    return false;
	}

	$.ajax({
		url: urlSignIn,
		type: "post",
		async: true,
		data:{
			pic: imgUrl,
			pic_type: "url",
			distance: distance,
			duration: time,
			remark: ""
		},
		dataType: "json",
		beforeSend:function(){
			$("#loadingToast").show();
		},
		complete:function(){
			$("#loadingToast").hide();
		},
		success:function(data){
			//console.log(data);
			if(data.status == 200){
				Alert.show({
			        content: "打卡成功",
			        sure: function(){
			        	WeixinJSBridge.call('closeWindow');
			        }
			    });
			}else{
				Alert.show({
			        content: data.message,
			        sure: function(){
			        	WeixinJSBridge.call('closeWindow');
			        }
			    });
			}
		},
		error: function(data){
			Alert.show({
		        content: data.responseText
		    });
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
			jsSdK = data;
		}
	});
}