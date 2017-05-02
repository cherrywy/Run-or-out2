var Alert = require('../../modules/alert.js');
var app = new Vue({
	el: '#v-shop-index',
	data: {
		tab: 1, //筛选
		itemList: null
	},
	methods: {
		changeTab: function(index){
			this.tab = index;
		}
	}
});


$(function(){
	info();
});

function info(){
	$.ajax({
		url: urlShop,
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
				if(data.data.items && data.data.items.length != 0){
					app.itemList = data.data.items;
				}
			}
		},
		error:function(){
			Alert.show({
		        content: "加载商城失败，请重试",
		        type: "alert",
		        sureBtnText: "刷新一下",
		        sure: function(){
		            window.location.reload();
		        }
		    })
		}
	});
}