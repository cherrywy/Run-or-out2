var Alert = require('../modules/alert.js');
var app = new Vue({
    el: '#user-info-v',
    data: {
        user: null,
        isTel: true,
        isAge: true,
        allData: null,
        provinceList: [],
        cityList: [],
        areaList: [],
        jsSdK: null
    },
    methods: {
        
    }
})

$(function(){
	getConfig();
	wx.config({
		debug: false,
		appId: app.jsSdK.appId, // 必填，公众号的唯一标识
		timestamp: app.jsSdK.timestamp, // 必填，生成签名的时间戳
		nonceStr: app.jsSdK.nonceStr, // 必填，生成签名的随机串
		signature: app.jsSdK.signature, // 必填，签名，见附录1
		jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
	wx.ready(function(){
		wx.hideOptionMenu();
	});
		
	
    $.getJSON('/public/static/js/areaNumber.json',function(data){
        app.allData = data;
        for(var i in app.allData){
            if(i.substring(2,6) == '0000'){
                app.provinceList.push({
                    value: i,
                    name: app.allData[i]
                })
            }
        }
    });

    $('#province').on('change',function(){
        app.user.city = '';
        app.user.area = '';
        app.areaList = '';
        getCityList(app.user.province);
    });

    $('#city').on('change',function(){
        app.user.area = '';
        getAreaList(app.user.city);
    });

    getInfo();

    $(".withdraw-btn").on("click",function(){
        if(!app.isTel){
            Alert.show({
                content: "手机号不正确！",
                type: "alert"
            })
            return false;
        }
        if(!app.isAge){
            Alert.show({
                content: "年龄不正确！",
                type: "alert"
            })
            return false;
        }
        $.ajax({
            url: urlUpdateUserInfo,
            type: "put",
            async: true,
            dataType: "json",
            data:{
                real_name: app.user.real_name,
                mobile: app.user.mobile,
                sex: app.user.sex,
                age: app.user.age,
                app: app.user.app,
                subscribe_from: app.user.subscribe_from,
                other_from: app.user.other_from,
                province: app.user.province,
                city: app.user.city,
                area: app.user.area,
                address: app.user.address,
                hundred: app.user.hundred
            },
            beforeSend:function(){
                $("#loadingToast").show();
            },
            complete:function(){
                $("#loadingToast").hide();
            },
            success:function(data){
                //console.log(data)
                if(data.status == 200){
                    Alert.show({
                        content: "提交成功",
                        type: "alert"
                    })
                    setTimeout(function(){
                        window.location.href = "/page/user_home";
                    },800);
                }
            },
            error: function(){
                Alert.show({
                    content: "网络错误，请重试"
                });
            }
        })
    })
    $("select").on("change",function(){
        var value = $(this).val();
        if(value != null && value != ""){
            $(this).removeClass("color-c8");
        }else{
            $(this).addClass("color-c8");
        }
    })

    $("#tel").on("change",function(){
    	
        if(app.user.mobile){
            app.isTel = checkTel(app.user.mobile);
            if(!app.isTel){
                Alert.show({
                    content: "手机号不正确！",
                    type: "alert"
                })
            }
        }else{
            app.isTel = true;
        }
    })
    
     $("#tel").on("click",function(){
     	MtaH5.clickStat('userInfo_tel');
     });

    $("#age").on("change",function(){
        if(app.user.age){
            app.isAge = checkAge(app.user.age);
            if(!app.isAge){
                Alert.show({
                    content: "年龄不正确！",
                    type: "alert"
                })
            }
        }else{
            app.isAge = true;
        }
    })

    $("#subscribe-from").on("change",function(){
        if(app.user.subscribe_from){
            
        }else{
            
        }
    })
    
    $("#subscribe-from").on("click",function(){
    	MtaH5.clickStat('KnowUs');
    });
})

function getInfo(){
    $.ajax({
        url: urlUserInfoInit,
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
                app.user = data.data;
                if(app.user.province != ''){
                    setTimeout(function(){
                        getCityList(app.user.province);
                    },200);
                }
            }
        },
        error: function(){
            Alert.show({
                content: "用户信息加载失败，请重试或联系Run妹",
                type: "alert",
                sure: function(){
                    window.location.reload();
                }
            })
        }
    })
}

function getCityList(id){
    app.cityList = [];
    for(var i in app.allData){
        if(id.substring(0,2) == i.substring(0,2) && i.substring(2,4) != '00' && i.substring(4,6) == '00'){
            app.cityList.push({
                value: i,
                name: app.allData[i]
            })
        }
    }
    console.log(app.cityList);
    if(!app.user.city){
        app.user.city = app.cityList[0].value;
    }
    getAreaList(app.user.city);
}

function getAreaList(id){
    app.areaList = [];
    for(var i in app.allData){
        if(id.substring(0,4) == i.substring(0,4) && i.substring(4,6) != '00'){
            app.areaList.push({
                value: i,
                name: app.allData[i]
            })
        }
    }
    if(!app.user.area){
        app.user.area = app.areaList[0].value;
    }
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
			app.jsSdK = data;
		}
	});
}