var Alert = require('../../../modules/alert.js');
var app = new Vue({
	el: '#act-rank-v',
	data: {
		type: '100',
		myTeamId: '58188bb46da0df36cf337bdd', //我的战队
		myTeamList: [
			{	
				name: '挑战自我',
				id: '58188bb46da0df36cf337bdd'
			},
			{
				name: '追风魅跑',
				id: '58188bed6da0df38f9337bfb'
			},
			{
				name: '百日Hi嗨跑',
				id: '58188c306da0df3bb5337c25'
			},
			{
				name: '百日同行',
				id: '58188c3f6da0df3c99337c2f'
			},
			{
				name: '永嘉风铃',
				id: '581c2b176da0df731334b6e7'
			},
			{
				name: '健跑相守',
				id: '581c351c6da0df41a434b8a7'
			},
			{
				name: '飞跑百天',
				id: '58213e896da0df6d403627ee'
			},
			{
				name: '怂马百战',
				id: '58185fdc6da0df22c2336bd7'
			},
			//120天
			{	
				name: '鱼游队',
				id: '5819512d6da0df5cea33c61a'
			},
			{
				name: '黎明脚步',
				id: '5819515a6da0df5d7433c621'
			},
			{
				name: '闪电007',
				id: '5819515b6da0df5d8433c623'
			},
			{
				name: '奔跑骑士',
				id: '5819515c6da0df5d8c33c625'
			},
			{
				name: '呼啸山庄',
				id: '5819515d6da0df5d9433c627'
			},
			{
				name: '跑在一起',
				id: '581b60116da0df2622347f34'
			},
			{
				name: '追风魅跑二班',
				id: '581c12346da0df3e9934b27a'
			}
		], //我的战队列表
		groupList: null, //战队列表
		myTeamRankList: null, //我的战队排名列表
		user: null, //我的个人排名
		count: 20,
		offset: 0,
		pageFlag: true,
		canRequest: true,
	},
	methods: {
		gotoIndex: function(){
			var timestamp=new Date().getTime();
            window.location.href = "/page/activity/hundred_day3?time=" + timestamp;
		},
		wansailv: function(){
			Alert.show({
				content: "完赛率 = 全战队已打卡天数/全战队应打卡天数",
				sureBtnText: "我知道了"
			});
		},
		chooseMyTeam: function(id){
			var isChangeTeam = (app.myTeamId == id) ? false : true;
			app.myTeamId = id;
			app.count = 20;
			app.offset = 0;
			app.pageFlag = true;
			app.canRequest = true;
			getMyTeam(isChangeTeam);
		}
	}
})

$(function() {
	if(app.type != 'mine'){
		getGroup();
	}

	$('.tab').on('click','.flex-item',function(){
		app.type = $(this).attr('data-type');
		if(app.type != 'mine'){
			getGroup();
		}else{
			app.count = 20;
			app.offset = 0;
			app.pageFlag = true;
			app.canRequest = true;
			getMyTeam();
		}
		// $(this).addClass('active').siblings().removeClass('active');
	});
})

$(window).on("scroll", function() {
	if(app.type == 'mine'){
		var $this = $(document),
			viewH = $(this).height(),
			contentH = $(document).height(), //内容高度
			scrollTop = $(window).scrollTop(); //滚动高度
		// console.log(viewH + "," + contentH + "," + scrollTop);
		if (scrollTop / (contentH - viewH) >= 0.95) { //到达底部0px时,加载新内容
			if (!app.pageFlag) { //不再继续滚动，弹出提示框

			} else {
				if (app.canRequest) {
					getMyTeam();
				}
			}
		}
	}
});

function getGroup(){
	$.ajax({
		url: urlHead + "init/activity/hundred_day3/rank/group",
		type: "get",
		async: true,
		data: {
			type: app.type
		},
		dataType: "json",
		beforeSend: function() {
			$("#loadingToast").show();
		},
		complete: function() {
			$("#loadingToast").hide();
		},
		success: function(data) {
			if (data.status == 0) {
				app.groupList = data.data.teams;
			} else {
				Alert.show({
					content: data.message,
					type: "alert",
				})
			}
		},
		error: function() {
			// Alert.show({
			// 	content: "哎呀，获取活动信息失败，请重试",
			// 	type: "alert",
			// 	sureBtnText: "刷新一下",
			// 	sure: function() {
			// 		window.location.reload();
			// 	}
			// })
		}
	})
}

function getMyTeam(isChangeTeam){
	app.canRequest = false;
	if(isChangeTeam){
		app.myTeamRankList = null;
	}
	app.offset = app.myTeamRankList ? app.myTeamRankList.length : 0;
	$.ajax({
		url: urlHead + "init/activity/hundred_day3/rank/team",
		type: "get",
		async: true,
		data: {
			id: app.myTeamId,
			count: app.count,
			offset: app.offset
		},
		dataType: "json",
		beforeSend: function() {
			$("#loadingToast").show();
		},
		complete: function() {
			$("#loadingToast").hide();
			app.canRequest = true;
		},
		success: function(data) {
			if (data.status == 0) {
				if (data.data.ranks && data.data.ranks.length != 0) {
					if (app.myTeamRankList == null) {
						app.myTeamRankList = data.data.ranks;
					} else {
						app.myTeamRankList = app.myTeamRankList.concat(data.data.ranks);
					}
				} else {
					app.pageFlag = false;
					app.hasMore = false;
				}
				if (data.data.user) {
					app.user = data.data.user;
				}
			} else {
				Alert.show({
					content: data.message,
					type: "alert",
				})
			}
		},
		error: function() {
			
		}
	})
}