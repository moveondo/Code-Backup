//pv uv 统计
 function GetQueryString(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
        var r = window.location.search.substr(1).match(reg);
        if (r!=null) return (r[2]); return null;
 }




var wait = 60;
var time = function(o) {
    if (wait == 0) {
        o.className = "getcode-r";
        o.value = "发送验证码";
        o.removeAttribute("disabled");
        wait = 60;
    } else {
        o.className = "getcode-r code-disabled";
        o.setAttribute("disabled", true);
        o.value =  wait + "秒再发送";
        wait--;
        setTimeout(function () {
            time(o);
        }, 1000);
    }
}
var CCD = {
     isWeixinBrowser : function() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
      },

    GetQueryString:function(name){
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
            var r = window.location.search.substr(1).match(reg);
            if (r!=null) return (r[2]); return null;
    },

    loadStatus : function () {
        var _html = ('<div class="loading" style="position:fixed;background:#000;opacity:.8;padding:5px;border-radius:4px;left:50%;top:50%;margin-top:-20px;margin-left:-20px;display:block;z-index:999">\
                          <img src="//m.ppdaicdn.com/home/images/loading.gif" width="40" height="40">\
                        </div>');
        $(_html).appendTo($('body'))
    },
    closeLoadStatus:function () {
        var $load = $('.loading');
        if ($load.length) {
            $load.remove();
        }

    },

    msgReminder:function(txt){
        var _html = '<div class="msg-wrap">\
                        <span class="msg">\
                            <span class="errmsg">'+txt+'</span>\
                        </span>\
                    </div>'
            $(_html).appendTo($('body'));
            window.setTimeout(function(){
                var $msg = $('.msg-wrap');
                $msg.remove();
            },2000)

    },
    closePopComponents : function(ele){
        var isiOS = navigator.userAgent.match('iPad')
          || navigator.userAgent.match('iPhone')
          || navigator.userAgent.match('iPod'),
           loadIframe = null,
           isAndroid = navigator.userAgent.match('Android'),
           appSrc = "ppdai.caocao://com.ppdai.caocao",
           appURL = "//m.ppdai.com/act/app/ccd/ccd_down.html?source=laolaxin"
        $('.bg').remove();
        $(ele).remove();
        if(CCD.isWeixinBrowser()){
            // var _wx = '<img src="https://m.ppdaicdn.com/act/ccd/images/ccdbanner.png" class="wx_img">';
            // $(_wx).appendTo($('body'));
            window.location = appURL;

        }else{
            if(isAndroid){
                //android
                //此操作会调起app并阻止接下来的js执行
                $('body').append("<iframe src='ppdai.caocao://com.ppdai.caocao' style='display:none' target='' ></iframe>");

                //没有安装应用会执行下面的语句
               setTimeout(function(){window.location = appURL},1000);
            }else{
                //ios
                window.location = 'ppdai.caocao://com.ppdai.caocao';
                setTimeout(function(){window.location = appURL},3000);
            }

        }
    },
    addPopComponents : function(_status,txt){
    var __html = '<div class="bg"></div>\
                  <div class="sW2">\
                    <div class="sW2_top_icon">\
                        <img src="//mobiccdai.ppdaicdn.com/source/ccdcps4/image/topicon.png">\
                    </div>\
                    <div class="sW2_close" onClick="CCD.closePopComponents(this.parentNode)"></div>\
                    <div class="sW2_cont">'+ txt +'</div>\
                    <button class="sW2_btn" onClick="CCD.closePopComponents(this.parentNode)">确定</button>\
                </div>',
        _sHtml = '<div class="bg"></div>\
                  <div class="sW">\
                    <div class="success">\
                        <img src="//mobiccdai.ppdaicdn.com/source/ccdcps4/image/iconsuc.png" class="sucimg">\
                        <div class="desc">\
                            恭喜您!<br>\
                            获得一张8元减息券！<br>\
                        </div>\
                        <img src="//mobiccdai.ppdaicdn.com/source/ccdcps4/image/down.png" class="sucbtn" onClick="CCD.closePopComponents(this.parentNode.parentNode)">\
                    </div>\
                  </div>';
        if(_status == 2){
            if(!$('.sW2').length){
                $(__html).appendTo($('body'))
            }
        }

        if(_status == 1){
            if(!$('.sW').length){
                $(_sHtml).appendTo($('body'))
            }
        }
    },


    sendRegisSMS : function(){
        var reg = /^1\d{10}$/;
        var $phoneValue = $('#phone').val();
        var $picValue   = $('#pic').val();
        var that = this;
        var _url = "//mobiccdai.ppdai.com/ccdai/api/sendRegisSMSV2.htm";
        //var _url = "http://192.168.30.90:8080/ccdai-front/ccdai/api/sendRegisSMSV2.htm";
        if(!$phoneValue||!reg.test($phoneValue)){
            that.msgReminder("请输入正确的手机号!");
            return;
        }
        if(!$picValue||$picValue.length!=4){
            that.msgReminder("请输入正确图形验证码!");
            return;
        }
        $.ajax({
            type : "get",
            async:false,
            url : _url,
            dataType : "jsonp",
            data:{
                cellPhone:$phoneValue,
                captcha:$picValue,
            },
            cache: false,
            beforeSend: function () {
                CCD.loadStatus();
            },
            success : function(data){
                //var _data = JSON.parse(data);
                var _result = data.result;
                if (_result == 0) {
                    that.msgReminder("发送成功!")
                    time($('#sendCode')[0])
                }else if(_result == 2){
                    that.msgReminder("请输入正确图形验证码!")
                }else if (_result == -1) {
                    that.msgReminder(data.resultMessage)
                }
            },
            complete: function () {
                CCD.closeLoadStatus();
            },
            error:function(){
                that.msgReminder("网络错误，请稍后再试3~");
            }
        })
    },

    submitSMS:function(){ //
        var reg = /^1\d{10}$/;
        var $phoneValue = $('#phone').val();
        var $picValue   = $('#pic').val();
        var $dxValue    = $('#dx').val();
        var that = this;
        var _uName = that.GetQueryString('userName');
        var _devID = that.GetQueryString('deviceID');
        //var _uName = 'pdu111111122';
        //var _devID = 'adasdd';
        //var _redURL= "http://m.ppdai.com/act/app/ccd/ccd_down.html?source=tuijian";
        var _url = "//mobiccdai.ppdai.com/ccdai/share/attendUserInfo.htm";
        //var _url = "http://192.168.30.90:8080/ccdai-front/ccdai/share/attendUserInfo.htm";
        if(!$phoneValue||!reg.test($phoneValue)){
            that.msgReminder("请输入正确的手机号!");
            return;
        }
        if(!$picValue||$picValue.length!=4){
            that.msgReminder("请输入正确的图形验证码!");
            return;
        }
        if(!$dxValue||$dxValue.length!=6){
            that.msgReminder("请输入正确的手机验证码!");
            return;
        }
        $.ajax({
            type : "get",
            async:false,
            url : _url,
            dataType : "jsonp",
            data:{
                cellPhone:$phoneValue,
                smsCode:$dxValue,
                userName:_uName,
                deviceId:_devID,
                shareType:7
            },
            cache: false,
            beforeSend: function () {
                CCD.loadStatus();
            },
            success : function(data){

                //var _data = JSON.parse(data);
                console.log(data)
                var _result = data.result;

                if (_result == 0) {
                    that.addPopComponents(1,' ')
                }else if(_result == -1 || _result == 1 ){
                    that.addPopComponents(2,data.resultMessage)
                }
                else{
                    that.msgReminder(data.resultMessage)
                }
            },
            complete: function () {
                CCD.closeLoadStatus();
            },
            error:function(){
                that.msgReminder("网络错误，请稍后再试4~");
            }
        })
    }
}



var _vds = _vds || [];
window._vds = _vds;
(function () {
    _vds.push(['setAccountId', 'b9598a05ad0393b9']);
    //var IsAuthenticated = "@WapBaseController.IsAuthenticated".toLowerCase();
    var  userName = GetQueryString("userName");
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

//统计结束
