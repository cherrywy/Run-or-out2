var Alert = require('../modules/alert.js');
var id = $.getUrlParam("id");
//var id = "575783656da0df463f001616";

var app = new Vue({
	el: '#rank-list-v',
	data: {
		closeTime: 1000,//选择后保持时间
		firstType: getLocalStorage("firstType")?getLocalStorage("firstType"):"runClass",//大分类，class和plate
		subType: "km",//小分类，distance和money
		user: null,
		class: null,
		selfClass: null,
		rankList: null,
		flexRankList: null,
		count: 10,
		timestamp:"",
		offset: 0,
		hasMore: true,
		start_date:null,
		finish_date:null,
		team: null,
		recentJoin: null,
		nowJoin: null,
		nextJoin: [],
		isClick:true,
		Fcount:0,
		prev:null,
		next:null,
		curr:null,
		cycle_id:null,
		firstRun:0,
		moreText: '展开全部',
		aaa:0,

	},
	methods: {
		// 	gotoWall: function() {
		// 	window.location.href = "/page/team/wall?id=" + this.classInfo.id;
		// },
		favorMyself: function(){
			if(app.user.thumb_up){
				cancelFavorUserMe(this.user.id);
			}else{
				favorUserMe(this.user.id);
			}
			
		},
		wansailv: function(){
			Alert.show({
				content: "本周奖金：本周实时获得奖金（元）。<br/>返契约金：截止今日已返契约金（元）可在本周结束后在RO账户提现。",
				sureBtnText: "我知道了"
			});
		},
		wansailv1: function(){
			Alert.show({
				content: "人均奖金：上周成功坚持跑友平均分配的奖金（元）。<br/>班坚持率：上周成功坚持跑友数/全部跑友数。",
				sureBtnText: "我知道了"
			});
		},
		favor: function(index){
			if(app.rankList[index].thumb_up){
				cancelFavorUserOther(index);
			}else{
				favorUserOther(index);
			}
		},
		favorFlex: function(index){
			if(app.flexRankList[index].thumb_up){
				cancelFavorUserOtherFlex(index);
			}else{
				favorUserOtherFlex(index);
			}
		},
		toClass: function(id){
			window.location.href = "/page/team/detail?id=" + id;
		},
		toActiveRank: function(){
			var timestamp=new Date().getTime();
			window.location.href = "/page/rank/activities?time=" + timestamp;
		}
	}
})
$(function(){
   	           
	if(app.firstType=="runClass"&&app.subType=="km"){
		getList(urlInitRankList);
	}else if(app.firstType=="runPlate"&&app.subType=="km"){
		MtaH5.clickStat('rankList_pre');
	}

	$(".index-head-tab").on("click","span",function(){
		$(this).addClass("active").siblings().removeClass("active");
		changeList();
	
		
	})
	
	// var isClick=false;
 //        getrunnerWall(isClick);
	// $(".rank-sub-head").on("click","span",function(){
	// 	$(this).addClass("active").siblings().removeClass("active");
	// 	changeList();
	// })

})

function getrunlist(value){
			if (value==1) {
				MtaH5.clickStat('rankList_pre');
				getList(urlInitRankList,1);
			}else{
				MtaH5.clickStat('rankList_next');
				getList(urlInitRankList,2);
			}
			
		}
function changeList(){
	app.user = null;
	app.rankList = null;
	app.firstType = $(".rank-head span.active").attr("data-value");
	app.hasMore = true;
	app.offset = 0;
	if(app.firstType=="runClass"&&app.subType=="km"){
		getList(urlInitRankList);
	}else if(app.firstType=="runPlate"&&app.subType=="km"){
		getList(urlClassRankList,3);
	}
	setLocalStorage("firstType",app.firstType);
}

function moreList(){
	if(app.firstType=="runClass"&&app.subType=="km"){
		getList(urlInitRankList);
	}else if(app.firstType=="runPlate"&&app.subType=="km"){
		getList(urlClassRankList,3);
	}
}

