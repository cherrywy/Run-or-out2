var Alert = require('../modules/alert.js');
var id = $.getUrlParam("id");
var app = new Vue({
	el: '#runner-wall-v',
	data: {
		team: null,
		recentJoin: null,
		nowJoin: null,
		nextJoin: null,
	},
	methods: {

	}
})

$(function() {
	getList();
})

function getList() {
	$.ajax({
		url: urlRunnerWall + "/" + id,
		type: "get",
		async: true,
		dataType: "json",
		beforeSend: function() {
			$("#loadingToast").show();
		},
		complete: function() {
			$("#loadingToast").hide();
		},
		success: function(data) {
			if (data.status == 200) {
				app.nextJoin = data.data.next_participation;
				app.nowJoin = data.data.participation;
				app.team = data.data.team;
			} else {
				Alert.show({
					content: data.message
				})
			}
		},
		error: function() {
			Alert.show({
				content: "加载跑友墙失败，请重试",
				type: "alert",
				sureBtnText: "刷新一下",
				sure: function() {
					window.location.reload();
				}
			})
		}
	})
}