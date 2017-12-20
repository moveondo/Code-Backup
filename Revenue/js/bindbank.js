 $("#btn").click(function () {
        var name=$("#name").val();
        var idcard=$("#idcard").val();
        var objButton=$(this);
        var url="/userInfo/applyIdentityCardAuth.htm"
        $.ajax({
            type:'get',
            url:url,
            async: false,
            data:{
                realname:name,
                idNumber:idcard
            },
            dataType:'json',
            cache:false,
            beforeSend:function(){
                　objButton.html('提交中').attr('disabled',true);
            },
            success:function(data){

                if(data.result == 0){
                    window.location.href="./instantlybind.html";
                }else if(data.result=="-99"){
                    window.location.href="./login.html"
                }else{
                    msgReminder(data.resultMessage);
                }
            },
            error: function(){
                console.log("网络错误21");
            },
            complete:function(){
                　objButton.html('下一步').attr('disabled',false);//改变提交按钮上的文字并将按钮设置为可以点击
            }
        })
    })

    $("#leftarrow").click(function () {
        window.location.href="//ccdspread.ppdai.com/promotion/revenue.html";
    })


    function  msgReminder(txt){
        var __html = '<div class="reminder">'+txt+'</div>';

        $(__html).appendTo($('body'))

        $('.reminder').show();
        window.setTimeout(function(){
            var $msg = $('.reminder');
            $msg.fadeOut(2000);
        },1000)

    }