function getList(url,value){
	app.offset = app.rankList?app.rankList.length:0;
	if(value==1){
		cycle_id=app.prev;
	}else if(value==2){
		cycle_id=app.next;
	}else{
		cycle_id=app.curr;
	}
	$.ajax({
		url: url ,
		type: "get",
		async: true,
		data:{
			count: app.count,
			offset: app.offset,
			team_id:id,
			cycle_id:cycle_id
		},
		dataType: "json",
		beforeSend:function(){
			$("#loadingToast").show();
		},
		complete:function(){
			$("#loadingToast").hide();
		},
		success:function(data){
			
			if (data.status == 200) {
				if (url == urlClassRankList) {
					if (app.aaa == 0) {
			            app.firstRun = data.data.rank_list[0].distance;
	                }
	                app.aaa = 1;
				}

				if (app.firstType=='runClass') {

					app.rankList=data.data.rank_list;
					app.finish_date=data.data.finish_date;
					app.start_date=data.data.start_date;

					app.prev=data.data.cycle_id.prev;
					app.next=data.data.cycle_id.next;
					app.curr=data.data.cycle_id.current;

					if(!app.prev){
						$("#last-week").hide();
					}else{
						$("#last-week").show();

					}
					if(!app.next){
						$("#next-week").hide();
					}else{
						$("#next-week").show();
					}
					
	                if(app.start_date&&app.finish_date){
						var arr = app.start_date.split("-");
						app.start_date=arr[1]+"月"+arr[2]+"日";
						var arr1 = app.finish_date.split("-");
						app.finish_date=arr1[1]+"月"+arr1[2]+"日";
					}
			 
					app.user = data.data.user;
					if(data.data.user){
						app.user.progress = [];
						for(var i = 0; i < app.user.sign_in.length; i ++){
							app.user.progress.push({distance : app.user.sign_in[i]});
						}
					}
					app.class = data.data.team;
					app.class.team_id = id;
					if(data.data.flexible_rank_list!=null&&data.data.flexible_rank_list!=""&&data.data.flexible_rank_list.length!=0){
						app.flexRankList = data.data.flexible_rank_list;
					}
				}else{
					app.selfClass = data.data.self_rank;
				}

				if(data.data.rank_list==null||data.data.rank_list==""||data.data.rank_list.length == 0){
					app.hasMore = false;
					app.rankList = [];
				}else{
					if(app.firstType=='runClass'){
						app.hasMore = true;
						// app.rankList = app.rankList?app.rankList.concat(data.data.rank_list):data.data.rank_list;
						app.rankList = data.data.rank_list;
						
					}
					else{
						if(data.data.rank_list.length < app.count){
							app.hasMore = false;
							app.rankList = app.rankList?app.rankList.concat(data.data.rank_list):data.data.rank_list;
						}else{
							app.hasMore = true;
							app.rankList = app.rankList?app.rankList.concat(data.data.rank_list):data.data.rank_list;
						}
					}
				}
			}
		},
		error: function(){
			/*app.firstType = "runPlate";
			getList(urlClassRankList);*/
			Alert.show({
				content:"您还没有参加跑班，赶快去加入吧！",
				sure:function(){
					window.location.href="/page/team/participation";
				}
			});
		}

	})
}
 <!-- 跑友墙 -->
// function getrunnerWall() {
// 	if(app.isClick){
// 		app.isClick=false;
// 	}else{
// 		app.isClick=true;
// 	}
// 	app.nextJoin=[];
// 	$.ajax({
// 		url: urlRunnerWall + "/" +id,
// 		type: "get",
// 		async: true,
// 		dataType: "json",
// 		beforeSend: function() {
// 			$("#loadingToast").show();
// 		},
// 		complete: function() {
// 			$("#loadingToast").hide();
// 		},
// 		success: function(data) {
// 			if (data.status == 200) {
// 				//app.nextJoin = data.data.next_participation;
// 				// app.nowJoin = data.data.participation;
// 		      if(data.data.next_participation){
// 				app.Fcount=data.data.next_participation.length;
// 				}
// 				if(app.isClick){
// 					app.nextJoin = data.data.next_participation;
					
// 					$(".jionpeople-all").find(".iconfont").removeClass("icon-xiangxia2").addClass("icon-xiangshang2");
// 					app.moreText = '收起';
					
// 				}else{
// 					if(data.data.next_participation.length>6){
// 						for(var i=0;i<6;i++){
// 						app.nextJoin.push(data.data.next_participation[i]);	
// 						}
// 					}else{
// 						app.nextJoin = data.data.next_participation;
// 					}
					
// 					$(".jionpeople-all").find(".iconfont").addClass("icon-xiangxia2");
// 					app.moreText = '展开全部';
// 				}
// 				app.team = data.data.team;
// 			} else {
// 				Alert.show({
// 					content: data.message
// 				})
// 			}
// 		},
// 		error: function() {
// 			Alert.show({
// 				content: "加载跑友墙失败，请重试",
// 				type: "alert",
// 				sureBtnText: "刷新一下",
// 				sure: function() {
// 					window.location.reload();
// 				}
// 			})
// 		}
// 	})
// }
function favorUserMe(userId){
	$.ajax({
		url: urlFavorUser,
		type: "post",
		async: true,
		data:{
			id:userId
			
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
				app.user.thumb_up_count = app.user.thumb_up_count + 1;
				app.user.thumb_up = true;
				for(var i = 0; i < app.rankList.length; i++){
					if(app.rankList[i].id==app.user.id){
						app.rankList[i].thumb_up_count = app.rankList[i].thumb_up_count + 1;
						app.rankList[i].thumb_up = true;
					}
				}
				
			}
		},
		error: function(){
			Alert.show({
		        content: "网络连接失败，请重试",
		        type: "alert",
		    });
		}
	})
}

