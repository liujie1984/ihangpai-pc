define(function(require) {
    var $ = require('jquery');
    (function router(){
        var container='';
        //教程
        if(location.href.indexOf('tutorial_list')>0){
            container = "<div><div><h3>初级教程</h3><a href='/content/tutorial_primary_list'>更多</a><div id='tutorial-primary'></div></div>" +
            "<div><h3>中级教程</h3><a href='/content/tutorial_intermediate_list'>更多</a><div id='tutorial-intermediate'></div></div>" +
            "<div><h3>高级教程</h3><a href='/content/tutorial_senior_list'>更多</a><div id='tutorial-senior'></div></div></div>";
            $('#list-container').append(container);
            ajaxGetList($('#tutorial-primary'));
            ajaxGetList($('#tutorial-intermediate'));
            ajaxGetList($('#tutorial-senior'));
        }
        //评测
        if(location.href.indexOf('review_list')>0){
            ajaxGetList($('#list-container'));
        }
        //业内
        if(location.href.indexOf('industry_list')>0){
            ajaxGetList($('#list-container'));
        }
        if(location.href.indexOf('tutorial_primary_list')>0){
            container = "<div><h3>初级教程</h3><div id='tutorial-primary-list'></div></div>";
            $('#list-container').append(container);
            ajaxGetList($('#tutorial-primary-list'));
        }
        if(location.href.indexOf('tutorial_intermediate_list')>0){
            container = "<div><h3>中级教程</h3><div id='tutorial-intermediate-list'></div></div>";
            $('#list-container').append(container);
            ajaxGetList($('#tutorial-intermediate-list'));
        }
        if(location.href.indexOf('tutorial_senior_list')>0){
            container = "<div><h3>高级教程</h3><div id='tutorial-senior-list'></div></div>";
            $('#list-container').append(container);
            ajaxGetList($('#tutorial-senior-list'));
        }
        if(location.href.indexOf('works_list')>0){

        }
    })();
    ajaxGetList();
    function ajaxGetList(obj,type,page,page_size,list_ver) {
        var getTutorialsUrl=localStorage.localhost+'apiv2/tutorial_and_review';
        $.ajax({
            type: 'GET',
            url: getTutorialsUrl,
            data: {
                type:type
            },
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            headers:{
                'User-Token':'1',
                'Device-Id': '1',
                'App-Ver':'1',
                'Os':'web',
                'Os-Ver':'1',
                'Screen':'1'
            },
            success: function(data){
                if (data.code==0) {
                    createList(data,obj);
                }
            },
            error: function(jqXHR){
                console.log('getTutorials()+'+jqXHR);
            }
        });
    }

    function createList(data,obj){
        var listLength = data.data.list.length;
        var all='';
        var one='';
        for(var i=0;i<listLength;i++){
            one= "<a class='list-one'><div class='list-left fl'><img class='list-image' src='"
            +data.data.list[i].image+"'/></div><div class='list-right fr'><p class='list-title'>"
            +data.data.list[i].title+"</p><p class='list-subtitle'>"
            +data.data.list[i].subtitle+"</p></div></a>";
            all = all+one;
        }
        obj.append(all);
    }

});