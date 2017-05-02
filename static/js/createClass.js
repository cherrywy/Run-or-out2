var Alert = require('../modules/alert.js');
var closeTime = 150,//选择后保持时间
	distance = 3,//跑步距离
	day = 5,//出勤天数
	week = 1,//报名周数
	money = 20,//契约金
	startDay = null,
	dayList = [],//日期组
	hasJoined = false,
	hasAClass = false,
	className=null;

var app = new Vue({
	el: '#create-class-v',
	data: {
		payStep: 1,
		start_date_week:null,
	},
	methods: {
		showPay: function(){

		},
		hidePay: function(){
			$(".bottom-pay-pop").removeClass('show');
		},
		pay: function(){
			app.payStep = 2;
		}
	}
});

function joinClass(){
	window.location.href = "/page/team/participation";
}

function gotoActList(){
    var timestamp=new Date().getTime();
    window.location.href = "/page/activity/list?time=" + timestamp;
}
 function getWeekDay(value){

 	var weekArr = ['日','一','二','三','四','五','六'];
						var now = new Date(value);
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
              
				return	dayInfo.dayWords;
              }
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
        dayList.push(dayInfo);
	}
	startDay = dayList[1];
	console.log(startDay)
	$("#run-date").attr("data-choosed-data",startDay.date).find(".normal-menu-sub-title").html(startDay.dayWords);
	var str = "";
	for(var i = 0;i < dayList.length;i ++){
		if(i==1){
			str += "<div class='distance-list active' data-date='"+i+"'>"+dayList[i].dayWords+"</div>";
		}else{
			str += "<div class='distance-list' data-date='"+i+"'>"+dayList[i].dayWords+"</div>";
		}
	}
	$("#choose-start-list").html(str);
}

function getUserInfo(){
    $.ajax({
		url: urlGetUserCenter,
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

				
               
				if(data.data.participation||data.data.next_participation){
					hasJoined = true;
					$("#submit-create-class").css("background","#969696").html("已加入跑班，结束后可创建跑班");
				}else{
					hasJoined = false;
				}
				if(data.data.monitor_team){
					hasAClass = true;
					$("#className").val(data.data.monitor_team.name);
					$("#distance").html(data.data.monitor_team.distance+"KM");
					$("#duration").html("一周跑"+data.data.monitor_team.duration+"天");
					$("#money").html(data.data.monitor_team.money/100 +"元");
					// $("#start-date").html(getToday());

					if(data.data.participation!=null){
                         app.start_date_week=data.data.participation.start_date;
                         $("#start-date").html(getWeekDay(app.start_date_week));

					}else{
						   $("#run-date").hide();
					}
					$("#submit-create-class").css("background","#969696").html("您已创建一个跑班");
				}else{
					hasAClass = false;
				}
			}
		}
	})
}

$(window).on('hashchange', function(){
	var hash = location.hash;
    if(hash){	
	}else{
		$(".create-slide").removeClass("show");
	}      
})

