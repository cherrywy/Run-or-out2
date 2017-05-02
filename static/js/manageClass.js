var Alert = require('../modules/alert.js');
var id = $.getUrlParam("id");
// var id="575772926da0df01530012ff";
var app = new Vue({
	el: '#manage-class-v',
	data: {
		closeTime: 150,//选择后保持时间
		distance: 3,//跑步距离
		day: 5,//出勤天数
		week: 1,//报名周数
		money: 20,//契约金
		startDay: null,//开跑日期
		tagList: null,//班级标签
		province: "",
		otherTagList: ["减肥","健身","马甲线","上海高校","北大","看书","妹子多","早起","逗逼","适合新手","10公里","半马PB","全马预备"],
		dayList: [],//日期组
		showTags: true,
		classInfo: null,
		provinceList: constantProvinceList,
		codeDay: null,
		private: false,
		peopleNum:0,//班级人数
		isMonitor:false,//是否是班长
		isOpened:true,
		jsSdK: null
	},
	methods: {
		deleteTag: function(index){
			this.tagList.splice(index,1);
			if(this.tagList){
				if(this.tagList.length==0){
					this.showTags = false;
				}else{
					this.showTags = true;
				}
			}
		},
		addOtherTag: function(name){
			this.showTags = true;
			if(this.tagList){
				if(this.tagList.length==3){
					alert("标签最多只能添加3个");
				}else{
					if(this.tagList.indexOf(name)==-1){
						this.tagList.push(name);
					}
				}
			}else{
				this.tagList = [name];
			}
		},
		editKDM:function(){
			Alert.show({
		        content: "班级其他属性(公里、每周出勤、每日契约金)修改后会影响其他跑友跑步计划，班长可在班级为0人时删除班级，重新创建符合条件的新班级。",
		        type: "alert",
		        sureBtnText: "我知道了",
		    })
		},
		deleteClass:function(){
			delClass();
		},
		gotoSetprivate:function(){
			window.location.href="/page/team/management/private?id="+id;
		}
	}
})

Vue.filter('updateDay', function (value) {
    if(value!=null&&value!=''){
    	if(value > getToday()){
    		return DateDiff(value,getToday()) + "天后需更新";
    	}else{
    		return "二维码已过期";
    	}
    }else{
        return '--';
    }
})

Vue.filter('toState', function(value){
	var aa;
	if(value){
		aa='已开启';
	}else{
		aa='已关闭';
	}
	return aa;
})

function getDayList(){
	var nowDay = new Date();
	var nowDayTime = nowDay.getTime();
	var oneDayTimeStamp = 86400000;//一天的时间戳长度
	var list = [0,1,2,3,4];
	var weekArr = ['日','一','二','三','四','五','六'];
	for(var i = 0 ; i < list.length ; i++){
		var now = new Date((nowDayTime+oneDayTimeStamp*list[i]));
		var year=now.getFullYear();
        var month=now.getMonth()+1;
        if(month<10){
            month = "0"+month;
        }
        var date=now.getDate();
        if(date<10){
            date = "0"+date;
        }
        var weekDay = '周' + weekArr[now.getDay()];
        var dayInfo = {
        	dayWords: year+"-"+month+"-"+date+"("+weekDay+")",
        	date: year+"-"+month+"-"+date
        }
        app.dayList.push(dayInfo);
	}
	//app.startDay = app.dayList[0];
}

$(window).on('hashchange', function(){
	var hash = location.hash;
    if(hash){	
	}else{
		$(".create-slide").removeClass("show");
	}      
})

function initInfo(){
	$.ajax({
		url: urlGetClassInfo + "/management/" + id,
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
			if(data.status == 0){
				app.classInfo = data.data.team;
				app.money = data.data.team.money/100;
				app.day = data.data.team.duration;
				app.province = data.data.team.province;
				app.distance = data.data.team.distance;
				app.codeDay = data.data.team.qrcode_expire;
				app.week = data.data.team.cycle;
				app.peopleNum=data.data.team.people;
				
				/*if(data.data.monitor.id==data.data.user.id){
					app.isMonitor=true;
				}*/
				if(data.data.team.private){
					$("#private-class").prop("checked",true);
					app.private=true;
					app.isOpened=true;
				}else{
					$("#private-class").removeAttr("checked");
					app.private=true;
					app.isOpened=false;
				}
				if(data.data.team.tags==""||data.data.team.tags==null){
					app.tagList = null;
					app.showTags = false;
				}else{
					app.tagList = data.data.team.tags.split(",");
				}

				/*var day = data.data.team_cycle.start_date;
				var dayInfo = {
		        	dayWords: toWordDate(day),
		        	date: day
		        }
				app.startDay = dayInfo;*/
				setLocalStorage("preTagList",JSON.stringify(app.tagList));
			}
		},
		/*error: function(){
			Alert.show({
		        content: "哎呀，加载班级信息失败了，请重试",
		        type: "alert",
		        sureBtnText: "刷新一下",
		        sure: function(){
		            window.location.reload();
		        }
		    })
		}*/
	})
}

