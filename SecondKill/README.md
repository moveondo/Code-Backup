  ### -second-kill

##### 问题1：IOS时间显示，倒计时时未显示：
 
   
   这个界面运用了大量的日期类型的计算，当我们用JavaScript实例化一个日期对象时，我们可以这样用:
   
```   
var date =new Date();  
 var date =new Date(2017,09,30,08,0,0");    
 ```
    
     这段代码是获得字符中指定的日期，它Firefox、Chrome中就能运行，但是放在Safari就会报错，错误是NaN，意思是Not a Number。就是因为这个错，苹果手机不能正常运行我开发的这个界面，当时都快郁闷死了，我写了100行js啊，几乎都与时间有关，不是取值就是赋值，要不就是计算，如今IOS不支持。。。。。
     
    最终修订如下:
    
     
```
      var BeginArr = "2017/09/21 10:00:00".split(/[- : \/]/);
      
      var BeginTime = new Date(BeginArr[0], BeginArr[1]-1, BeginArr[2], BeginArr[3], BeginArr[4], BeginArr[5]);
      
```
      
      后者写一个这样的函数：
      
```
      function GetDateDiff(startDiffTime, endDiffTime) { 
            //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式   
            startTime = startDiffTime.replace(/\-/g, "/");  
            endTime = endDiffTime.replace(/\-/g, "/");  
       }; 
```
       
       这样Android和IOS就能共用了！
       
      
#### 问题2： 倒计时时间不准确 
    
     网上查询很多写法，也都尝试，但便于测试，最后还是后端提供接口
     
     调用轮询
     
```
     var nowArr,EverySec;
     
    var now;
    
    function Gettime() {

        $.ajax({
            type :'get',
            async: false,
            url  :"/ccdai/api/secKill/getServerCurrentTime.htm",
            dataType: "json",
            success: function(data){
                if(data.result==0){
                    nowArr=(data.content).split(/[- : \/]/);
                    now = new Date(nowArr[0], nowArr[1]-1, nowArr[2], nowArr[3], nowArr[4], nowArr[5]);
                    EverySec= now.getTime();
                    if(now<advancedTime){
                        $("#Distance").html("距离秒杀开始")
                    }
                    if(now>=advancedTime){
                        $("#Distance").html("距离秒杀结束")
                    }
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                alert("网络繁忙，请稍候再试~");
            }
        })

    }
    Gettime();
    
     //减少后端请求，自己加
     setInterval(function(){

      EverySec+= 1000;
      NowAutotime=new Date(EverySec);
      var h=NowAutotime.getHours();
      
      var m=NowAutotime.getMinutes();
      
      var s=NowAutotime.getSeconds();
      
      if(h==10&&m==0&&s==0){   //10点设置自动刷新
          secKillPageLoad();
      }
   },1000);
```
    
 #### 问题3：setInterval在IOS上滑动时不执行
    
      默认是取消JS执行，为了滑动的流畅性，时间解决方案：
      
 ```
          var isiOS  = navigator.userAgent.match('iPad') || navigator.userAgent.match('iPhone') || navigator.userAgent.match('iPod');
       if(isiOS ){
           $("body").on("touchend",function(event){
               Gettime();

           });
       }
       
 ```
      
     IOS手机每点击一下去请求一下时间接口，校验时间
