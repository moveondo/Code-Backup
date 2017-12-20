
var getQueryString = function(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
var loadStatus = function () {
    var _html = ('<div class="loading" style="position:fixed;background:#000;opacity:.8;padding:5px;border-radius:4px;left:50%;top:50%;margin-top:-20px;margin-left:-20px;display:block;z-index:999">\
                          <img src="//m.ppdaicdn.com/home/images/loading.gif" width="40" height="40">\
                        </div>');
    jQuery(_html).appendTo(jQuery('body'))
}

var closeLoadStatus=function () {
    var $load = jQuery('.loading');
    if ($load.length) {
        $load.remove();
    }
}




//写入cookie
var setCookie = function(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

//获取cookie
var getCookie = function(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
var accountClickNum = function(_html,txt){
    var _url = "//m.ppdai.com/loan/Users/ActionLog";
    jQuery.ajax({
        async: false,
        url: _url,
        data: {
            UserId: 0 ,
            FunctionName : _html,
            ActionId : 1000, //曹操贷老拉新5期
            Remark : txt,
            Parameter:""
        },
        type: "GET",
        dataType: 'json',
        success: function(data) {
            //console.log(data)
        }
    })
}

var msgReminder=function(txt,callback){
    var _html = '<div class="msg-wrap">\
                        <span class="msg">\
                            <span class="errmsg">'+txt+'</span>\
                        </span>\
                    </div>'
    jQuery(_html).appendTo(jQuery('body'));
    window.setTimeout(function(){
        var $msg = jQuery('.msg-wrap');
        $msg.remove();
    },2000)
    if(callback && typeof callback == 'function'){
        callback()
    }
}
 var getUserName = function(){
    var _url = "//m.ppdai.com/CaoCaoLoan/GetUser";
    jQuery.ajax({
        type : "POST",
        async:false,
        url : _url,
        dataType : "json",
        data:{},
        beforeSend: function () {
            loadStatus();
        },
        success : function(data){
            var _uName = data.UserName;
            setCookie('ccdUname',_uName,30)
        },
        complete: function () {
            closeLoadStatus();
        },
        error:function(){
            closeLoadStatus();
            msgReminder('网络错误，请稍后再试1~');
        }
    });
}()

  var userName = getCookie('ccdUname');
jQuery('.shareBtn').on('click',function(){

    //参数String htmlHost, String title, String summary, String thumbURL, String targetURL
    // htmlHost 域名MD5
    //1、title 分享标题 2、summary 分享摘要   3、thumbURL 分享缩略图URL  4、targetURL分享的URL
    var _shareUrl = "http://m.ppdai.com/act/ccdcps5/reg3.html",
        _url = window.location.hostname,
        userName = getCookie('ccdUname'),
        md5Url = hex_md5(_url),
        title  = '送您一张免息券，请查收！',
        summary = '无门槛、零担保，通过率极高，新用户首单更有免息券.......',
        thumbURL = "http://m.ppdaicdn.com/act/ysq/images/cclogo.jpg",
        targetURL = _shareUrl+'?userName='+userName;

       window.JSHandle.share(md5Url,title,summary,thumbURL,targetURL);

    jQuery.ajax({
      type : "GET",
      async:false,
      url :"//mobiccdai.ppdai.com/ccdai/share/shareUserInfo.htm",
      dataType : "jsonp",
      data: {
          activityId: 104 ,
          userName : userName,
          shareType : 7
      },
      success : function(data){
      //  alert(data);
      },
      error:function(){
          closeLoadStatus();
          msgReminder('网络错误，请稍后再试2~');
      }
  });

  accountClickNum('曹操贷拉新分享次数','曹操贷H5分享');



})
  // $("#roundBtn").on('click',function(){
  //   window.location.href="http://group.ppdai.com/forum.php?mod=viewthread&tid=836649";
  // })

  jQuery.ajax({
     type : "GET",
     async:false,
     url :"//mobiccdai.ppdai.com/ccdai/share/queryShareInfo.htm",
     dataType : "jsonp",
     data: {
         userName : userName,
         shareType : 7
     },
     success : function(data){
       $("#shareTimes").html(data.content.shareTimes);
       $("#lendSuccess").html(data.content.lendSuccess);
       $("#award").html(data.content.award);
     },
     error:function(){
         closeLoadStatus();
         msgReminder('网络错误，请稍后再试2~');
     }
  });

 //PV Uv 统计
    var _vds = _vds || [];
    window._vds = _vds;
    (function () {
        _vds.push(['setAccountId', 'b9598a05ad0393b9']);
        //var IsAuthenticated = "@WapBaseController.IsAuthenticated".toLowerCase();
        var  userName = getCookie('ccdUname');
        //alert("userName为："+userName);
        if (userName) {
            _vds.push(['setCS1', 'user_name', userName]);
        }
        (function () {
            var vds = document.createElement('script');
            vds.type = 'text/javascript';
            vds.async = true;
            vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(vds, s);
        })();
    })();