function toWordDate(value){
	var weekArr = ['日','一','二','三','四','五','六'];
	var arr = value.split("-");
	var date = new Date(Date.parse(value.replace(/-/g,"/")));  ;
	return arr[0]+"-"+arr[1]+"-"+arr[2]+"(周"+weekArr[date.getDay()]+")"
}

function submitUpdate(){
	MtaH5.clickStat('manage_creatSubmit');
	var name = $("#class-name").attr("data-value");
	var week = $("#run-week").attr("data-choosed-data");
	var description = $("#class-note").attr("data-value");
	var monitor_name = $("#class-master").attr("data-value-name");
	var monitor_introduction = $("#class-master").attr("data-value-one");
	var monitor_description = $("#class-master").attr("data-value-intro");

	if(name==null||name==""){
		Alert.show({
	        content: "请输入班级名称",
	        type: "alert",
		});
		return false;
	}

	if(!app.tagList||app.tagList.length==0){
		Alert.show({
	        content: "请选择您的班级标签",
	        type: "alert",
		});
		return false;
	}

	$.ajax({
		url: urlUpdateClass + "/" + id,
		type: "put",
		async: true,
		data:{
			name: name,
			cycle: week,
			description: description,
			monitor_name: monitor_name,
			monitor_introduction: monitor_introduction,
			monitor_description: monitor_description,
			tags: app.tagList?app.tagList.join(","):"",
			province: app.province,
			distance: app.distance,
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
			        content: "保存成功",
			        type: "alert",
			        sure: function(){
			            window.location.href = "/page/team/detail?id="+data.data.id;
			        }
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

function changePrivate(privateValue){
	$.ajax({
		url:  urlHead + 'ajax/team/private/' + id,
		type: "POST",
		async: true,
		data:{
			private: privateValue
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
				if(privateValue){
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
				window.location.href="/page/team/management?id=" + id;
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

function updateClass(){
	var week = $("#run-week").attr("data-choosed-data");
	$.ajax({
		url: urlUpdateClass + "/" + id,
		type: "put",
		async: true,
		data:{
			cycle: week
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
				
			}else{
				Alert.show({
			        content: data.message,
			        type: "alert",
			    });
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
$(function(){
	
	getDayList();
	initInfo();

	$("#private-class").on("click",function(){
		MtaH5.clickStat('private_class');
		var isChecked = $(this).is(':checked');
		if(isChecked){
			changePrivate(true);
		}else{
			changePrivate(false);
		}
	})
	
	//弹出选择框
	$(".normal-menu-body").on("click",'.slide-out',function(){
		if($(this).attr("class").indexOf("disabled")==-1){
			var relateId = $(this).attr("data-relate-id");
			$("#"+relateId).addClass("show");
			window.location.href = "#slide";
			$("#manage-body").addClass("manage-body-down");
		}
	})

	//选择跑步公里
	$("#run-distance-pop .choose-distance-body").on("click",".distance-list",function(){
		$(this).addClass("active").siblings().removeClass("active");
		app.distance = $(this).attr("data-distance");
		$("#run-distance .normal-menu-sub-title").html(app.distance + "KM").attr("data-choosed-data",app.distance);
		setTimeout(function(){
			window.history.go(-1);
		},app.closeTime);
		$("#manage-body").removeClass("manage-body-down");
	})

	//选择最少周数
	$("#run-week-pop .choose-distance-body").on("click",".distance-list",function(){
		MtaH5.clickStat('manageClass_weekNum');
		$(this).addClass("active").siblings().removeClass("active");
		app.week = $(this).attr("data-week");
		$("#run-week .normal-menu-sub-title").html(app.week + "周").attr("data-choosed-data",app.week);
		setTimeout(function(){
			window.history.go(-1);
			updateClass();
		},app.closeTime);
		$("#manage-body").removeClass("manage-body-down");
	})

	//选择开跑日期
	$("#run-date-pop .choose-distance-body").on("click",".distance-list",function(){
		$(this).addClass("active").siblings().removeClass("active");
		app.startDay = app.dayList[$(this).attr("data-date")];
		setTimeout(function(){
			window.history.go(-1);
		},app.closeTime);
		$("#manage-body").removeClass("manage-body-down");
	})

	//选择所在地
	$("#run-location-pop .choose-distance-body").on("click",".distance-list",function(){
		MtaH5.clickStat('manageClass_place');
		$(this).addClass("active").siblings().removeClass("active");
		app.province = $(this).attr("data-data");
		//alert(app.province)
		setTimeout(function(){
			window.history.go(-1);
		},app.closeTime);
		$("#manage-body").removeClass("manage-body-down");
	})

	$(".slide-input").on("click",function(){
		MtaH5.clickStat('manageClass_className');
		window.location.href = "#slide";
		$("#manage-body").addClass("manage-body-down");
		var name = $(this).attr("data-name");
		if(name!="master"){
			var value = $(this).attr("data-value");
			$("#class-"+name+"-pop").addClass("show").find(".input-text").val(value);

			$("#class-"+name+"-pop .create-btn").unbind("click").on("click",function(){
				
				MtaH5.clickStat('manageClass_classIntro');
				var value = $("#class-"+name+"-pop .input-text").val();
				if(value!=null&&value!=""){
					$("#class-"+name+"").attr("data-value",value).find(".sub-value").html(value).removeClass("color-c8");
				}else{
					$("#class-"+name+"").attr("data-value","").find(".sub-value").html("暂无").addClass("color-c8");
				}
				window.history.go(-1);
			})
		}else{
			var one = $(this).attr("data-value-one");
			$("#class-master-pop").addClass("show").find(".input-text-one").val(one);

			$("#class-master-pop .create-btn").unbind("click").on("click",function(){
				var one = $("#class-master-pop .input-text-one").val();
				MtaH5.clickStat('manageClass_classTouxian');

				if(one==""){
					$("#class-master").attr("data-value-one",one).find(".sub-value").html("暂无").removeClass("color-c8");
				}else{
					var str = one;
					$("#class-master").attr("data-value-one",one).find(".sub-value").html(str).removeClass("color-c8");
				}
				window.history.go(-1);
			})

		}

		$("#class-"+name+"-pop .cancel-choose").unbind("click").on("click",function(){
			window.history.go(-1);
		})
	})

	//班级标签
	$("#class-tags-pop .cancel-choose").on("click",function(){
		MtaH5.clickStat('manageClass_classTags');
		app.tagList = eval(getLocalStorage("preTagList"));
		window.history.go(-1);
		$("#class-tags-pop-input").val("");
		if(!app.tagList||app.tagList.length==0){
			app.showTags = false;
		}else{
			app.showTags = true;
		}
		$("#manage-body").removeClass("manage-body-down");
	})
	$("#class-tags-pop .create-btn").on("click",function(){
		setLocalStorage("preTagList",JSON.stringify(app.tagList));
		window.history.go(-1);
		$("#class-tags-pop-input").val("");
		if(app.tagList.length==0){
			app.showTags = false;
		}else{
			app.showTags = true;
		}
		$("#manage-body").removeClass("manage-body-down");
	})
	$(".add-tags-btn").on("click",function(){
		if(app.tagList){
			app.showTags = true;
			if(app.tagList.length==3){
				alert("标签最多只能添加3个");
			}else{
				var value = $("#class-tags-pop-input").val();
				if(value!=null&&value!=""){
					if(app.tagList.indexOf(value)==-1){
						app.tagList.push(value);
					}
					$("#class-tags-pop-input").val("");
				}
			}
		}else{
			var value = $("#class-tags-pop-input").val();
			if(value!=null&&value!=""){
				app.tagList = [value];
				$("#class-tags-pop-input").val("");
				app.showTags = true;
			}
		}
	})

	//城市选择
	$("#run-location-pop").on("click",".cancel-choose",function(){
		window.history.go(-1);
		$(".location-head").removeClass("hide");
		$("#manage-body").removeClass("manage-body-down");
	})

	$("#run-location-pop").on("click",".icon-guanbi1",function(){
		$(".location-head").addClass("hide");
		$("#manage-body").removeClass("manage-body-down");
	})
})

function gotoQRcode(){
	MtaH5.clickStat('manageClass_QRcode');
	window.location.href= "/page/team/upload?id=" + id;
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

function delClass(){
	if(app.peopleNum==0){//班级0人
		Alert.show({
		    content: "删除这个班级后可重新创建一个新班级，确定删除吗？",
			type: "confirm",
			sureBtnText: "确定",
		    cancelBtnText:"取消",
		    sure:function(){
		    	delFun();
		    }
		});
		
	}/*else if(app.peopleNum==1){//班级有一个人在跑，且这个人是这个班的班长
		Alert.show({
		    content:"删除这个班级后可重新创建一个新班级，同时你退出本周跑班并返还契约金到个人账户，确定删除吗？",
			type: "confirm",
			sureBtnText: "确定",
		    cancelBtnText:"取消",			
		});		
	}*/
	else{//还有其他的跑友在跑
		Alert.show({
		    content:"班级当前有跑友在跑无法删除，请在他们全部结束后再来尝试删除班级，特殊情况请通过问题咨询联系运营同学解决",
			type: "confirm",
			cancelBtnText:"去咨询",
			sureBtnText:"我知道了",
			cancel:function(){
				window.location.href="/page/feedback/emergency";
			}
		});		
	}
}

function delFun(){
	$.ajax({
		url:  urlHead + 'ajax/team/archive/' + id,
		type: "POST",
		async: true,
		beforeSend:function(){
			$("#loadingToast").show();
		},
		complete:function(){
			$("#loadingToast").hide();
		},
		success:function(data){
			if(data.status == 0){
					Alert.show({
				        content: "班级删除成功",
				        type:"alert",
				        sureBtnText:"我知道了",
				        sure:function(){
				        	window.location.href="/page/user_home";
				        }
				   })	
			}else{
				Alert.show({
				        content: data.message,
				        type:"alert"
				   })	
			}
		},
		error: function(){
			Alert.show({
		        content: "哎呀，服务器出错了，请重试",
		        type: "alert",
		    })
		}
	})
}
