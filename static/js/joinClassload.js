var Alert = require('../modules/alert.js');
var app = new Vue({
    el: '#join-class-v',
    data: {
        closeTime: 150, //选择后保持时间
        distance: getLocalStorage("distance") ? getLocalStorage("distance") : "", //跑步距离
        day: getLocalStorage("day") ? getLocalStorage("day") : "", //出勤天数
        week: "", //报名周数
        min: getLocalStorage("min") ? getLocalStorage("min") : "", //契约金
        max: getLocalStorage("max") ? getLocalStorage("max") : "", //契约金
        //province: "", //选择省份
        province: getLocalStorage("province") ? getLocalStorage("province") : "",//选择省份
        position: constantProvinceCodeList, //省份列表
        //tag: [], //选择标签
        //tagList: null, //热门标签列表 
        tagList:getLocalStorage("tagList") ? getLocalStorage("tagList") : null,
        tag : getLocalStorage("tag") ? getLocalStorage("tag") : [],
        
        //startDay: null,
        startDay:getLocalStorage("startDay") ? getLocalStorage("startDay") : "",
        startDayWords: getLocalStorage("startDayWords") ? getLocalStorage("startDayWords") : '',
        dayList: [], //日期组
        showMore: false,
        groupClassList: null,
        popularClassList: null,
        normalClassList: null,
        noMore: false,
        isSearch: false,
        participation: getLocalStorage("participation") ? getLocalStorage("participation") : null,
        activities: getLocalStorage("activities") ? getLocalStorage("activities") : [],
        count: 20,
        offset: 0,
        pageFlag: true,
        pageMore: true,
        canRequest: true,
        listFrom:getLocalStorage("list") ? getLocalStorage("list") : "",
    },
    methods: {
        gotoActList: function(){
            var timestamp=new Date().getTime();
            window.location.href = "/page/activity/list?time=" + timestamp;
        },
        joinActivity: function(){
            var timestamp=new Date().getTime();
            window.location.href = "/page/activity/hundred_day3?time=" + timestamp;
        },
        gotoRankList: function(){
            var timestamp=new Date().getTime();
            window.location.href = "/page/rank?id="+(this.participation?this.participation.id:"")+"&time=" + timestamp;
        }
    }
})

Vue.filter('tags', function (value) {
    if(value!=null&&value!=''){
        var arr = value.split(',');
        var str = '';
        for(var i = 0; i < arr.length; i++){
            str += arr[i] + ' ';
        }
        return str;
    }else{
        return '';
    }
})

Vue.filter('continueDay', function (value) {
    if(value!=null&&value!=''){
        var number = DateDiff(value,getToday());
        if(number < 0){
            return 0;
        }else{
            return number;
        }
    }else{
        return '--';
    }
})

Vue.filter('activeColor', function (value) {
    //console.log(value);
    if(value == 'couple'){
        return '#ff4081';
    }else if(value == 'hundred_day'){
        return '#601986';
    }else if(value == 'fangduoduo'){
        return '#11cd6e';
    }else{
        return '#f56218';
    }
})

function getDayList() {
    var nowDay = new Date();
    var nowDayTime = nowDay.getTime();
    var oneDayTimeStamp = 86400000; //一天的时间戳长度
    var list = [0, 1, 2, 3, 4];
    var weekArr = ['日', '一', '二', '三', '四', '五', '六'];
    for (var i = 0; i < list.length; i++) {
        var now = new Date((nowDayTime + oneDayTimeStamp * list[i]));
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var date = now.getDate();
        if (date < 10) {
            date = "0" + date;
        }
        var weekDay = '周' + weekArr[now.getDay()];
        var dayInfo = {
            dayWords: year + "-" + month + "-" + date, //+ "(" + weekDay + ")",
            date: year + "-" + month + "-" + date
        }

        app.dayList.push(dayInfo);
    }
}

