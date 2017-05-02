var Alert = require('../modules/alert.js');
var id = $.getUrlParam("id");
var jsSdK = null;

$(function(){
	
	getConfig();
	wx.config({
		debug: false,
		appId: jsSdK.appId, // 必填，公众号的唯一标识
		timestamp: jsSdK.timestamp, // 必填，生成签名的时间戳
		nonceStr: jsSdK.nonceStr, // 必填，生成签名的随机串
		signature: jsSdK.signature, // 必填，签名，见附录1
		jsApiList: ['chooseImage', 'previewImage','uploadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
	wx.ready(function(){
		wx.hideOptionMenu();
	});
	getInfo();
})

function getInfo(){
	$.ajax({
		url: urlGetClassInfo + "/" + id,
		type: "get",
		async: false,
		dataType: "json",
		beforeSend:function(){
			$("#loadingToast").show();
		},
		complete:function(){
			$("#loadingToast").hide();
		},
		success:function(data){
			if(data.status == 200){
				$(".class-photo-head a").css("background","url("+(data.data.avatar?data.data.avatar:'/images/photo.png')+") no-repeat center").css("background-size","cover").attr("data-url",data.data.avatar);
				if(data.data.avatar!=null&&data.data.avatar!=""){
					$(".class-photo-head a").removeClass("with-word");
				}

				$(".class-photo-body a").css("background","url("+(data.data.qrcode?data.data.qrcode:'/images/photo.png')+") no-repeat center").css("background-size","cover").attr("data-url",data.data.qrcode);
				if(data.data.qrcode!=null&&data.data.qrcode!=""){
					$(".class-photo-body a").removeClass("with-word");
				}
			}
		}
	})
}

function chooseImg(type){
	wx.chooseImage({
	    count: 1, // 默认9
	    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
	    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
	    success: function (res) {
	    	//console.log(res)
	        var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
	        uploadImg(localIds,type);
	    },
	    error: function(){
	    	alert("failed");
	    }
	});
}

function uploadImg(imgId,type){
	wx.uploadImage({
	    localId: imgId.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
	    isShowProgressTips: 1, // 默认为1，显示进度提示
	    success: function (res) {
	        var serverId = res.serverId; // 返回图片的服务器端ID
	        getImgUrl(serverId,type);
	    }
	});
}

function getImgUrl(serverId,type){
	var uploadType = "";
	if(type=="headImg"){
		uploadType = "teamAvatar";
	}else{
		uploadType = "teamQrcode";
	}

	$.ajax({
		url: urlUploadImg,
		type: "post",
		async: true,
		data:{
			media_id: serverId,
			type: uploadType
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
				if(uploadType == "teamAvatar"){
					$(".class-photo-head a").css("background","url("+data.data.url+") no-repeat center").css("background-size","cover").attr("data-url",data.data.url);
					if(data.data.url!=null&&data.data.url!=""){
						$(".class-photo-head a").removeClass("with-word");
					}
				}else{
					$(".class-photo-body a").css("background","url("+data.data.url+") no-repeat center").css("background-size","cover").attr("data-url",data.data.url);
					if(data.data.url!=null&&data.data.url!=""){
						$(".class-photo-body a").removeClass("with-word");
					}
				}
				submitUpdate();
			}
		}
	})
}

function submitUpdate(){
	var qrcode = $(".class-photo-body a").attr("data-url");
	var avatar = $(".class-photo-head a").attr("data-url");
	
	$.ajax({
		url: urlUpdateClass + "/" + id,
		type: "put",
		async: true,
		data:{
			qrcode: qrcode,
			avatar: avatar
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
				Alert.show({
			        content: "上传成功",
			        type: "alert"
			    })
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