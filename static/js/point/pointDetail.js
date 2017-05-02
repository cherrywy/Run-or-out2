var Alert = require('../../modules/alert.js');
var app = new Vue({
	el: '#v-shop-points-detail',
	data: {
		balance: '',
		timestamp: '',
		pointTally: null,
		pageFlag: true,
		canRequest: true,
		noMore: false,
		userData: null,
	},
	methods: {
		
	}
});


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
});

function getList(){
	app.canRequest = false;
	$.ajax({
		url: urlPointTally,
		type: "get",
		async: true,
		dataType: "json",
		data: {
			balance: app.balance,
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
			if(data.status == 200){
				app.balance = data.data.balance;
				app.timestamp = data.data.timestamp;
				app.userData = data.data.user_data;
				
				if(data.data.point_tally.length != 0){
					if(app.pointTally == null){
						app.pointTally = data.data.point_tally;
					}else{
						app.pointTally = app.pointTally.concat(data.data.point_tally);
					}
				}else{
					app.pageFlag = false;
					app.noMore = true;
				}
			}
		},
		error:function(){
			Alert.show({
		        content: "加载积分信息失败，请重试",
		        type: "alert",
		        sureBtnText: "刷新一下",
		        sure: function(){
		            window.location.reload();
		        }
		    })
		}
	});
}