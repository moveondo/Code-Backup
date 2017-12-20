isAndroid  = navigator.userAgent.match('Android');
    if(isAndroid){
        $("#bannerimg").attr('src',"//mobiccdai.ppdaicdn.com/source/promotion/image/banner0.png");
    }else{
        $("#bannerimg").attr('src',"//mobiccdai.ppdaicdn.com/source/promotion/image/banner.png");
    }
    function IsPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }
    var Type;
    if(IsPC())  Type=0;
    else           Type=1;
    $("#button").click(function () {
        //window.location.href="//ccdspread.ppdapi.com/promotion/register.html"
        window.location.href="https://ac.ppdai.com/activitypage?redirect=&style=&activityId=110"
    })
    $("#login").click(function () {
       login()
    })
    function login() {
        var url = '//ccdspread.ppdai.com/login/loginAuth2Url.htm';
        $.ajax({
            type:'get',
            url:url,
            data:{type:Type},
            dataType:'json',
            success:function(data){
                //alert(data.content);
                if(data.result=="0"){
                    window.location.href=data.content;
                }else if(data.result=="-99"){
                    window.location.href="./login.html"
                }
            },
            error:function(){
                console.log("网络错误2");
            }
        })
    }
