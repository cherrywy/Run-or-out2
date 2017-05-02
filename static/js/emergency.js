var Alert = require('../modules/alert.js');

// Alert.show({
// 	content: 'change',
// 	type: 'alert'
// })

var app = new Vue({
	el: '#v-response',
	data: {
		headGuide: 1,
		pageGuide: '',
		questionIndex: '',

	},
	methods: {
		hideCode: function(){
			window.history.go(-1);
		}
	}
});

location.hash = '';

$(window).on('hashchange', function(){
	var hash = location.hash;
    if(hash){	
    	app.pageGuide = hash.replace('#','');
    	if(app.pageGuide == 'human'){
   			setTimeout(function(){
   				var height = parseInt($(".fullpage-pop-head").height())+parseInt($(".fullpage-pop-body").css("padding").replace('px', ''))+parseInt($(".fullpage-pop-body").find("img").height());
				var winHeight = parseInt($(window).height());
				var iconHeight = parseInt($(".fullpage-pop-body").find(".iconfont").height());
				$(".fullpage-pop-body").find(".icon-guanbi1").css("margin-top" , ((winHeight - height - iconHeight)/2));
   			},0);
    	}
	}else{
		app.pageGuide = '';
	}      
});

$(function(){
	$(".head").find(".flex-item").each(function(index) {
		MtaH5.clickStat('emergency_quickGuide');
		$(this).on("click", function(){
			app.headGuide = index + 1;
		})
	});

	$(".slide-left").on("click",".question",function(){
		$(this).siblings('.answer').toggleClass('show');
	});

	$(".slide-left").on("click",".show-more",function(){
		$(this).siblings('.answer').toggleClass('show');
	});

	$(".emergency-body").find(".right").on("click",'.text',function(e){
		e.preventDefault(); 
		app.questionIndex = $(this).index();
		location.href = $(this).parents('a').attr('data-href');
	});
	
	$("#moyanhaha").on("click",function(){
		MtaH5.clickStat('moyanhaha');
	});
});
