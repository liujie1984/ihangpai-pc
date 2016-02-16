define(function(require, exports, module) {
    var $ = require('jquery');
    function WorksList(id) {
        this.container = $('#'+id);
    }

    module.exports = WorksList;
    WorksList.prototype.render = function() {
        //this._init();
        console.dir(this.container);
        //this.container.text('change color success aaaa');
        //this.icons.show();
        //this._spin();
    };

    //创建我的作品列表
    WorksList.prototype.createMy = function(data){
        this.container.data('nextPageToken',data.data.next_page_token);console.dir(this.container.data('nextPageToken'));
        var worksOne='';
        var worksList='';
        var worksLength=data.data.list.length;
        for(var worksi=0;worksi<worksLength;worksi++){
            worksOne="<div class='module-works-one fl'>"
            +this.create_container(data.data.list[worksi])
            +this.create_title(data.data.list[worksi])
            //+this.create_taglist(data.data.list[worksi])
            +this.create_about(data.data.list[worksi])
            +"</div>";
            worksList=worksList+worksOne;
        }
        this.container.append(worksList);
    };
    //创建其他用户的作品列表
    WorksList.prototype.createOther = function(){

    };
    //单个模块的子模块
    WorksList.prototype.create_container = function(one){
        var isVideo='';
        if(one.thumbnail.content.type=='ihp_v'||one.thumbnail.content.type=='youku_v') {
            isVideo = "<img class='module-works-one-container-videoicon' src='http://7xqamv.com2.z0.glb.qiniucdn.com/icon-video-play.png'/>";
        }
        var container = "<div class='module-works-one-container'><img class='module-works-one-container-image' src='"
        +one.thumbnail.content.thumbnail_url+"'/>"+isVideo+"</div>";
        return container;
    };
    WorksList.prototype.create_title = function(one){
        var worksTitle = "<div class='module-works-one-title'><a href='"
        +one.pub_id+"'>" +one.title+"</a></div>";
        return worksTitle;
    };
    WorksList.prototype.create_userface = function(one){
        var face ='';
    };
    WorksList.prototype.create_taglist = function(one){
        var tagList='';
        if(one.tags!=null){
            var tagOne='';
            var tagLength=one.tags.length;
            for(var tagi=0;tagi<tagLength;tagi++){
                tagOne="<a>"+one.tags[tagi].tag_name+"</a>";
                tagList=tagList+tagOne;
            }
        }
        return tagList;
    };
    WorksList.prototype.create_about = function(one){
        var worksAbout = "<div class='module-works-one-about'><span class='module-works-one-time'>"
            +timestampToStr(one.pub_date)+"</span><span class='module-works-one-commentslike'><img src='http://7xqamv.com2.z0.glb.qiniucdn.com/icon-like-unchoose.png' alt=''/><span class='module-works-one-like'>"
            +one.likes_count+"</span><img src='http://7xqamv.com2.z0.glb.qiniucdn.com/icon-comments.png' alt=''/><span class='module-works-one-comments'>"
            +one.comments_count+"</span></span></div>";
        return worksAbout;
    };

    function timestampToStr(timestamp) {
        var unixTimestamp = new Date(timestamp * 1000) ;
        var d = new Date(timestamp * 1000);
        var jstimestamp = (d.getFullYear())+"-"+(d.getMonth()+1)+"-"+
            (d.getDate())+" "+(d.getHours()-8)+":"+(d.getMinutes())+":"
            +(d.getSeconds());
        return jstimestamp;
    }

});

