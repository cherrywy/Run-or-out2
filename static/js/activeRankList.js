var Alert = require('../modules/alert.js');
var id = $.getUrlParam("id");
var app = new Vue({
	el: '#rank-list-v',
	data: {
		closeTime: 1000, //选择后保持时间
		user: null,
		class: null,
		rankList: null,
		count: 10,
		offset: 0,
		hasMore: true,
		url: '',
		pageFlag: true,
		canRequest: true,
	},
	methods: {
		toClass: function(id) {
			window.location.href = "/page/team/detail?id=" + id;
		},
		toNormalRank: function() {
			window.location.href = "/page/redirect?action=rank";
		}
	}
})
$(function() {
	app.url = '/init/rank/hundred/577db8416da0df252b02a9ae';
	// getList(app.url);

	$('.active-tags').on('click', '.item', function() {
		initData();
		$(this).addClass('active').siblings().removeClass('active');
		app.url = $(this).attr('data-url');
		getList(app.url);
	});
});

function initData() {
	app.user = null;
	app.class = null;
	app.rankList = null;
	app.count = 10;
	app.offset = 0;
	app.hasMore = true;
	app.url = '';
	app.pageFlag = true;
	app.canRequest = true;
}

$(window).on("scroll", function() {
	var $this = $(document),
		viewH = $(this).height(),
		contentH = $(document).height(), //内容高度
		scrollTop = $(window).scrollTop(); //滚动高度
	console.log(viewH + "," + contentH + "," + scrollTop);
	if (scrollTop / (contentH - viewH) >= 0.95) { //到达底部0px时,加载新内容
		if (!app.pageFlag) { //不再继续滚动，弹出提示框

		} else {
			if (app.canRequest) {
				getList(app.url);
			}
		}
	}
});

function getList(url) {
	app.canRequest = false;
	app.offset = app.rankList ? app.rankList.length : 0;
	$.ajax({
		url: url,
		type: "get",
		async: true,
		data: {
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
					if (app.rankList == null) {
						app.rankList = data.data.ranks;
					} else {
						app.rankList = app.rankList.concat(data.data.ranks);
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
					content: data.message
				})
			}
		},
		error: function() {
			Alert.show({
				content: "排名加载失败，请重试"
			})
		}
	})
}