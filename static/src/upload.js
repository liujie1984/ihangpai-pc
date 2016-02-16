define(function(require) {
    var $ = require('jquery');
    var Utils = require('./utils');
    var utils = new Utils();
    (function videoUploader(){
        var Qiniu = new QiniuJsSDK();
        var uploader = Qiniu.uploader({
            runtimes: "html5,flash,html4",    //上传模式,依次退化
            browse_button: 'upload-submit',          //上传选择的点选按钮，**必需**
            // uptoken_url: '/token',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
            uptoken :"", //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
            unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
            // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
            domain: 'http://qiniu-plupload.qiniudn.com/',   //bucket 域名，下载资源时用到，**必需**
            // container: inputBlock,           //上传区域DOM ID，默认是browser_button的父元素，
            max_file_size: '1000mb',           //最大文件体积限制
            //flash_swf_url : "/static/lib/pulpload/Moxie.swf",
            //silverlight_xap_url : "/static/lib/pulpload/Moxie.xap",
            max_retries: 1,                   //上传失败最大重试次数
            // dragdrop: true,                   //开启可拖曳上传
            // drop_element: inputBlock,        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
            chunk_size: '4mb',                //分块上传时，每片的体积
            auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
            // multi_selection:false,
            filters : {
                max_file_size : "1000mb",
                prevent_duplicates:true,
                mime_types: [
                    {title : "Video files", extensions : "mp4,wmv,"}
                ]
            },
            init: {
                PostInit: function() {

                }
            }
        });

        uploader.init();
        uploader.bind("FilesAdded",function(uploader,files){
            console.log("FilesAdded");
            console.dir(uploader);
            console.dir(files);
            var uploadOne= "<div id='"
                +files[0].id+"' class='upload-one'><div class='upload-one-progress-desc'><span class='upload-one-name'>"
                +files[0].name+"</span><span class='upload-one-percent'>0%</span><span class='upload-one-time'>00.00.00</span><span class='upload-one-size'><span class='upload-one-already-size'></span><span class='upload-one-total-size'>/"
                +bytesToSize(files[0].size)+"</span></span><span class='upload-one-speed'>0kb/s</span></div><div class='upload-one-progress-bar'><div class='upload-one-progress-bar-percent'></div></div></div>";
            $("#upload-list").append(uploadOne);
            getToken(files[0].name,files[0].size,files[0].name,files[0]);
        });
        uploader.bind("BeforeUpload",function(uploader,file){
            console.log("BeforeUpload");
            console.dir(uploader);
            console.dir(file);
        });
        uploader.bind("UploadFile",function(uploader,file){
            console.log("UploadFile");
            console.dir(uploader);
            console.dir(file);
            var startTime = new Date().getTime();
            $('#'+file.id).data('start-time',startTime);
        });
        uploader.bind("UploadProgress",function(uploader,file){
            console.log("UploadProgress");
            console.dir(uploader);
            console.dir(file);
            var fileId = $('#'+file.id);
            fileId.find('.upload-one-percent').text(file.percent+'%');
            fileId.find('.upload-one-progress-bar-percent').css("width",file.percent+'%');
            fileId.find('.upload-one-already-size').text(bytesToSize(file.loaded));
            fileId.find('.upload-one-speed').text('('+bytesToSize(file.speed)+'/s)');
            var nowTime = new Date().getTime();
            var alreadyTime = (nowTime - fileId.data('start-time'))/1000;
            fileId.data('uptime',alreadyTime);
            fileId.find('.upload-one-time').text('(已开始'+stohms(alreadyTime)+'s)');
        });
        uploader.bind("FileUploaded",function(uploader,file,responseObject){
            console.log("FileUploaded");
            console.dir(uploader);
            console.dir(file);
            console.dir(file.name);
            console.dir(responseObject);
            if(responseObject.status==200){
               //转码中
               $('#'+file.id).find('.upload-one-speed').text('上传成功!');
              
               reportResult($('#'+file.id).data('taskId'),0,$('#'+file.id).data('uptime'));
               var intervalTranscode=setInterval(function(){
                   var transcode = getTranscode($('#'+file.id).data('taskId'));
                   if(transcode.list[0].status=="FINISH"){
                        $('#'+file.id).find('.upload-one-speed').text('转码成功!');
                       clearInterval( $('#'+file.id).find('.upload-one-speed').data('intervalTranscode'));
                   }
                   console.log(transcode.list[0].status);
               },10000);
                $('#'+file.id).find('.upload-one-speed').data('intervalTranscode',intervalTranscode);
            }
        });
        uploader.bind('UploadComplete',function(uploader,files){
            console.log('UploadComplete');

        });
        uploader.bind("Error",function(uploader,errObject){
            console.log("Error");
            console.dir("uploader");
            console.dir("errObject");
        });

        function getToken(filename,filesize,title,file){
        if(typeof(Storage)!=="undefined")
        {
            var getTokenUrl=localStorage.localhost+"api/qbox/query_uptoken";
        }
        $.ajax({
            type: "POST",
            url: getTokenUrl,
            data: {
                filename: filename,
                duration:"100",
                filesize:filesize,
                resolution:"1280x720",
                title: title,
                desc: "{{SaveAtRepo}}",
                oldkey: "",
                old_taskid:""
            },
            dataType: "json",
            async : false,
            headers:{
                "User-Token":utils.getCookie('user_verify'),
                "Device-Id": "1",
                "App-Ver":"1",
                "Os":"web",
                "Os-Ver":"1",
                "Screen":"1"
            },
            success: function(data, textStatus, jqXHR){
            uploader.setOption({
                "headers":{"authorization":"UpToken "+data.data.uptoken},
                "multipart_params":{"name":data.data.qbox_key}
            });
            uploader.token = data.data.uptoken;
            $('#'+file.id).data('taskId',data.data.task_id);
            uploader.start();
            }
        });
    }
})();
//获取token

//上报上传结果 0:成功，1失败
    function reportResult(taskId,result,uptime){
        if(typeof(Storage)!=="undefined")
        {
            var reportResultUrl=localStorage.localhost+"api/qbox/upload_notify_from_app";
        }
        $.ajax({
            type: "POST",
            url: reportResultUrl,
            data: {
                task_id: taskId,
                result: result,
                uptime: uptime
            },
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            headers:{
                "User-Token":utils.getCookie('user_verify'),
                "Device-Id": "1",
                "App-Ver":"1",
                "Os":"web",
                "Os-Ver":"1",
                "Screen":"1"
            },
            success: function(data, textStatus, jqXHR){
                console.log("reportResult");
                console.dir(data);
            }

        });
    }
//获取转码状态
    function getTranscode(taskId){
        var returnData = new Object;
        if(typeof(Storage)!=="undefined")
        {
            var getTranscodeUrl=localStorage.localhost+"api/qbox/query_pending_videos";
        }
        $.ajax({
            type: "POST",
            url: getTranscodeUrl,
            data: {
                task_list: taskId
            },
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            async : false,
            headers:{
                "User-Token":utils.getCookie('user_verify'),
                "Device-Id": "1",
                "App-Ver":"1",
                "Os":"web",
                "Os-Ver":"1",
                "Screen":"1"
            },
            success: function(data, textStatus, jqXHR){
                returnData=data.data;
            }

        });
        return returnData;
    }
    function intervalGetTranscode(taskId,videoContainer){
        var transcode = getTranscode(taskId);
        if(transcode.list[0].status=="FINISH"){
            $("#"+videoContainer).parent().html("转码成功");
            clearInterval(intervalTranscode);
        }
        console.log(transcode.list[0].status);

    }
//生成随机数
    function mathRand(){
        var num="";
        for(var i=0;i<6;i++) {
            num+=Math.floor(Math.random()*10);
        }
        return num;
    }
//字节转mb
    function bytesToSize(bytes) {
        if (bytes === 0) return '0 B';
        var k = 1024;
        sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
        // toPrecision(3) 后面保留一位小数，如1.0GB                                                                                                                  //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }
//s转时分秒
    function stohms(t){
        var h=0,i=0,s=parseInt(t);
        if(s>60){
            i=parseInt(s/60);
            s=parseInt(s%60);
            if(i > 60) {
                h=parseInt(i/60);
                i = parseInt(i%60);
            }
        }
        // 补零
        var zero=function(v){
            return (v>>0)<10?"0"+v:v;
        };
        return [zero(h),zero(i),zero(s)].join(":");
    }
});


