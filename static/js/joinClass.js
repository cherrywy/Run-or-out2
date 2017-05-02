var Alert = require('../modules/alert.js');
var app = new Vue({
    el: '#join-class-v',
    data: {
        all: 20, //总页数
        cur: 1,//当前页码
        type:0,
        body:[
             {className:"unlook"},
             {className:"unpass"},
             {className:"pass"},
             {className:"uncomimmt"},    
       ],
       gameNames:['魔兽世界', '暗黑破坏神Ⅲ', '星际争霸Ⅱ', '炉石传说', '风暴英雄',
      '守望先锋'],
       activeName: '',

        closeTime: 150, //选择后保持时间
        distance:"",
        day:"",
        //distance: getLocalStorage("distance") ? getLocalStorage("distance") : "", //跑步距离
        //day: getLocalStorage("day") ? getLocalStorage("day") : "", //出勤天数
        week: "", //报名周数
        //min: getLocalStorage("min") ? getLocalStorage("min") : "", //契约金
        //max: getLocalStorage("max") ? getLocalStorage("max") : "", //契约金
        min:"",
        max:"",
        province: "", //选择省份
        position: constantProvinceCodeList, //省份列表
        tag: [], //选择标签
        tagList: null, //热门标签列表 
        startDay: null,
        startDayWords: '',
        dayList: [], //日期组
        showMore: false,
        groupClassList: null,
        popularClassList: null,
        normalClassList: null,
        noMore: false,
        isSearch: false,
        participation: null,
        activities: null,
        count: 20,
        offset: 0,
        pageFlag: true,
        pageMore: true,
        canRequest: true,
        listFrom:getLocalStorage("list") ? getLocalStorage("list") : "",
    },
    computed: {
            indexs: function(){
              var left = 1
              var right = this.all
              var ar = [] 
              if(this.all>= 5){
                if(this.cur > 3 && this.cur < this.all-2){
                        left = this.cur - 3
                        right = this.cur + 2
                }else{
                    if(this.cur<=3){
                        left = 1
                        right = 4
                    }else{
                        right = this.all
                        left = this.all -3
                    }
                }
             }
            while (left <= right){
                ar.push(left)
                left ++
            }   
            return ar
           },
           showLast: function(){
                if(this.cur == this.all){
                    return false
                }
                return true
           },
           showFirst: function(){
                if(this.cur == 1){
                    return false
                }
               return true
            }
    },
    watch: {
        cur: function(oldValue , newValue){
                        console.log(arguments)
                }
    },
    methods: {
        //选中
      selected: function(gameName) {
          this.activeName = gameName
        },
       showTab:function( type){
            this. type= type;
        },
        //删
        btnClick: function(data){//页码点击事件
                if(data != this.cur){
                    this.cur = data 
                }
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
    // getDayList();
    // if (checkSearch()) {
    //     getList();
    // } else {
    //     getListIndex()
    // }
    
    $("#search-province").on("click",function(){
    	MtaH5.clickStat('joinClass_province');
    });

    $(".class-body").on("click",".iconclick",function(e){
    	MtaH5.clickStat('joinClass_KDM');
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
        var index = $(this).index() + 3;
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
    	MtaH5.clickStat('joinClass_distance');
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
    	MtaH5.clickStat('joinClass_day');
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
    	MtaH5.clickStat('joinClass_money');
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
	MtaH5.clickStat('joinClass_creatClass');
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