$(function() {
    getDayList();
    if (checkSearch()) {
        getList();
    } else {
        getListIndex()
    }
    
     $("#search-province").on("click",function(){
    	MtaH5.clickStat('joinClass_province');
    });

    $(".class-body").on("click",".iconclick",function(e){
        e.preventDefault();
        $(this).parent().hide().siblings('.rules').show();
    });

    $(".search-item-first").on("click", ".drop", function(e) {
        var index = $(this).index() + 1;
        // $(".search-item-second .drop").removeClass("active");
        $(this).toggleClass("active").siblings(".drop").removeClass("active");
        $(".search-drop-" + index).toggleClass("show").siblings(".search-drop").removeClass("show");
        $(".drop").each(function() {
            if ($(this).attr("class").indexOf("active") != -1) {
                $(".drop-bg").show();
                return false;
            } else {
                $(".drop-bg").hide();
            }
        })
    })

    $(".show-more-drop").on("click", function() {
        $(this).toggleClass("active-2");
        $(".search-item-second").toggleClass("show-more").find(".drop").removeClass("active");
        $(".search-drop-4").removeClass("show");
        $(".search-drop-5").removeClass("show");
        $(".drop").each(function() {
            if ($(this).attr("class").indexOf("active") != -1) {
                $(".drop-bg").show();
                return false;
            } else {
                $(".drop-bg").hide();
            }
        })
    })

    $(".search-item-second").on("click", ".drop", function() {
        var index = $(this).index() + 4;
        $(".search-item-first .drop").removeClass("active");
        $(this).toggleClass("active").siblings(".drop").removeClass("active");
        $(".search-drop-" + index).toggleClass("show").siblings(".search-drop").removeClass("show");

        $(".drop").each(function() {
            if ($(this).attr("class").indexOf("active") != -1) {
                $(".drop-bg").show();
                return false;
            } else {
                $(".drop-bg").hide();
            }
        })
    })

    $(".search-drop-1").on("click", ".item", function() {
        $(this).addClass("active").siblings().removeClass("active");
        $(".drop").removeClass("active");
        $(".search-drop").removeClass("show");
        $(".drop-bg").hide();
        app.distance = $(this).attr("data-value");
        initData();
        if (checkSearch()) {
            getList();
        } else {
            getListIndex()
        }

    })

    $(".search-drop-2").on("click", ".item", function() {
        $(this).addClass("active").siblings().removeClass("active");
        $(".drop").removeClass("active");
        $(".search-drop").removeClass("show");
        $(".drop-bg").hide();
        app.day = $(this).attr("data-value");
        initData();
        if (checkSearch()) {
            getList();
        } else {
            getListIndex()
        }
    })

    $(".search-drop-3").on("click", ".item", function() {
        $(this).addClass("active").siblings().removeClass("active");
        $(".drop").removeClass("active");
        $(".search-drop").removeClass("show");
        $(".drop-bg").hide();
        app.max = $(this).attr("data-value-max");
        app.min = $(this).attr("data-value-min");
        initData();
        if (checkSearch()) {
            getList();
        } else {
            getListIndex()
        }
    })

    $(".search-drop-4").on("click", ".item", function() {
        $(this).addClass("active").siblings().removeClass("active");
        $(".drop").removeClass("active");
        $(".search-drop").removeClass("show");
        $(".drop-bg").hide();
        app.startDay = $(this).attr("data-value");
        app.startDayWords = $(this).text();
        initData();
        if (checkSearch()) {
            getList();
        } else {
            getListIndex()
        }
    })

    $("#class-province").on("change",function(){
        initData();
        if (checkSearch()) {
            getList();
        } else {
            getListIndex()
        }
    });

    $('.join-tags-list').on('click', '.tag', function(){
        $(this).toggleClass('active');
        if($(this).attr('class').indexOf('active')!=-1){
            app.tag.push($(this).attr('data-id'));
        }else{
            app.tag.splice($.inArray($(this).attr('data-id'),app.tag),1); 
        }
        
        initData();
        if (checkSearch()) {
            getList();
        } else {
            getListIndex()
        }
    });

    $(window).on("scroll",function(){
        var $this =$(document),
        viewH =$(this).height(),
        contentH =$(document).height(),//内容高度
        scrollTop =$(window).scrollTop();//滚动高度
        if(scrollTop/(contentH - viewH)>=0.95){ //到达底部0px时,加载新内容
          if(!app.pageFlag){//不再继续滚动，弹出提示框
			$(".loading").hide();
			$(".loading-over").show();
          }else{
            if(app.canRequest){
                app.offset = app.offset + app.count;
                if (checkSearch()) {
                    getList();
                } else {
                    getListIndex()
                }
            }
          }
        }
    });

})

function initData(){
    app.offset = 0;
    app.pageFlag = true;
    app.pageMore = true;
    $(window).scrollTop(0);
}