function favorUserOther(index){
	$.ajax({
		url: urlFavorUser,
		type: "post",
		async: true,
		data:{
			id:app.rankList[index].id
			
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
				app.rankList[index].thumb_up_count = app.rankList[index].thumb_up_count + 1;
				app.rankList[index].thumb_up = true;
				if(app.user){
					if(app.rankList[index].id==app.user.id){
						app.user.thumb_up_count = app.user.thumb_up_count + 1;
						app.user.thumb_up = true;
					}
				}
			}
		},
		error: function(){
			Alert.show({
		        content: "网络连接失败，请重试",
		        type: "alert",
		    });
		}
	})
}

function favorUserOtherFlex(index){
	$.ajax({
		url: urlFavorUser,
		type: "post",
		async: true,
		data:{
			id:app.flexRankList[index].id,
			
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
				app.flexRankList[index].thumb_up_count = app.flexRankList[index].thumb_up_count + 1;
				app.flexRankList[index].thumb_up = true;
				if(app.user){
					if(app.flexRankList[index].id==app.user.id){
						app.user.thumb_up_count = app.user.thumb_up_count + 1;
						app.user.thumb_up = true;
					}
				}
			}
		},
		error: function(){
			Alert.show({
		        content: "网络连接失败，请重试",
		        type: "alert",
		    });
		}
	})
}

function cancelFavorUserMe(userId){
	$.ajax({
		url: urlCancelFavor,
		type: "post",
		async: true,
		data:{
			id:userId
			
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
				app.user.thumb_up_count = app.user.thumb_up_count - 1;
				app.user.thumb_up = false;
				for(var i = 0; i < app.rankList.length; i++){
					if(app.rankList[i].id==app.user.id){
						app.rankList[i].thumb_up_count = app.rankList[i].thumb_up_count - 1;
						app.rankList[i].thumb_up = false;
					}
				}
			}
		},
		error: function(){
			Alert.show({
		        content: "网络连接失败，请重试",
		        type: "alert",
		    });
		}
	})
}

function cancelFavorUserOther(index){
	$.ajax({
		url: urlCancelFavor,
		type: "post",
		async: true,
		data:{
			id:app.rankList[index].id
			
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
				app.rankList[index].thumb_up_count = app.rankList[index].thumb_up_count - 1;
				app.rankList[index].thumb_up = false;
				if(app.user){
					if(app.rankList[index].id==app.user.id){
						app.user.thumb_up_count = app.user.thumb_up_count - 1;
						app.user.thumb_up = false;
					}
				}
			}
		},
		error: function(){
			Alert.show({
		        content: "网络连接失败，请重试",
		        type: "alert",
		    });
		}
	})
}

function cancelFavorUserOtherFlex(index){
	$.ajax({
		url: urlCancelFavor,
		type: "post",
		async: true,
		data:{
			id:app.flexRankList[index].id,
			
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
				app.flexRankList[index].thumb_up_count = app.flexRankList[index].thumb_up_count - 1;
				app.flexRankList[index].thumb_up = false;
				if(app.user){
					if(app.flexRankList[index].id==app.user.id){
						app.user.thumb_up_count = app.user.thumb_up_count - 1;
						app.user.thumb_up = false;
					}
				}
			}
		},
		error: function(){
			Alert.show({
		        content: "网络连接失败，请重试",
		        type: "alert",
		    });
		}
	})
}

Vue.filter('backgroundColor', function (value) {
	//console.log(value)
	var color = "";
    if(value < 5 && value > 0){
    	color = "#59ba3a";
    }else if(value >= 5 && value < 10){
    	color = "#3d9fe6";
    }else if(value >= 10 && value < 21){
    	color = "#ea8c2e";
    }else if(value >= 21 && value < 41){
    	color = "#f14246";
    }else if(value >= 41 && value < 99){
    	color = "#8d4bbb";
    }else if(value >= 99){
    	color = "#b8a027";
    }else if(value == null){
    	color = "#fff";
    }else{
    	color = "#c8c8c8";
    }
    return color;
})
