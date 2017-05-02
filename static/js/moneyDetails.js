var Alert = require('../modules/alert.js');
var app = new Vue({
	el: '#money-details-v',
	data: {
		closeTime: 150,//选择后保持时间
		moneyList:[],
		count: 10,
		timestamp: null,
		hasMore:true,
		moneyTimeBlock:[],
		pageFlag: true,
		canRequest: true,
	},
	methods: {
		
	}
})

Vue.filter('moneyType', function (value) {
    if(value == "contrast"){
    	return "契约金";
    }else if(value == "withdraw"){
    	return "提现";
    }else if(value == "profit"){
    	return "奖金";
    }else if(value == "cashback"){
    	return "契约金返还";
    }else if(value == "refund"){
    	return "不跑就出局返款";
    }else{
    	return "未知分类";
    }
})

Vue.filter('moneyType2', function (value) {
    if(value == "contrast"){
    	return "-";
    }else if(value == "withdraw"){
    	return "-";
    }else if(value == "cashback"){
    	return "+";
    }else{
    	return "";
    }
})

$(function(){
	getList();

	$(window).on("scroll", function() {
		var $this = $(document),
			viewH = $(this).height(),
			contentH = $(document).height(), //内容高度
			scrollTop = $(window).scrollTop(); //滚动高度
		//console.log(viewH+","+contentH+","+scrollTop);
		if (scrollTop / (contentH - viewH) >= 0.95) { //到达底部0px时,加载新内容
			if (!app.pageFlag) { //不再继续滚动，弹出提示框

			} else {
				if (app.canRequest) {
					getList();
				}
			}
		}
	});
})

function getList(){
	app.canRequest = false;
	$.ajax({
		url: urlGetMoneyDetails,
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
			app.canRequest = true;
		},
		success:function(data){
			//console.log(data);
			if(data.status == 200){
				if(data.data.money_tally!=null&&data.data.money_tally!=""){
					for(var i=0;i<data.data.money_tally.length;i++){
						changeToTimeBlock(data.data.money_tally[i]);
					}
					app.timestamp = data.data.timestamp;
				}else{
					app.pageFlag = false;
					app.hasMore = false;
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

function changeToTimeBlock(obj){
	obj.timeBlock = getLocalTime(obj.timestamp);
	obj.timeBlock = obj.timeBlock.split("-")[0]+"-"+obj.timeBlock.split("-")[1];
	for(var i = 0;i<app.moneyTimeBlock.length;i++){
		if(app.moneyTimeBlock[i].month==obj.timeBlock){
			app.moneyTimeBlock[i].moneyList.push(obj);
			return false;
		}
	}
	var time = {
		month: obj.timeBlock,
		moneyList: [obj]
	}
	app.moneyTimeBlock.push(time);
}