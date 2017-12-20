$(function() {
    var StartDate,EndDate;
    $('#starting').datePicker({
        beginyear: 2010,
        theme: 'date',
        callBack: function() {
            StartDateVal=$('#starting').val();
            StartDate= StartDateVal.replace(new RegExp("-","gm"),'/');
            if(StartDate !=undefined && EndDate !=undefined){
                $('.js-blog-list').empty();
                counter = 0; /*计数器*/
                var pageStart = 0; /*offset*/
                var pageSize = 4; /*size*/
                AutostartDate=StartDate;
                AutoendDate=EndDate;
                getData(pageStart, pageSize,StartDate,EndDate);
            }
        }
    });
    $('#ending').datePicker({
        beginyear: 2010,
        theme: 'date',
        callBack: function() {
            EndDateVal=$('#ending').val();
            EndDate= EndDateVal.replace(new RegExp("-","gm"),'/')
            if(StartDate !=undefined && EndDate !=undefined){
                $('.js-blog-list').empty();
                counter = 0; /*计数器*/
                var pageStart = 0; /*offset*/
                var pageSize = 4; /*size*/
                AutostartDate=StartDate;
                AutoendDate=EndDate;
                getData(pageStart, pageSize,StartDate,EndDate);
            }
        }
    });
    /* 取链接*/
    var UrlContent;
    $.ajax({
        type: 'GET',
        url: '/spreadInfo/querySpreadInfo.htm',
        dataType: 'json',
        success: function(data){
            if(data.result==0){
                UrlContent=data.content[0].activityLink;
                //console.log(UrlContent)
                /*二维码生成*/
                $("#qrcode").qrcode({
                    render : "canvas",    //设置渲染方式，有table和canvas，使用canvas方式渲染性能相对来说比较好
                    text : UrlContent,    //扫描二维码后显示的内容,可以直接填一个网址，扫描二维码后自动跳向该链接
                    width : "106",               //二维码的宽度
                    height : "106",              //二维码的高度
                    background : "#ffffff",       //二维码的后景色
                    foreground : "#000000",        //二维码的前景色
                    src: 'https://m.ppdaicdn.com/img/ccdlogo.png'             //二维码中间的图片
                });
                $("#downCode").qrcode({
                    render : "canvas",    //设置渲染方式，有table和canvas，使用canvas方式渲染性能相对来说比较好
                    text : UrlContent,    //扫描二维码后显示的内容,可以直接填一个网址，扫描二维码后自动跳向该链接
                    width : "260",               //二维码的宽度
                    height : "260",              //二维码的高度
                    background : "#ffffff",       //二维码的后景色
                    foreground : "#000000",        //二维码的前景色
                    src: 'https://m.ppdaicdn.com/img/ccdlogo.png'             //二维码中间的图片
                });
                $("#textval").html(UrlContent);
                $("#copyBtn").attr("data-clipboard-text",UrlContent);

            }else if(data.result=="-99"){
                window.location.href="./login.html"
            }
        },
        error: function(xhr, type){
            alert('网络错误，请稍后重试!');
        }
    });

    $("#download").click(function () {
        $(".pop").show();
        $("#downCode").show();
    })
    $(".pop").click(function () {
        $(".pop").hide();
        $("#downCode").hide();
    })
    $("#downCode").click(function () {
        $(".pop").hide();
        $("#downCode").hide();
    })


    /*查询用户信息 */
    $.ajax({
        type: 'GET',
        url: '/userInfo/queryUserInfo.htm',
        dataType: 'json',
        success: function(data){
            if(data.result==0){

                if(data.content.flowStep =="2"){
                    $(".bind").css("visibility", "hidden");
                    if(data.content.bankAccount){
                        var FourbankNum=data.content.bankAccount.slice(-4);
                        var bindSucess0="收益将会发放至您尾号为"+FourbankNum+"的银行卡中";
                        var bindSucess1="您已绑定尾号为"+FourbankNum+"的银行卡"
                        $("#bind0").html(bindSucess0);
                        $("#bind1").html(bindSucess1);
                    }

                }else if(data.content.flowStep =="0"){
                    $("#bind0").click(function(){
                        window.location.href="./bindbank.html";
                    })
                    $("#bind1").click(function(){
                        window.location.href="./bindbank.html";
                    })
                }else if(data.content.flowStep =="1"){
                    $("#bind0").click(function(){
                        window.location.href="./instantlybind.html"
                    })
                    $("#bind1").click(function(){
                        window.location.href="./instantlybind.html"
                    })
                }
            }else if(data.result=="-99"){
                window.location.href="./login.html"
            }

        },
        error: function(xhr, type){
            alert('网络错误，请稍后重试!');
        }
    });





    $(".mypromotion").click(function () {
        if(!$(this).hasClass("active")) $(this).addClass("active");
        $(".myincome").removeClass("active");
        $("#mypromotion").show();
        $("#myincome").hide();
    })
    $(".myincome").click(function () {
        if(!$(this).hasClass("active")) $(this).addClass("active");
        $(".mypromotion").removeClass("active");
        $("#myincome").show();
        $("#mypromotion").hide();
    })


    /* 复制链接*/


    var btn = document.getElementById("copyBtn");
    var clipboard = new Clipboard(btn);//实例化
    //复制成功执行的回调，可选
    clipboard.on('success', function(e) {
        msgReminder("复制链接成功")
        console.log(e);
    });
    //复制失败执行的回调，可选
    clipboard.on('error', function(e) {
        msgReminder("复制链接失败")
        console.log(e);
    });

    /* 加载用户数据数据 */

    $.ajax({
        type: 'GET',
        url: '/rewardsInfo/queryProfitInfo.htm',
        dataType: 'json',
        success: function(data){

            if(data.result==0){
                var currentMonthProfit=data.content.currentMonthProfit;
                var lastMonthProfit=data.content.lastMonthProfit;
                var withdrawalAmount=data.content.withdrawalAmount;
                var totalProfit=data.content.totalProfit;
                if(currentMonthProfit==0){ currentMonthProfit='0.00'}
                if(lastMonthProfit==0){ lastMonthProfit='0.00'}
                if(withdrawalAmount==0){ withdrawalAmount='0.00'}
                if(totalProfit==0){ totalProfit='0.00'}

                $("#currentMonthProfit").html(currentMonthProfit);
                $("#lastMonthProfit").html(lastMonthProfit);
                $("#withdrawalAmount").html(withdrawalAmount);
                $("#totalProfit").html(totalProfit);

            }else if(data.result=="-99"){
                window.location.href="./login.html"
            }

        },
        error: function(xhr, type){
            alert('网络错误，请稍后重试!');
        }
    });



    /*..........加载更多............**/
    var AutostartDate,AutoendDate;
    var Autodate = new Date();
    var AutodateM=Autodate.getMonth()+1;
    if(AutodateM<=9){AutodateM='0'+AutodateM; }
    AutostartDate=Autodate.getFullYear()+"/"+AutodateM+"/"+Autodate.getDate();//表示当前时间


    function ADDdate(aa){
        var date1 = new Date(),
            time1=date1.getFullYear()+"/"+(date1.getMonth()+1)+"/"+date1.getDate();//time1表示当前时间
        var date2 = new Date(date1);
        date2.setDate(date1.getDate()+aa);
        var time2M=date2.getMonth()+1;
        if(time2M<=9){time2M='0'+time2M; }
        var time2 = date2.getFullYear()+"/"+time2M+"/"+date2.getDate();
        return time2;
    }
    AutoendDate=ADDdate(7);
    /*初始化*/
    var counter; /*计数器*/
    counter=0;
    var pageStart = 0; /*offset*/
    var pageSize = 4; /*size*/

    /*首次加载*/
    getData(pageStart, pageSize,AutostartDate,AutoendDate);
    /*监听加载更多*/
    $(document).on('click', '.js-load-more', function(){
        counter ++;
        pageStart = counter * pageSize;
        $(".js-blog-more").css("background","red");
        getData(pageStart, pageSize,AutostartDate,AutoendDate);

    });

    function getData(offset,size,AutostartDate,AutoendDate){

        $.ajax({
            type: 'GET',
            url: '/rewardsInfo/queryRewardDetailInfo.htm',
            dataType: 'json',
            data:{
                startDate:AutostartDate,
                endDate:AutoendDate
            },
            success: function(reponse){

                var data = reponse.content;
                if(data.length){
                    var sum = data.length;
                }else {
                    var sum=0;
                }

                var result = '';

                if(sum - offset < size ){
                    size = sum - offset;
                }
                for(var i=offset; i< (offset+size); i++){
                    if(i==0){
                        result ='<div class="loadingdetail first">'+
                            '<div class="generate">'+
                            '<p class="earnings">产生收益</p>'+
                            '<p class="revenuetime" id="profitTime">'+ data[i].profitTime +'</p></div>'+
                            '<div class="actual" id="profitAmount">'+data[i].profitAmount+'</div>'+
                            '</div>';
                    }else{
                        result +='<div class="loadingdetail">'+
                            '<div class="generate">'+
                            '<p class="earnings">产生收益</p>'+
                            '<p class="revenuetime" id="profitTime">'+ data[i].profitTime +'</p></div>'+
                            '<div class="actual" id="profitAmount">'+data[i].profitAmount+'</div>'+
                            '</div>';
                    }

                }
                $('.js-blog-list').append(result);


                /*******************************************/
                /*隐藏more按钮*/
                if ( (offset + size) >= sum){

                    $(".js-load-more").hide();
                    $(".js-blog-list").css("margin-bottom","60px");
                }else{
                    $(".js-load-more").show();
                }

                if(data.result=="-99"){
                    window.location.href="./login.html"
                }
            },
            error: function(xhr, type){
                alert('Ajax error!');
            }
        });
    }






    function  msgReminder(txt){
        var __html = '<div class="reminder">'+txt+'</div>';

        $(__html).appendTo($('body'))

        $('.reminder').show();
        window.setTimeout(function(){
            var $msg = $('.reminder');
            $msg.fadeOut(2000);
        },1000)

    }




});
