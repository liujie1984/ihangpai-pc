define(function(require) {
    var $ = require('jquery');
    //轮播
    (function shufflingBackground(){
        $('.person-background-choose').mouseover(function(){
            $('.person-background-choose').css('background-color','yellow');
            $('.person-background-page').hide();
            $(this).css('background-color','red');
            var num=$(this)[0].id.split('-')[3];
            $('#person-background-page'+num).show();
        });
    })();
    //切换用户信息显示
    (function shufflingPersonInfo(){
        $('.person-details').click(function(){
            $('.person-details').css('background-color','yellow');
            $('.person-list').hide();
            $(this).css('background-color','red');
            var choose=$(this)[0].id.split('-')[2];
            console.log(choose);
            $('#person-list-'+choose).show();
        });
    })();
    //获取用户信息，并渲染
    (function ajaxUserProfile(){
        var userProfileUrl=localStorage.localhost+'api/accounts/user_profile';
        var userId=localStorage.user_id;
        $.ajax({
            type: 'GET',
            url: 'UserProfile.json',
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
                    $('#person-nickname').text(data.data.nickname);
                    $('#person-drone').text(data.data.drone_name);
                    $('#person-location').text(data.data.location);
                    $('#person-details-pub-count').text(data.data.pub_count);
                    $('#person-details-tag-count').text(data.data.mix_tags_count);
                    $('#person-details-followed-count').text(data.data.followed_count);
                    $('#person-details-followers-count').text(data.data.followers_count);
                    $('#person-face').attr('src',data.data.avatar_url);
                    var personGender=$('#person-gender');
                    switch (data.data.gender)
                    {
                        case 'U':
                            personGender.attr('src','');
                            break;
                        case 'M':
                            personGender.attr('src','http://7xqamv.com2.z0.glb.qiniucdn.com/icon-male.png');
                            break;
                        case 'F':
                            personGender.attr('src','http://7xqamv.com2.z0.glb.qiniucdn.com/icon-female.png');
                            break;
                    }
                }
            },
            error: function(xhr, status, err) {
            }

        });
    })();
    //获取用户列表，并渲染
    ajaxPersonWorksList();
    function ajaxPersonWorksList(){
        var personWorksListUrl=localStorage.localhost+'api/accounts/user_profile';
        var userId=localStorage.user_id;
        $.ajax({
            type: 'GET',
            url: 'WorksList.json',
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
                    var WorksList = require('./module-works-list');
                    var personWorksList = new WorksList('person-list-works');
                    personWorksList.createMy(data);
                }
            },
            error: function(xhr, status, err) {
            }
        });
    }
    ajaxUserTagList();
    function ajaxUserTagList(){
        var personWorksListUrl=localStorage.localhost+'/apiv2/user_tag_list';
        var userId=localStorage.user_id;
        $.ajax({
            type: 'GET',
            url: 'TagList.json',
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

                }
            },
            error: function(xhr, status, err) {
            }
        });
    }
    ajaxFollowTagList();
    function ajaxFollowTagList(){
        var personWorksListUrl=localStorage.localhost+'/apiv2/user_tag_list';
        var userId=localStorage.user_id;
        $.ajax({
            type: 'GET',
            url: 'TagList.json',
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

                }
            },
            error: function(xhr, status, err) {
            }
        });
    }
    function createTagList(){

    }



    var BackTop = require('./module-backtop');
    var backTop = new BackTop();
    backTop.render();
});


