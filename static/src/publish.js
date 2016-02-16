define(function(require) {
    var $ = require('jquery');
    var Utils = require('./utils');
    var utils = new Utils();

    var postData = new Object();
    var subTasks = new Object();
    (function pubChoose(){
        $('#pub-type-image').click(function(){
            $('#pub-type-image').css('background-color','#556e98');
            $('#pub-type-video').css('background-color','#6688c2');
            $('#pub-type-imgtext').css('background-color','#6688c2');
            $('#pub-desc-image').css('display','block');
            $('#pub-desc-video').css('display','none');
            $('#pub-desc-imgtext').css('display','none');
            $('.submit-btn').css('display','none');
            $('#submit-image').css('display','inline-block');
            //$('.submit-btn')[0].id='submit-image';
        });
        $('#pub-type-video').click(function(){
            $('#pub-type-image').css('background-color','#6688c2');
            $('#pub-type-video').css('background-color','#556e98');
            $('#pub-type-imgtext').css('background-color','#6688c2');
            $('#pub-desc-image').css('display','none');
            $('#pub-desc-video').css('display','block');
            $('#pub-desc-imgtext').css('display','none');
            $('.submit-btn').css('display','none');
            $('#submit-video').css('display','inline-block');
            $('#submit-video').click(function(){
                var pubTitle = $('#pub-title-content');
                var alreadyTags = $('.already-tag');
                console.dir(alreadyTags);
                if(pubTitle.val()==''){
                    alert('标题不能为空！');
                }else{
                    if(alreadyTags.length==0){
                        alert('至少需要打一个标签！');
                    }else{
                        if($('#pub-desc-video-thumbnail').data('videoOneData')==''){
                            alert('请选择一个视频！');
                        }else{
                            postData.title=pubTitle.val();
                            postData.tags =new Array();
                            postData.contents =new Array();
                            for(var i=0,alreadyTagsLength=alreadyTags.length; i<alreadyTagsLength;i++) {
                                postData.tags.push(alreadyTags[i].innerText);
                            }
                            var videoData = JSON.parse($('#pub-desc-video-thumbnail').data('videoOneData'));
                            postData.contents[0]=new Object();
                            postData.contents[0].repo_video_id = videoData.video_id;
                            postData.contents[0].type = 'ihp_repo_v';
                            ajaxPost(postData,'','video');
                        }
                    }
                }
            });
        });
        $('#pub-type-imgtext').click(function(){
            $('#pub-type-image').css('background-color','#6688c2');
            $('#pub-type-video').css('background-color','#6688c2');
            $('#pub-type-imgtext').css('background-color','#556e98');

            $('#pub-desc-image').css('display','none');
            $('#pub-desc-video').css('display','none');
            $('#pub-desc-imgtext').css('display','block');
            $('.submit-btn').css('display','none');
            $('#submit-imgtext').css('display','inline-block');
        });
    })();

    (function pubImage(){
            var subPos=1;
            var img_ids='';
            var alreadyNum=0;
            var imgUploadUrl=localStorage.localhost+'api/imghandler/upload';
            //实例化
            var imgLoadingCircle;
            var uploader = new plupload.Uploader({
                runtimes : 'html5,flash,silverlight,html4',
                browse_button : 'add-image-img-btn',
                url : imgUploadUrl,
                //flash_swf_url : '/static/lib/pulpload/Moxie.swf',
                //silverlight_xap_url : '/static/lib/pulpload/Moxie.xap',
                //为true时将以multipart/form-data的形式来上传文件，为false时则以二进制的格式来上传文件
                multipart:true,
                multipart_params: {
                    imgType: 'img4Text',
                    title: '',
                    desc: '',
                    isOrg: '1'
                },
                file_data_name:'picture',
                headers:{
                    'User-Token':utils.getCookie('user_verify'),
                    'Device-Id': '1',
                    'App-Ver':'1',
                    'Os':'web',
                    'Os-Ver':'1',
                    'Screen':'1'
                },
                multi_selection:true,
                filters : {
                    max_file_size : '20mb',
                    mime_types: [
                        {title : 'Image files', extensions : 'jpg,gif,png'}
                    ]
                },
                init: {
                    PostInit: function() {
                        console.log('PostInit');
                    }
                }
            });
            //初始化
            uploader.init();
            //绑定添加图片事件
            uploader.bind('FilesAdded',function(uploader,files){
                console.group('imageUpload-FilesAdded');
                console.dir(files);
                console.dir(uploader);
                console.log(files.length);
                console.groupEnd();

                var imgNum=0;
                var addNum=files.length;
                if(alreadyNum>=8){
                    uploader.files.splice(8);
                }else{
                    uploader.files.splice(9);
                    if(addNum<(9-alreadyNum)) {
                        var useNum = addNum;
                    }else{
                        var useNum=9-alreadyNum;
                    }
                    for(imgNum=0;imgNum<useNum;imgNum++){
                        var imgId=files[imgNum].id;
                        var imageImgContainerId='image-img-container'+imgId;
                        var imageImgId='image-img'+imgId;
                        var imageImgCancelId='image-img-cancel'+imgId;
                        var imageImgLoadingId='image-img-loading'+imgId;
                        var imageImgPercentId='image-img-percent'+imgId;

                        var singleimageImg= "<div id='"
                            +imageImgContainerId+"'class='fl image-thumbnail-container'><img id='"
                            +imageImgId+"'class='image-thumbnail'/><img id='"
                            +imageImgCancelId+"'class='image-thumbnail-cancel' src='http://7xqamv.com2.z0.glb.qiniucdn.com/icon-cancel.png'/><div class='image-thumbnail-loading-block'><div class='image-thumbnail-black'></div><img id='"
                            +imageImgLoadingId+"'class='image-thumbnail-loading' src='http://7xqamv.com2.z0.glb.qiniucdn.com/icon-image-uploading.png' alt='图片加载'/><p id='"
                            +imageImgPercentId+"'class='image-thumbnail-loading-percent'>0%</p></div></div>";
                        $('#image-thumbnail-container-append').before(singleimageImg);

                        previewImage(files[imgNum],function(imgsrc,file){
                            $('#image-img'+file.id).attr('src',imgsrc);
                        });

                        $('#'+imageImgCancelId).click(function(){
                            $(this).parent().css('display','none');
                            var imageImgCancelId = $(this).attr('ID');
                            var fileId = imageImgCancelId.substr(17);
                            console.log('remove file id +'+fileId);
                            uploader.removeFile(uploader.getFile(fileId));
                        });
                    }
                }
                alreadyNum = addNum +alreadyNum;
            });
            function previewImage(file,callback){//file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
                if(!file || !/image\//.test(file.type)) return; //确保文件是图片
                if(file.type=='image/gif'){//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
                    var fr = new mOxie.FileReader();
                    fr.onload = function(){
                        callback(fr.result);
                        fr.destroy();
                        fr = null;
                    };
                    fr.readAsDataURL(file.getSource());
                }else{
                    var preloader = new mOxie.Image();
                    preloader.onload = function() {
                        preloader.downsize( 300, 300 );//先压缩一下要预览的图片,宽300，高300
                        var imgsrc = preloader.type=='image/jpeg' ? preloader.getAsDataURL('image/jpeg',80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
                        callback && callback(imgsrc,file); //callback传入的参数为预览图片的url
                        preloader.destroy();
                        preloader = null;
                    };
                    preloader.load( file.getSource() );
                }
            }
            // 当队列中的某一个文件正要开始上传前触发
            uploader.bind('BeforeUpload',function(uploader,file){
                console.group('imageUpload-BeforeUpload');
                console.dir(file);
                console.dir(uploader);
                console.groupEnd();
            });
            //当上传队列中某一个文件开始上传后触发
            uploader.bind('UploadFile',function(uploader,file){
                console.group('imageUpload-UploadFile');
                console.dir(uploader);
                console.dir(file);
                console.groupEnd();
                //uploader.setOption('multipart_params',{
                //    'imgType': 'img4Text',
                //    'isOrg': '1'
                //});
                $('#image-img-loading'+file.id).parent().css('display','block');
                imgLoadingCircle=setInterval(function(){
                    console.log('传送图片');
                    var nowDegree=document.getElementById('image-img-loading'+file.id).style.transform;
                    var nowDegreeNum=nowDegree.replace(/[^0-9]/ig,'');
                    // console.log(nowDegreeNum);
                    var endDegreeNum=Number(nowDegreeNum)+10;
                    // console.log(endDegreeNum);
                    var endDegree='rotate('+endDegreeNum+'deg)';
                    // console.log(endDegree);
                    $('#image-img-loading'+file.id).css('transform',endDegree);
                },100);
            });
            //
            uploader.bind('QueueChanged',function(uploader,file){
                console.group('imageUpload-QueueChanged');
                console.dir(uploader);
                console.dir(file);
                console.groupEnd();
            });
            uploader.bind('UploadProgress',function(uploader,file){
                var p = file.percent + '%';
                $('#image-img-percent'+file.id).text(p);
                // console.log(files.percent);
            });
            // 当队列中的某一个文件上传完成后触发
            uploader.bind('FileUploaded',function(uploader,file,responseObject){
                console.group('imageUpload-FileUploaded');
                console.dir(uploader);
                console.dir(file);
                console.log(responseObject);
                console.log(responseObject.response);
                console.groupEnd();
                clearInterval(imgLoadingCircle);
                //var jsonObj = jQuery.parseJSON(responseObject.response);
                //if(jsonObj.code==0){
                //    console.log('jsonObj.data.img_id'+jsonObj.data.img_id);
                //    if(img_ids==''){
                //        img_ids=img_ids+jsonObj.data.img_id;
                //    }else{
                //        img_ids=img_ids+'-'+jsonObj.data.img_id;
                //    }
                //}else{
                //    alert('图片上传失败');
                //}
                if(subPos<subTasks.length){
                    console.log(subTasks[subPos]);
                    uploader.setOption({
                        'multipart_params':{
                            uptoken:subTasks[subPos].uptoken,
                            imgType: 'img4Text',
                            isOrg: '1'
                        }
                    });
                    subPos++;
                }
            });
            //当上传队列中所有文件都上传完成后触发
            uploader.bind('UploadComplete',function(uploader,files){
                console.group('imageUpload-UploadComplete');
                console.dir(uploader);
                console.dir(files);
                console.groupEnd();
                alert('图片发布完成！');
                //window.location.reload();
            });
        $('#submit-image').click(function(){
            var pubTitle = $('#pub-title-content');
            var alreadyTags = $('.already-tag');
            console.dir(alreadyTags);
            if(pubTitle.val()==''){
                alert('标题不能为空！');
            }else{
                if(alreadyTags.length==0){
                    alert('至少需要打一个标签！');
                }else{
                    if(uploader.files.length==0){
                        alert('请选择图片！');
                    }else{
                        postData.title=pubTitle.val();
                        postData.tags =new Array();
                        postData.contents =new Array();
                        for(var i=0,alreadyTagsLength=alreadyTags.length; i<alreadyTagsLength;i++) {
                            postData.tags.push(alreadyTags[i].innerText);
                        }
                        for(var j=0,jlength=uploader.files.length;j<jlength;j++){
                            console.dir(uploader.files[j]);
                            var imgContent = new Object();
                            imgContent.type='image';
                            imgContent.filename=uploader.files[j].name;
                            imgContent.filesize=parseInt(uploader.files[j].size);
                            imgContent.is_org=1;
                            imgContent.sub_pos=j;
                            postData.contents[j]=imgContent;
                        }
                        console.dir(postData);console.dir(uploader.files);
                        ajaxPost(postData,uploader,'image');
                    }
                }
            }
        });
        })();
    $('#pub-desc-video-add').click(function(){
        ajaxVideoList('video');
    });
    $('#video-list-cancel').click(function(){
        $('#video-list-block').hide();
    });

    function ajaxVideoList(){
        $.ajax({
            type: 'GET',
            url: '/upload/get_video_list',
            data:{
            },
            dataType: 'json',
            headers:{
                'User-Token':utils.getCookie('user_verify'),
                'Device-Id': '1',
                'App-Ver':'1',
                'Os':'web',
                'Os-Ver':'1',
                'Screen':'1'
            },
            success: function(data, textStatus, jqXHR){
                if(data.code==0){
                    createVideoList(data);
                }
            }
        });
    }
    function createVideoList(data){
        $('#video-list-all').remove();
        var videoList="<div id='video-list-all'></div>";
        $('#video-list-my').append(videoList);
        var videoOne='';
        var videoAll='';
        for(var i=0,length=data.data.length;i<length;i++){
            videoOne = "<div id='video-one-"
            +data.data[i].video_id+ "' class='video-one'><img class='video-one-thumbnail' src='"
            +data.data[i].thumbnail_url+"'/><p class='video-one-title'>"
            +data.data[i].title+"</p><p class='video-one-date'>"
            +utils.timestampToStr(data.data[i].upload_date)+"</p></div>";
            $('#video-list-all').append(videoOne);
            $('#video-one-'+data.data[i].video_id).data('videoOneData',JSON.stringify(data.data[i]));
        }
        if($('#pub-desc-video')[0].style.display=='block'){
            $('.video-one').click(function () {
                var videoDataOne='';
                videoDataOne=$(this).data('videoOneData');
                $('#pub-desc-video-thumbnail').data('videoOneData',videoDataOne).attr('src',JSON.parse(videoDataOne).thumbnail_url).show();
                $('#pub-desc-video-content').show();
                $('#pub-desc-video-border').hide();
                console.dir(videoDataOne);
                console.dir(JSON.parse(videoDataOne).thumbnail_url);
            });
        }else{
            $('.video-one').click(function () {
                editor.focus();
                var video="<video controls='controls' data-videoid='"
                +JSON.parse($(this).data('videoOneData')).video_id +"' poster='"+JSON.parse($(this).data('videoOneData')).thumbnail_url+"' preload='auto' width='100%'><source src='"
                        +JSON.parse($(this).data('videoOneData')).play_url+"' type='video/mp4'/></video>";
                document.execCommand('insertHtml','true',video);
            });
        }
        $('#video-list-block').show();
    }
    function ajaxPost(data,uploader,type) {
        var postUrl=localStorage.localhost+'apiv2/new_pub';
        dataAjax=JSON.stringify(data);
        console.dir(dataAjax);
        $.ajax({
            type: 'POST',
            url: postUrl,
            data:dataAjax,
            dataType: 'json',
            contentType:'application/json',
            xhrFields: {
                withCredentials: true
            },
            headers:{
                'User-Token':utils.getCookie('user_verify'),
                'Device-Id': '1',
                'App-Ver':'1',
                'Os':'web',
                'Os-Ver':'1',
                'Screen':'1'
            },
            success: function(data, jqXHR){
                if(data.code==0){
                    if(type=='image'){
                        subTasks=data.data.sub_tasks;
                        uploader.setOption({
                            'multipart_params': {
                                uptoken:subTasks[0].uptoken,
                                imgType: 'img4Text',
                                isOrg: '1'
                            }
                        });
                        uploader.start();
                    }else if(type=='video'){
                        alert('发布视频成功！');
                    }else if(type=='imgtext'){
                        subTasks=data.data.sub_tasks;
                        uploader.setOption({
                            'multipart_params': {
                                uptoken:subTasks[0].uptoken,
                                imgType: 'img4Text',
                                isOrg: '1'
                            }
                        });
                        uploader.start();
                    }
                }
            }
        });
    }


    //标签选择
    $('#pub-add-tags').click(function(){
        var pubTagsShow = $('#pub-tags-show');
        if(pubTagsShow[0].style.display==''||pubTagsShow[0].style.display=='none'){
            pubTagsShow.show();
            if($('#pub-tags-list')[0].children.length==0){
                ajaxGetRecommendTaglist($('#pub-tags-list'));
            }
        }else if(pubTagsShow[0].style.display=='block') {
            pubTagsShow.hide();
        }
    });
    $('#pub-tags-more').click(function () {
        if($('#pub-tags-list').data('nextPageToken')!=''){
            ajaxGetRecommendTaglist($('#pub-tags-list'),$('#pub-tags-list').data('nextPageToken'));
        }
    });
    $('#pub-add-new-tag').keydown(function(e){
        var curKey = e.which;
        if(curKey == 13){
            ajaxAddNewTag();
            return false;
        }
    });
    function ajaxGetRecommendTaglist(obj,nextPageToken) {
        var recommendTaglistUrl=localStorage.localhost+'apiv2/get_recommend_tag_list';
        $.ajax({
            type: 'GET',
            url: recommendTaglistUrl,
            data:{
                page_token:nextPageToken
            },
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            headers:{
                'User-Token':utils.getCookie('user_verify'),
                'Device-Id': '1',
                'App-Ver':'1',
                'Os':'web',
                'Os-Ver':'1',
                'Screen':'1'
            },
            success: function(data, textStatus, jqXHR){
                if(data.code==0){
                    if(data.data.next_page_token!=''){
                        $('#pub-tags-list').data('nextPageToken',data.data.next_page_token);
                    }else{
                        $('#pub-tags-more').hide();
                    }
                    createRecommendTaglist(data,obj);
                }
            }
        });
    }
    function createRecommendTaglist(data,obj){
        if(data.code==0){
            var length=data.data.list.length;
            var one='';
            var all='';
            for(var i=0;i<length;i++){
                one="<li class='recommend-tag'>"+data.data.list[i].tag_name+"</li>";
                all=all+one;
            }
            obj.append(all);
            $('.recommend-tag').click(function(){
                var alreadyTags = $('#pub-already-tags');
                console.dir(alreadyTags);
                var tagsExist=0;
                for(var i=0,alreadyTagsLength=alreadyTags[0].children.length; i<alreadyTagsLength;i++){
                    if(alreadyTags[0].children[i].innerText==$(this).text()){
                        tagsExist=1;
                        alreadyTags[0].children[i].remove();
                    }
                }
                if(tagsExist==0){
                    if(alreadyTags[0].children.length<6){
                        var one="<li class='already-tag'>"+$(this).text()+"</li>";
                        alreadyTags.append(one);
                        $('.already-tag').click(function () {
                            $(this).remove();
                        });
                    }else{
                        alert('最多打5个标签哦！');
                    }
                }
            });
        }
    }
    function ajaxAddNewTag(){
        var recommendTaglistUrl=localStorage.localhost+'apiv2/add_tag';
        $.ajax({
            type: 'POST',
            url: recommendTaglistUrl,
            data:{
                tag_name:$('#pub-add-new-tag').val()
            },
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            headers:{
                'User-Token':utils.getCookie('user_verify'),
                'Device-Id': '1',
                'App-Ver':'1',
                'Os':'web',
                'Os-Ver':'1',
                'Screen':'1'
            },
            success: function(data, jqXHR){
                if(data.code==0||data.code==2){
                    $('#pub-add-new-tag').val('');
                    var one="<li class='already-tag'>"+data.data.tag_name+"</li>";
                    $('#pub-already-tags').append(one);
                    $('.already-tag').click(function () {
                        $(this).remove();
                    });
                }
            }
        });
    }

    (function pubImgtext(){
        var imgUploadUrl=localStorage.localhost+'api/imghandler/upload';
        var subPos=1;
        var uploader = new plupload.Uploader({
            //上传方式选择
            // runtimes : 'html5,flash,silverlight,html4',
            // 触发文件选择框的dom id或dom元素本身
            browse_button : 'pub-desc-imgtext-add',
            url : imgUploadUrl,
            //flash_swf_url : '/static/lib/pulpload/Moxie.swf',
            //silverlight_xap_url : '/static/lib/pulpload/Moxie.xap',
            //为true时将以multipart/form-data的形式来上传文件，为false时则以二进制的格式来上传文件
            max_retries:1,
            // chunk_size:'500kb',
            multipart:true,
            multipart_params: {
                imgType: 'img4Text',
                title: '',
                desc: '',
                isOrg: '1'
            },
            file_data_name:'picture',
            headers:{
                'User-Token':utils.getCookie('user_verify'),
                'Device-Id': '1',
                'App-Ver':'1',
                'Os':'web',
                'Os-Ver':'1',
                'Screen':'1'
            },
            multi_selection:true,//是否可以选择多个文件
            filters : {
                max_file_size : '20mb',
                prevent_duplicates : true,//不允许选取重复文件
                mime_types: [
                    {title : 'Image files', extensions : 'jpg,gif,png'},
                ]
            },
            init: {
                PostInit: function() {
                }
            }
        });
        //创建结束

        //初始化
        uploader.init();
        //绑定添加图片事件
        uploader.bind('FilesAdded',function(uploader,files){
            console.group('imgtext-FilesAdded');
            console.dir(files);
            console.dir(uploader);
            console.log(files.length);
            console.groupEnd();

            var imgNum;
            var addNum=files.length;
            for(imgNum=0;imgNum<addNum;imgNum++){
                previewImage(files[imgNum],function(imgsrc,file){
                    editor.focus();
                    var img="<img id='"+file.id+"'data-filename='"+file.name+"' data-filesize='"+file.size+"' src='"+imgsrc+"' style='width:100%;'>";
                    document.execCommand('insertHtml',false,img);
                    console.dir(editor);
                });
            }
        });
        function previewImage(file,callback){//file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
            if(!file || !/image\//.test(file.type)) return; //确保文件是图片
            if(file.type=='image/gif'){//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
                var fr = new mOxie.FileReader();
                fr.onload = function(){
                    callback(fr.result);
                    fr.destroy();
                    fr = null;
                };
                fr.readAsDataURL(file.getSource());
            }else{
                var preloader = new mOxie.Image();
                preloader.onload = function() {
                    preloader.downsize( 300, 300 );//先压缩一下要预览的图片,宽300，高300
                    var imgsrc = preloader.type=='image/jpeg' ? preloader.getAsDataURL('image/jpeg',80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
                    callback && callback(imgsrc,file); //callback传入的参数为预览图片的url
                    preloader.destroy();
                    preloader = null;
                };
                preloader.load( file.getSource() );
            }
        }
        // 当队列中的某一个文件正要开始上传前触发
        uploader.bind('BeforeUpload',function(uploader,file){
            console.group('imgtext-BeforeUpload');
            console.dir(file);
            console.dir(uploader);
            console.groupEnd();
        });
        //当上传队列中某一个文件开始上传后触发
        uploader.bind('UploadFile',function(uploader,file){
            console.group('imgtext-UploadFile');
            // console.dir(uploader);
            // console.dir(file);
            // console.groupEnd();
        });
        //
        uploader.bind('QueueChanged',function(uploader,file){
            console.group('imgtext-QueueChanged');
            console.dir(uploader);
            console.dir(file);
            console.groupEnd();
        });
        uploader.bind('UploadProgress',function(uploader,files){
            console.log(uploader.total.percent);

        });
        // 当队列中的某一个文件上传完成后触发
        uploader.bind('FileUploaded',function(uploader,file,responseObject){
            console.group('imgtext-FileUploaded');
            console.dir(uploader);
            console.dir(file);
            console.log(responseObject);
            console.log(responseObject.response);
            console.groupEnd();
            if(subPos<subTasks.length){
                console.log(subTasks[subPos]);
                uploader.setOption({
                    'multipart_params':{
                        uptoken:subTasks[subPos].uptoken,
                        imgType: 'img4Text',
                        isOrg: '1'
                    }
                });
                subPos++;
            }
        });
        //当上传队列中所有文件都上传完成后触发
        uploader.bind('UploadComplete',function(uploader,files){
            console.group('imgtext-UploadComplete');
            console.dir(uploader);
            console.dir(files);
            console.groupEnd();
            console.dir(imgtextList);
        });
        $('#submit-imgtext').click(function(){
            var pubTitle = $('#pub-title-content');
            var alreadyTags = $('.already-tag');
            console.dir(alreadyTags);
            if(pubTitle.val()==''){
                alert('标题不能为空！');
            }else{
                if(alreadyTags.length==0){
                    alert('至少需要打一个标签！');
                }else{
                    //if(uploader.files.length==0){
                    //    alert('请选择图片！');
                    //}else{
                        postData.title=pubTitle.val();
                        postData.tags =new Array();
                        postData.contents =new Array();
                        for(var i=0,alreadyTagsLength=alreadyTags.length; i<alreadyTagsLength;i++) {
                            postData.tags.push(alreadyTags[i].innerText);
                        }
                        traverseNodes(editor);
                        console.dir(imgtextList);
                        postData.contents = createContents(imgtextList);
                        ajaxPost(postData,uploader,'imgtext');
                    //}
                }
            }
        });
    })();

    $('#pub-desc-imgtext-addvideo').click(function () {
        ajaxVideoList('video');
    });

    function createContents(){
        var imgtextListContent=new Array();
        var imgtextListLength=imgtextList.length;
        for(var i=0;i<imgtextListLength;i++){
            imgtextListContent[i] = new Object();
            if(imgtextList[i].nodeName=='IMG'){
                imgtextListContent[i].type='image';
                imgtextListContent[i].filename=imgtextList[i].dataset.filename;
                imgtextListContent[i].filesize=parseInt(imgtextList[i].dataset.filesize);
                imgtextListContent[i].is_org=1;
                imgtextListContent[i].sub_pos=i;

            }else if(imgtextList[i].nodeName=='VIDEO'){
                imgtextListContent[i].type='ihp_repo_v';
                imgtextListContent[i].repo_video_id=imgtextList[i].dataset.videoid;
            }else{
                imgtextListContent[i].type='text';
                imgtextListContent[i].text=imgtextList[i];
            }
        }
        return imgtextListContent;
    }

    var editor = document.getElementById('richedit');
    editor.onfocus = function () {
        window.setTimeout(function () {
            var sel,range;
            if (window.getSelection && document.createRange) {
                range = document.createRange();
                range.selectNodeContents(editor);
                range.collapse(true);
                range.setEnd(editor, editor.childNodes.length);
                range.setStart(editor, editor.childNodes.length);
                sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (document.body.createTextRange) {
                range = document.body.createTextRange();
                range.moveToElementText(editor);
                range.collapse(true);
                range.select();
            }
        }, 1);
    };




        var imgtextNum=0;
        var imgtextList=new Array();
        function traverseNodes(node){
            //判断是否是元素节点
            //console.dir(node);
            if(node.nodeType == 1){
                //判断是否有属性节点
                if(node.nodeName=='IMG'||node.nodeName=='VIDEO'){

                    imgtextList[imgtextNum]=node;
                    console.dir(typeof imgtextList[imgtextNum]);
                    imgtextNum++;
                    //console.dir(node);
                }
                //判断该元素节点是否有子节点
                if(node.hasChildNodes){
                    //得到所有的子节点
                    var sonnodes = node.childNodes;
                    //遍历所哟的子节点
                    for (var i = 0; i < sonnodes.length; i++) {
                        //得到具体的某个子节点
                        var sonnode = sonnodes.item(i);
                        //递归遍历
                        traverseNodes(sonnode);
                    }
                }
            }else if(node.nodeType == 3) {
                if(typeof imgtextList[imgtextNum-1]=='string'){
                    imgtextList[imgtextNum-1]=imgtextList[imgtextNum-1]+node.data;
                }else{
                    imgtextList[imgtextNum]=node.data;
                    // console.dir(typeof imgtextList[imgtextNum]);
                    imgtextNum++;
                }
            }
        }

});
