var Alert = require('../../modules/alert.js');
var itemId = $.getUrlParam("itemId");
//var itemId = '583fe3f33684f6373f000b15';
var app = new Vue({
	el: '#v-shop-item',
	data: {
		pageGuide: '',
		user:{
			real_name: 'godaangel',
			mobile: '15117929069',
			address: '北京市海淀区西土城路10号北京邮电大学一个夏天闷shi人的宿舍楼阿西吧'
		},
		itemDetail: null, //商品详情
		buyPop: false, //选择弹窗
		pool: null, //弹窗详情
		dates: null, //日期
		price: '', //价格
		participation: '',
		date: '',
		payText: '',
		count:1,
		payClass: 'btn btn-disabled',
		successUrl: '',
		successData:null,
		paySuccess:false, //判断支付完成页面是否显示
		type:'virtual-goods',
		orderList:null,//订单数据
		money:0,
		remarks:'',
		rule:null,
		img_path:true,
		rule_img:true,
		process_img:true,
		payNum:0,
		isShowDate:true
	},
	methods: {
		saveAddress: function(){

			if(!this.username){
				Alert.show({
					content: '请填写收件人哦~'
				});
				return false;
			}

			if(!checkTel(this.mobile)){
				Alert.show({
					content: '请填写正确的联系电话哦~'
				});
				return false;
			}

			if(!this.address){
				Alert.show({
					content: '请填写详细收件地址，不然快递小哥无法找到您哦~'
				});
				return false;
			}

			this.user.real_name = this.username;
			this.user.mobile = this.mobile;
			this.user.address = this.address;

			history.go(-1);
		},
		showBuy: function(){
			getPool();
		},
		hidePop: function(){
			this.buyPop = false;
			app.payText = '请先选择类型';
			app.price = '';
			app.payClass = 'btn btn-disabled';
			app.successUrl = '';
			app.participation = '';
			app.date = '';
		},
		change: function(){
			MtaH5.clickStat('item_change');
			Alert.show({
				title:"兑换提醒",
				content: "确定花费"+(app.itemDetail.unit_price)+"局票兑换“"+(app.itemDetail.name)+"”吗",
		        type: "confirm",
		        sureBtnText: "确定",
		        cancelBtnText:"取消",
		        sure: function(){
		            order();
		        }
			})
		},
		cancelPay:function(){
			app.buyPop=false;
		}
	}
});

location.hash = '';

$(window).on('hashchange', function(){
	var hash = location.hash;
    if(hash){	
    	app.pageGuide = hash.replace('#','');
	}else{
		app.pageGuide = '';
	}      
});

$(function(){
	info();
});

function info(){
	$.ajax({
		url: urlShopItem,
		type: "get",
		async: true,
		data: {
			item_id: itemId
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
				app.itemDetail = data.data;
				app.successData=data.data.list;
				if(data.data.list.length!=0){
					app.paySuccess=true;
				}
				app.payNum=data.data.list.length;
				app.remarks=data.data.remarks;
				app.description=data.data.description;
				if(data.data.list.length!=0){
					console.log(data.data.list[0]+"  "+data.data.list[0].maturity);
					if(!data.data.list[0].maturity || data.data.list[0].maturity==""){
						console.log(data.data.list[0]+"  "+data.data.list[0].maturity+1);
						app.isShowDate=false;
					}
				}
				
				if(data.data.img_path=="" || data.data.img_path==null){
					app.img_path=false;
				}
				
				if(data.data.rule_img=="" || data.data.rule_img==null){
					app.rule_img=false;
				}
				
				if(data.data.process_img=="" || data.data.process_img==null){
					app.process_img=false;
				}
			}
		},
		/*error:function(){
			Alert.show({
		        content: "加载商品失败，请重试",
		        type: "alert",
		        sureBtnText: "刷新一下",
		        sure: function(){
		            window.location.reload();
		        }
		    })
		}*/
	});
}

function getPool(){
	app.buyPop = true;
}
//下订单
function order(){
	Alert.hide();
	setTimeout(function(){
		$.ajax({
			url:urlshopInfo,
			type: "post",
			async: true,
			data: {
				type:'commodity',
				product: {
					id:itemId,
					count: 1
				}
			},
			dataType: "json",
			beforeSend: function() {
				$("#loadingToast").show();
			},
			complete: function() {
				$("#loadingToast").hide();
			},
			success: function(data) {
				if(data.status == 0){
					app.orderList=data.data;
					pay();
				}else{
					Alert.show({
						content: data.message,
					});
				}
			},
			error: function(data) {
				Alert.show({
			        content: "加载失败，请重试",
			   });
			}
		});
	},600)
}
//支付
function pay() {
	var totalMoney=app.count*app.itemDetail.unit_price;
	$.ajax({
		url:urlshopPay,
		type: "post",
		async: true,
		data: {
			type: 'point',
			order_no: app.orderList.order_no,
			money: totalMoney
		},
		dataType: "json",
		beforeSend: function() {
			$("#loadingToast").show();
		},
		complete: function() {
			$("#loadingToast").hide();
		},
		success: function(data) {
			if(data.status == 0 ){
				app.paySuccess=true;
				$("#tanchuang").show();
				setTimeout(function(){
					$("#tanchuang").hide();
				},2000);
				info();
			}else{
				Alert.show({
					content: data.message,
				});
			}
		},
		error: function(data) {
			Alert.show({
		        content: "加载失败，请重试",
		   });
		}
	});
}

//价格单位过滤器
Vue.filter('priceInfo',function(value){
	if(value==1){
		value='局票';
	}else{
		value='局票';
	}
	return value;
})

//日期
Vue.filter('dateCut', function(value) {
    if (value != null && value != '') {
        var arr = value.split("/");
        if(parseInt(arr[1])<10){
        	arr[1]="0"+arr[1];
        }
        var brr=arr[2].split(" ");
        
        return parseInt(arr[0]) + "." + arr[1]+"."+parseInt(brr[0]);
    } else {
        return '--';
    }
});
