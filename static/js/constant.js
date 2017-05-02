var urlHead = "http://hm.runorout.com/";
// var urlHead = "/"
/*加入跑班相关*/
var urlGetIndex = urlHead + "init/v2/teams"; //加入跑班初始进入
var urlGetIndexSearch = urlHead + "teams/search"; //加入跑班，搜索
var urlGetClassInfo = urlHead + "init/team"; //加入跑班，班级详情
var urlGetActivityList = urlHead + "init/activities"; //活动列表页
var urlContinuedClass = urlHead + "init/user/param/autorenew";//自动续班页面进入

var urlContinuedClassSet=urlHead + "ajax/user/param/autorenew";//自动续班页面设置

/*创建跑班相关--班级管理相关*/
var urlCreateClass = urlHead + "team"; //提交创建跑班
var urlUpdateClass = urlHead + "team"; //更新跑班信息（二维码等）

/*用户相关*/
var urlGetLastClass = urlHead + "user/team"; //获取最近一次报名班级
var urlSignIn = urlHead + "sign_in"; //提交打卡
var urlSignInInit = urlHead + "init/sign_in"; //打卡初始化
var urlGetOneSignIn = urlHead + "check_sign_in"; //查作业初始化
var urlCheckSignIn = urlHead + "sign_in/judgment"; //提交检查结果

var urlCheckSignInInit = urlHead + "init/check/sign_in"; //查作业V2版
var urlGetAjaxCheckSignIn = urlHead + "ajax/check/sign_in"; //查作业V2版获取接口
var urlJudgmentSignIn = urlHead + "ajax/check/sign_in/judge"; //判断作业
var urlGetAjaxCheckSignInHistory = urlHead + "ajax/check/sign_in/history"; //查作业V2版获取接口-历史

var urlGetUserCenter = urlHead + "init/user_home"; //个人中心数据初始化
var urlGetSignInRecord = urlHead + "user/calendar"; //获取打卡记录

var urlGetAccoutInfo = urlHead + "init/user_account"; //个人账户
var urlGetMoneyDetails = urlHead + "money_tally"; //资金详情

var urlUserInfoInit = urlHead + "init/user_info"; //个人信息进入页面
var urlUpdateUserInfo = urlHead + "user_info"; //更新个人信息

var urlGetMyClass = urlHead + "init/user/team/history"; //我的跑班页面

var urlSubFeedBack = urlHead + "feedback/advice";
var urlSubReport = urlHead + "feedback/report";

var urlSettingTimeInit = urlHead + "init/user/param/alert"; //设置打卡提醒是否开启
var urlSettingTime = urlHead + "ajax/user/param/alert"; //设置打卡提醒时间

/*用户排名*/
var urlInitRankList = urlHead + "init/v2/rank/team"; //距离-班级排名页面初始化
var urlDistanceRankList = urlHead + "init/v2/rank/team"; //距离-班级排名页面
var urlInitPlateRankList = urlHead + "init/v2/rank/global"; //距离-平台排名页面初始化
var urlPlateRankList = urlHead + "rank/global"; //距离-平台排名页面
var urlClassRankList = urlHead + "init/rank/teams";

var urlRunnerWall = urlHead + "init/team/wall"; //跑友墙

var urlFavorUser = urlHead + "thumb_up"; //点赞
var urlCancelFavor = urlHead + "thumb_up/cancel"; //取消点赞

/*支付相关*/
var urlPayOrder = urlHead + "order"; //创建支付订单
var urlGetOrderMoney = urlHead + "order/price"; //获得订单价格等
var urlGetUserAccoutMoney = urlHead + "user/money"; //获取用户账户余额
var urlPayByAccount = urlHead + "pay/account"; //用账户支付

var urlGetWeiPayId = urlHead + "pay/weixin"; //微信支付(老接口)

var urlGetWeiPayId2 = urlHead + "ajax/v2/pay"; //微信公开课支付（新支付接口）
var urlWithdraw = urlHead + "withdraw"; //提现

