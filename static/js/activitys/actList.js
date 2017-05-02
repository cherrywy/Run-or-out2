var Alert = require('../../modules/alert.js');
var app = new Vue({
	el: '#activity-list-v',
	data: {
		activities: null,
	},
	methods: {

	}
});

$(function() {
	getInfo();
});

function joinClass() {
	var timestamp = new Date().getTime();
	window.location.href = "/page/team/participation?time=" + timestamp;
}

function gotoCreateClass() {
	var timestamp = new Date().getTime();
	window.location.href = "/page/team/creation?time=" + timestamp;
}

function getInfo() {
	$.ajax({
		url: urlGetActivityList,
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
				app.activities = data.data.activities;
			}
		},
		error: function() {
			Alert.show({
				content: "加载活动信息失败，请重试",
				type: "alert",
				sureBtnText: "刷新一下",
				sure: function() {
					window.location.reload();
				}
			})
		}
	});
}