$(function(){

	getDayList();
	getUserInfo();
	//弹出选择框
	$(".normal-menu-list").on("click",function(){
		var relateId = $(this).attr("data-relate-id");
		$("#"+relateId).addClass("show");
		window.location.href = "#slide";
	})

	//选择跑步公里
	$("#run-distance-pop .choose-distance-body").on("click",".distance-list",function(){
		MtaH5.clickStat('creatClass_distance');
		$(this).addClass("active").siblings().removeClass("active");
		distance = $(this).attr("data-distance");
		$("#run-distance").attr("data-choosed-data",distance).find(".normal-menu-sub-title").html(distance + "KM");
		setTimeout(function(){
			window.history.go(-1);
		},closeTime);
	})

	//选择出勤天数
	$("#run-day-pop .choose-distance-body").on("click",".distance-list",function(){
		MtaH5.clickStat('creatClass_day');
		$(this).addClass("active").siblings().removeClass("active");
		day = $(this).attr("data-day");
		$("#run-day").attr("data-choosed-data",day).find(".normal-menu-sub-title").html("一周跑"+day+"天");
		setTimeout(function(){
			window.history.go(-1);
		},closeTime);
	})

	// //选择最少报名周数
	// $("#run-week-pop .choose-distance-body").on("click",".distance-list",function(){
	// 	$(this).addClass("active").siblings().removeClass("active");
	// 	week = $(this).attr("data-week");
	// 	$("#run-week").attr("data-choosed-data",week).find(".normal-menu-sub-title").html("至少报"+week+"周");
	// 	setTimeout(function(){
	// 		window.history.go(-1);
	// 	},closeTime);
	// })

	//选择开跑日期
	$("#run-date-pop .choose-distance-body").on("click",".distance-list",function(){
		MtaH5.clickStat('creatClass_startDate');
		$(this).addClass("active").siblings().removeClass("active");
		startDay = dayList[$(this).attr("data-date")];
		$("#run-date").attr("data-choosed-data",startDay.date).find(".normal-menu-sub-title").html(startDay.dayWords);
		setTimeout(function(){
			window.history.go(-1);
		},closeTime);
	})
    
	//选择契约金
	$(".choose-money-body").on("click",".money-tab",function(){
		MtaH5.clickStat('creatClass_money');
		$("#choose-other-money").val("");
		$(this).addClass("active").siblings().removeClass("active");
		money = $(this).attr("data-money");
		$("#choose-money").attr("data-choosed-data",money).find(".normal-menu-sub-title").html(money + "元");
		setTimeout(function(){
			$(".create-slide").removeClass("show");
		},closeTime);
	})
	$("#choose-other-money").on("focus",function(){
		$(".money-tab").removeClass("active");
		money = -1;
	})

	$("#sub-money").on("click",function(){
		if(money==-1){
			money = $("#choose-other-money").val();
			if(money==null||money==""||money==-1){
				//$("#alert-out").show().find(".alert-word").html("请输入金额或选择其他金额");
				Alert.show({
			        content: "请输入金额或选择其他金额",
			        type: "alert"
			    })
				return false;
			}else{
				if(checkAge(money)&&money >= 1){
					$("#choose-money").attr("data-choosed-data",money).find(".normal-menu-sub-title").html(money + "元");
					setTimeout(function(){
						$(".create-slide").removeClass("show");
					},closeTime);
				}else{
					//$("#alert-out").show().find(".alert-word").html("金额必须为整数且至少为1元");
					Alert.show({
				        content: "金额必须为整数且至少为1元",
				        type: "alert"
				    })
					return false;
				}
			}
		}else if(money!=null&&money!=""){
			setTimeout(function(){
				$(".create-slide").removeClass("show");
			},closeTime);
		}else{
			Alert.show({
		        content: "请输入金额或选择其他金额",
		        type: "alert"
		    })
		}
	})

	$("#submit-create-class").on("click",function(){

		if(hasAClass){
			return false;
		}

		if(hasJoined){
			//$("#alert-out").show().find(".alert-word").html("你已加入一个跑班，跑完再来创建新的班级哦！");
			return false;
		}

		var distance = $("#run-distance").attr("data-choosed-data");
		var day = $("#run-day").attr("data-choosed-data");
		// var className = $("#className").val();
		var money = $("#choose-money").attr("data-choosed-data");
		var startDate = $("#run-date").attr("data-choosed-data");
		
		console.info(distance+"  "+day+" "+money+" "+startDate);

		if(distance == null || distance == ""){
			Alert.show({
		        content: "请选择每日公里数",
		        type: "alert"
		    })
			return false;
		}

		if(day == null || day == ""){
			Alert.show({
		        content: "请选择每周出勤天数",
		        type: "alert"
		    })
			return false;
		}

		// if(className== null || className == ""){
		// 	Alert.show({
		//         content: "请输入班级名",
		//         type: "alert"
		//     })
		// 	return false;
		// }
		// if(className.length>36){
		// 	Alert.show({
		//         content: "班级名不能超过36个字符",
		//         type: "alert"
		//     })
		// 	return false;
		// }

		if(money == null || money == ""){
			Alert.show({
		        content: "请选择单日契约金",
		        type: "alert"
		    })
			return false;
		}

		if(startDate == null || startDate == ""){
			Alert.show({
		        content: "请选择开跑日期",
		        type: "alert"
		    })
			return false;
		}
		var dateArr = startDate.trim().split("-");
		startDate = {
			year: dateArr[0],
			month: dateArr[1],
			day: dateArr[2]
		}
		var startDateS = JSON.stringify(startDate);
		$.ajax({
			url: urlCreateClass,
			type: "post",
			async: true,
			dataType: "json",
			data: {
				distance: distance,
				required_cycle_duration:day,
				cycle: week,
				money: money * 100,
				start_date: startDate,
				
			},
			beforeSend:function(){
				$("#loadingToast").show();
			},
			complete:function(){
				$("#loadingToast").hide();
			},
			success:function(data){
				//console.log(data);
				if(data.status == 200){
					var startTime = dateArr[0]+"-"+dateArr[1]+"-"+dateArr[2];
					window.location.href = "/page/team/pay?id="+data.data.id+"&joinType=participation&startDate="+startTime+"&type="+"createClass";
				}else{
					//$("#alert-out").show().find(".alert-word").html(data.message);
					Alert.show({
				        content: data.message,
				        type: "alert"
				    })
				}
			},
			error: function(data){
				data.response = JSON.parse(data.response);
	 			var res = eval("["+data.response+"]");
				Alert.show({
			        content: res[0].message,
			        type: "alert"
			    })
			}
		})
	})

	$(".pay-discount").on("click",function(){
		$(this).toggleClass("active");
	});
	$(".icon-read-deal").on("click",function(){
		$(this).parent().toggleClass("active");
	});

})