/* 积分商城 */
var urlPoint = urlHead + "init/point"; //积分首页
var urlPointTally = urlHead + "init/point/point_tally"; //积分列表
var urlPointTask = urlHead + "init/v2/point/point_task"; //赚积分

//商品支付
var urlShopOrder=urlHead + "v2/order";//下订单
var urlShopPay=urlHead + "v2/pay";//支付

var urlShop = urlHead + "init/shop"; //商城首页
var urlShopItem = urlHead + "init/shop/item"; //每个商品
var urlShopItemPool = urlHead + "init/shop/item/pool"; //拉取可以使用道具的班级种和时间
var urlShopItemOrder = urlHead + "shop/item/order"; //提交兑换信息

var urlshopInfo=urlHead+"ajax/v2/order";
var urlshopPay=urlHead+"ajax/v2/pay";

/***** 公用方法 *****/
var urlUploadImg = urlHead + "upload"; //上传图片
var urlGetConfig = urlHead + "jssdk/config"; //获取微信接口参数
var urlGetInviteCard = urlHead + "card/invite"; //获取邀请卡

//截取url参数
$.getUrlParam = function(name) { //获取url参数
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//检测动画是否完成
$.fn.transitionEnd = function(callback) {
    var events = ['webkitTransitionEnd', 'transitionend'],
        i, dom = this;

    function fireCallBack(e) {
        /*jshint validthis:true */
        if (e.target !== this) return;
        callback.call(this, e);
        for (i = 0; i < events.length; i++) {
            dom.off(events[i], fireCallBack);
        }
    }
    if (callback) {
        for (i = 0; i < events.length; i++) {

            dom.on(events[i], fireCallBack);
        }
    }
    return this;
};

//校验手机号
function checkTel(value) {
    var isMob = /^((\+?86)|(\(\+86\)))?(13[0123456789][0-9]{8}|15[0123456789][0-9]{8}|18[0123456789][0-9]{8}|17[0123456789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
    if (isMob.test(value)) {
        return true;
    } else {
        return false;
    }
}

function setLocalStorage(key, value) {
    window.sessionStorage[key] = value;
}

function getLocalStorage(key, defaultValue) {
    return window.sessionStorage[key] || defaultValue;
}

function removeLocalStorage(key) {
    window.sessionStorage.removeItem(key);
}

function setCookie(c_name, value, expiredays) {
    //alert(c_name)
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}

//取回cookie
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
//转化为两位小数
function toDecimal2(x) {
    var resalt = "";
    if (x != null && x != "") {
        var f = parseFloat(x);
        if (isNaN(f)) {
            return false;
        }
        var f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }
        resalt = s;
    } else {
        resalt = "0.00"
    }
    return resalt;
}
Vue.filter('toDecimal2',function(x) {
    var resalt = "";
    if (x != null && x != "") {
        var f = parseFloat(x);
        if (isNaN(f)) {
            return false;
        }
        var f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }
        resalt = s;
    } else {
        resalt = "0.00"
    }
    return resalt;

})
Vue.filter('notNull', function(value) {
    if (value != null && value != '') {
        return value;
    } else {
        return '--';
    }
})

Vue.filter('chooseNumber', function(value) {
    if (value != null && value != '') {
        if (value.length <= 5) {
            return value.length;
        } else {
            return 5;
        }
    } else {
        return "";
    }
})

Vue.filter('nullImg', function(value) {
    if (value != null && value != '') {
        return value;
    } else {
        return 'https://www.runorout.cn/images/photo.png';
    }
})
Vue.filter('nullName', function(value) {
    if (value != null && value != '') {
        return value;
    } else {
        return 'RO';
    }
})
Vue.filter('toMoney', function(value) {
    var resalt = "";
    if (value != null && value != "") {
        var f = parseFloat(value);
        if (isNaN(f)) {
            return false;
        }
        var f = Math.round(value * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }
        resalt = s;
    } else {
        resalt = "0.00"
    }
    return resalt;
})

Vue.filter('toDate', function(value) {
    var now = new Date(parseInt(value) * 1000);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    var date = now.getDate();
    if (date < 10) {
        date = "0" + date;
    }
    var hour = now.getHours();
    if (hour < 10) {
        hour = "0" + hour;
    }
    var minute = now.getMinutes();
    if (minute < 10) {
        minute = "0" + minute;
    }
    var second = now.getSeconds();
    if (second < 10) {
        second = "0" + second;
    }
    return year + "-" + month + "-" + date + " " + hour + ":" + minute;
})

Vue.filter('yearCut', function(value) {
    if (value != null && value != '') {
        var arr = value.split(" ")[0].split("-");
        return parseInt(arr[1]) + "." + parseInt(arr[2]);
    } else {
        return '--';
    }
});

Vue.filter('timestamp', function(value) {
    if (value != null && value != '') {
        return getLocalTime(value).split(" ")[0];
    } else {
        return '--';
    }
});

Vue.filter('reverseTime', function(value) {
    if (value != null && value != '') {
        return timeTranse(value);
    } else {
        return '00:00';
    }
});

function toMonth(value) {
    var arr = value.split("-");
    return (arr[1] + "." + arr[2]);
}

//时间戳转日期
function getLocalTime(nS) {
    var now = new Date(parseInt(nS) * 1000);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    var date = now.getDate();
    if (date < 10) {
        date = "0" + date;
    }
    var hour = now.getHours();
    if (hour < 10) {
        hour = "0" + hour;
    }
    var minute = now.getMinutes();
    if (minute < 10) {
        minute = "0" + minute;
    }
    var second = now.getSeconds();
    if (second < 10) {
        second = "0" + second;
    }
    return year + "-" + month + "-" + date + " " + hour + ":" + minute;
}

//检测是否为两位小数
function checkMoney(s) {
    var temp = /^[0-9]*(\.[0-9]{1,2})?$/;
    var isTrue = true;
    if (!temp.test(s)) {
        isTrue = false;
    }
    return isTrue;
}

function checkAge(value) {
    var r = /^[-+]?\d*$/;
    if (r.test(value)) {
        return true;
    } else {
        return false;
    }
}

function getToday() {
    var today = new Date();
    var month = today.getMonth() + 1;

    if (month < 10) {
        month = "0" + month;
    }
    var day = today.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    return today.getFullYear() + "-" + (month) + "-" + day;
}

function addByTransDate(dateParameter, num) { //dateParameter是2006-12-18格式 
    var translateDate = "",
        dateString = "",
        monthString = "",
        dayString = "";
    translateDate = dateParameter.replace("-", "/").replace("-", "/");
    var newDate = new Date(translateDate);
    newDate = newDate.valueOf();
    newDate = newDate + num * 24 * 60 * 60 * 1000;
    newDate = new Date(newDate);
    //如果月份长度少于2，则前加 0 补位   
    if ((newDate.getMonth() + 1).toString().length == 1) {
        monthString = 0 + "" + (newDate.getMonth() + 1).toString();
    } else {
        monthString = (newDate.getMonth() + 1).toString();
    }
    //如果天数长度少于2，则前加 0 补位   
    if (newDate.getDate().toString().length == 1) {
        dayString = 0 + "" + newDate.getDate().toString();
    } else {
        dayString = newDate.getDate().toString();
    }
    dateString = newDate.getFullYear() + "-" + monthString + "-" + dayString;
    return dateString;
}

function DateDiff(startDate, endDate) {
    // console.log(startDate + "," + endDate);
    var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
    var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
    var dates = ((startTime - endTime)) / (1000 * 60 * 60 * 24);
    return dates;
}

var constantProvinceList = ["北京市", "上海市", "天津市", "重庆市", "河北省", "山西省", "内蒙古自治区", "辽宁省", "吉林省", "黑龙江省", "江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省", "河南省", "湖北省", "湖南省", "广东省", "广西壮族自治区", "海南省", "四川省", "贵州省", "云南省", "西藏自治区", "陕西省", "甘肃省", "宁夏回族自治区", "青海省", "新疆维吾尔族自治区", "香港特别行政区", "澳门特别行政区", "台湾省", "海外"];

var constantProvinceCodeList = [{
    name: '北京',
    code: '110000'
}, {
    name: '天津',
    code: '120000'
}, {
    name: '河北',
    code: '130000'
}, {
    name: '山西',
    code: '140000'
}, {
    name: '内蒙古',
    code: '150000'
}, {
    name: '辽宁',
    code: '210000'
}, {
    name: '吉林',
    code: '220000'
}, {
    name: '黑龙江',
    code: '230000'
}, {
    name: '上海',
    code: '310000'
}, {
    name: '江苏',
    code: '320000'
}, {
    name: '浙江',
    code: '330000'
}, {
    name: '安徽',
    code: '340000'
}, {
    name: '福建',
    code: '350000'
}, {
    name: '江西',
    code: '360000'
}, {
    name: '山东',
    code: '370000'
}, {
    name: '河南',
    code: '410000'
}, {
    name: '湖北',
    code: '420000'
}, {
    name: '湖南',
    code: '430000'
}, {
    name: '广东',
    code: '440000'
}, {
    name: '广西',
    code: '450000'
}, {
    name: '海南',
    code: '460000'
}, {
    name: '重庆',
    code: '500000'
}, {
    name: '四川',
    code: '510000'
}, {
    name: '贵州',
    code: '520000'
}, {
    name: '云南',
    code: '530000'
}, {
    name: '西藏',
    code: '540000'
}, {
    name: '陕西',
    code: '610000'
}, {
    name: '甘肃',
    code: '620000'
}, {
    name: '青海',
    code: '630000'
}, {
    name: '宁夏',
    code: '640000'
}, {
    name: '新疆',
    code: '650000'
}, {
    name: '台湾',
    code: '710000'
}, {
    name: '香港',
    code: '810000'
}, {
    name: '澳门',
    code: '820000'
}, {
    name: '海外',
    code: '000000'
}, ];

function netWorkError(words) {
    var str = '<div class="alert-out" id="alert-out-error">' + '<div class="alert-body">' + '<div class="alert-message">' + '<p class="alert-word">' + (words ? words : '啊哦，网络跑累了正在休息，快叫醒它吧~') + '</p>' + '</div>' + '<div class="alert-foot color-red" id="alert-foot" onclick="javascript:window.location.reload();"><span class="sure">刷新一下~</span></div>' + '</div>' + '<div class="alert-mask"></div>' + '</div>';

    var className = $("#alert-out-error").attr("class");

    if (className != null || className != "") {
        $("body").append(str);
    }
}

/* 加载loading引入 */
if ($("#loadingToast").attr("class") != null || $("#loadingToast").attr("class") != "") {
    var loadingStr = '<div id="loadingToast" class="dz_loading_toast" style="display: none;">' + '<div class="dz_mask_transparent"></div>' + '<div class="dz_toast_loading small">' + '<div class="dz_loading">' + '<div class="dz_loading_leaf dz_loading_leaf_0"></div><div class="dz_loading_leaf dz_loading_leaf_1"></div><div class="dz_loading_leaf dz_loading_leaf_2"></div><div class="dz_loading_leaf dz_loading_leaf_3"></div><div class="dz_loading_leaf dz_loading_leaf_4"></div><div class="dz_loading_leaf dz_loading_leaf_5"></div><div class="dz_loading_leaf dz_loading_leaf_6"></div><div class="dz_loading_leaf dz_loading_leaf_7"></div><div class="dz_loading_leaf dz_loading_leaf_8"></div><div class="dz_loading_leaf dz_loading_leaf_9"></div><div class="dz_loading_leaf dz_loading_leaf_10"></div><div class="dz_loading_leaf dz_loading_leaf_11"></div>' + '</div>' + '</div>' + '</div>';
    $("body").append(loadingStr);
}


/*  
    //demo 
    var dialog = new Alert();
    dialog.init({
        content:"我是提示哦",
        sure: function(){
            dialog.hide();
        }
    })
*/