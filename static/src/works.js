define(function(require) {
    var $ = require('jquery');
    var Utils = require('./utils');
    var utils = new Utils();
    (function () {
        $('reply-content').click(function(){
            var htmlComment=""
            ajaxComment(type,id,content,replay_to);
        });

    })();
    function ajaxComment(type,id,content,replay_to){
        $.ajax({
            type: 'POST',
            url: 'Works.json',
            data: {
                'type':'',
                'id':'',
                'content':'',
                'reply_to':''
            },
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            headers:{
                'User-Token':'11',
                'Device-Id': '1',
                'App-Ver':'1',
                'Os':'web',
                'Os-Ver':'os',
                'Screen':'1'
            },
            success: function(data, textStatus, jqXHR){
                if(data.code==0){

                }
            },
            error: function(xhr, status, err) {
            }
        });
    }
    //获取作品，并渲染
    (function ajaxUserProfile(){
        var userProfileUrl=localStorage.localhost+'api/accounts/user_profile';
        var userId=localStorage.user_id;
        $.ajax({
            type: 'GET',
            url: 'Works.json',
            data: {
            },
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            headers:{
                'User-Token':'11',
                'Device-Id': '1',
                'App-Ver':'1',
                'Os':'web',
                'Os-Ver':'os',
                'Screen':'1'
            },
            success: function(data, textStatus, jqXHR){
                if(data.code==0){
                    $('#works-about-left-face').attr('src',data.data.owner.avatar_url);
                    $('#works-about-left-nickname').text(data.data.owner.nickname);
                    $('#works-about-left-time').text(utils.timestampToStr(data.data.pub_date));
                    $('#works-about-right-praiseNum').text(data.data.pub_count);
                    $('#works-about-right-commentsNum').text(data.data.pub_count);
                    if(data.data.tags!=null){
                        createTagLists(data.data.tags,$('#works-tag-list'));
                    }
                    if(data.data.detail_list!=null){
                        createWorksContent(data.data.detail_list,$('#works-content'));
                        baguetteBox.run('.baguetteBoxOne', {
                            animation: 'fadeIn'
                        });
                        setVideoHeight($('.video'));
                    }
                    if(data.data.comments!=null){
                        createCommentLists(data.data.comments.list,$('#works-comment-list'));
                    }
                }
            },
            error: function(xhr, status, err) {
            }

        });
    })();
    function createTagLists(tags,obj){
        var tagNum=tags.length;
        var tagList="";
        var tagLists="";
        for(tagi=0;tagi<tagNum;tagi++){
            tagList="<span>"+tags[tagi].tag_name+"</span>";
            tagLists=tagLists+tagList;
        }
        obj.append(tagLists);
    }
    function createWorksContent(detailContent,obj){
        var detailNum=detailContent.length;
        var detailList="";
        for(detaili=0;detaili<detailNum;detaili++){
            if(detailContent[detaili].type=="text"){
                detailList="<p class='detail-content-text'>"+detailContent[detaili].content.text+"</p>";
                obj.append(detailList);
            }
            else if(detailContent[detaili].type=="image"){
                detailList="<a href='"
                +detailContent[detaili].content.img_url+"'><img src='"+detailContent[detaili].content.img_url+"'/></a>";
                obj.append(detailList);

            }
            else if(detailContent[detaili].type=="ihp_v"){
                var videoId='video'+detaili;
                detailList="<video id='"
                +videoId+"' class='video-js vjs-default-skin video vjs-big-play-centered' width='1000px' controls  poster='"
                +detailContent[detaili].content.thumbnail_url+"'data-setup='{}'><source src='"
                +detailContent[detaili].content.play_url+"' type='video/mp4'></video>";
                obj.append(detailList);
                var player = videojs(videoId, {"controls": true,"autoplay": false,"preload": "auto" }, function() {
                    console.log('Good to go!');
                    this.on('ended', function() {
                        console.log('awww...over so soon?');
                    });
                });
            }else if(detailContent[detaili].type=="youku_v"){
                detailList="<iframe class='youku' height=400 width=1000 src='"
                +detailContent[detaili].content.play_url+"' scrolling='no' frameborder=0 allowfullscreen></iframe>";
                obj.append(detailList);
                setVideoHeight($(".youku"));
            }
        }
    }
    function createCommentLists(comments,obj){
        var commentNum=comments.length;
        var commentList="";
        var commentLists="";
        for(commenti=0;commenti<commentNum;commenti++){
            if(comments[commenti].reply_to==null){
                commentList="<div class='comment-list'><div class='reply-face-container'><img class='reply-face' src='"
                +comments[commenti].owner.avatar_url+"'/></div><div class='reply-content'><div class='reply-info'><span class='replay-name'>"
                +comments[commenti].owner.nickname+"</span><span class='reply-time'>"
                +utils.timestampToStr(comments[commenti].created_at)+"</span></div><p class='reply-detail'>"
                + comments[commenti].content+"</p></div></div>";
                commentLists=commentLists+commentList;
            }else{
                commentList="<div class='comment-list'><div class='reply-face-container'><img class='reply-face' src='"
                +comments[commenti].owner.avatar_url+"'/></div><div class='reply-content'><div class='reply-info'><span class='replay-name'>"
                +comments[commenti].owner.nickname+"</span><span class='reply-time'>"
                +utils.timestampToStr(comments[commenti].created_at)+"</span></div><p class='reply-detail'>回复:<span class='reply-to-name'>"
                +comments[commenti].reply_to.nickname+"</span>"
                +comments[commenti].content+"</p></div></div>";
                commentLists=commentLists+commentList;
            }
        }
        obj.append(commentLists);
    }
    function setVideoHeight(obj){
        var objWidth=obj.width();
        obj.height(objWidth*9/16);
    }
    var BackTop = require('./module-backtop');
    var backTop = new BackTop();
    backTop.render();
});