//没有搜索条件的时候的加载
function getListIndex(pageNumber) {
    app.isSearch = false;
    app.noMore = false;
    app.canRequest = false;
    $.ajax({
        url: urlGetIndex,
        type: "get",
        async: true,
        data: {
            offset: app.offset,
            count: app.count
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
            if (data.status == 200) {
                if(app.offset==0){
                    //app.popularClassList = data.data.popular;
                    //推荐班级
                    app.groupClassList = data.data.group;
                    //正在参加的活动
                    app.activities = data.data.activities;
                    //正在参加的跑班
                    app.participation = data.data.participation;
                    //标签列表
                    app.tagList = data.data.tags;
                    
                    var  tagListTmp=JSON.stringify(app.tagList);
                    
                    var activitiesTmp=JSON.stringify(app.activities);
                    var participationTmp=JSON.stringify(app.participation);
                    
                    setLocalStorage("activities",activitiesTmp);
                    setLocalStorage("participation",participationTmp);
                    setLocalStorage("tagList",tagListTmp);
                }
                if(data.data.normal){
                    if(app.offset == 0){
                    	//跑友发起
                        app.normalClassList = data.data.normal;
                    }else{
                        app.normalClassList = app.normalClassList.concat(data.data.normal);
                    }
                    if(data.data.normal.length < app.count){
                        app.pageFlag = false;
                        app.pageMore = false;
                    }
                }else{
                    app.pageFlag = false;
                }
            }
        },
        error: function() {
            Alert.show({
                content: "哎呀，获取班级列表失败了，请重试",
                type: "alert",
                sureBtnText: "刷新一下",
                sure: function(){
                    window.location.reload();
                }
            })
        }
    })
}
//有搜索条件时的加载
function getList(pageNumber) {
    app.isSearch = true;
    app.noMore = false;
    app.canRequest = false;
    var money = {
        min: app.min * 100 != 0 ? app.min * 100 : "",
        max: app.max * 100 != 0 ? app.max * 100 : ""
    }

    $.ajax({
        url: urlGetIndexSearch,
        type: "post",
        async: true,
        data: {
            distance: app.distance,
            money: money,
            duration: app.day,
            province: app.province,
            start_date: app.startDay,
            tag: app.tag.id,
            offset: app.offset,
            count: app.count
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
        	setLocalStorage("distance",app.distance);
        	setLocalStorage("money",money);
        	setLocalStorage("day",app.day);
        	setLocalStorage("province",app.province);
        	setLocalStorage("startDay",app.startDay);
        	setLocalStorage("tag",app.tag);
        	setLocalStorage("min", app.min);
        	setLocalStorage("max", app.max);
        	
        	setLocalStorage("startDayWords",app.startDayWords);
        	console.log(app.startDay+"  "+app.startDayWords)
            if (data.status == 200) {
            	if(typeof(app.tagList)!='object'){
                    app.tagList=JSON.parse(app.tagList);
                }
            	if(typeof(app.participation)!='object'){
            		
            		 app.participation=JSON.parse(app.participation);
            	}
            	if(typeof(app.activities)!='object'){
            		app.activities=JSON.parse(app.activities);
            	}
            	/*if(typeof(app.tag)!='object'){
            		app.tag=JSON.parse(app.tag);
            	}*/
            	/*if(typeof(app.day)!='object'){
            		app.day=JSON.parse(app.day);
            	}
            	if(typeof(app.startDay)!='object'){
            		app.startDay=JSON.parse(app.startDay);
            	}
            	if(typeof(app.money)!='object'){
            		app.money=JSON.parse(app.money);
            	}*/
            	if(typeof(app.tag)!='object'){
            		 app.tag=app.tag.split(",");
            	}
            	
            	for(var i=0;i<app.tag.length;i++){
            		for(var j=0;j<app.tagList.length;j++){
            			if(app.tagList[i].id==app.tag[j]){
            				 $('.join-tags-list').on('.tag', function(){
						        $(this).addClass('active');
						    });
            				
            			}
            		}
            	}
                if(data.data.teams.length!=0){
                	
                    if(app.offset == 0){
                        app.normalClassList = data.data.teams;
                        //tagList类型转换
                        //app.tagList=getLocalStorage("tagList").split(",");
                    }else{
                        app.normalClassList = app.normalClassList.concat(data.data.teams);
                    }
                    if(data.data.teams.length < app.count){
                        app.pageFlag = false;
                        app.pageMore = false;
                    }
                }else{
                    if(app.offset == 0){
                        app.noMore = true;
                    }
                    else{
                        app.pageMore = false;
                    }
                    app.pageFlag = false;
                }
            }
        },
        error: function() {
            Alert.show({
                content: "哎呀，获取班级列表失败了，请重试",
                type: "alert",
                sureBtnText: "刷新一下",
                sure: function(){
                    window.location.reload();
                }
            })
        }
    })
}

function strToJson(str){ 
var json = (new Function("return " + str))(); 
return json; 
} 

function checkSearch() {
    var hasSearchItem = true;
    if (app.distance || app.day || app.min || app.province || app.tag.length!=0 || app.startDay) {
        hasSearchItem = true;
    } else {
        hasSearchItem = false;
    }
    return hasSearchItem;
}

function gotoCreateClass() {
    window.location.href = "/page/team/creation";
}

function savePositionAndType() {
    //alert($(document).scrollTop())
    setLocalStorage("min", app.min);
    setLocalStorage("max", app.max);
    setLocalStorage("distance", app.distance);
    setLocalStorage("day", app.day);
    //alert(getLocalStorage("position"));
}