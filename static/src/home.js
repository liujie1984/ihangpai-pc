define(function(require) {
    var $ = require('jquery');
    (function shufflingBanner(){
        var num=0;
        var time = setInterval(timingBanner,2000);
        $('#home-top-banner-hover > li').mouseover(function(){
            $('#home-top-banner-hover > li').css('background-color','blue');
            $(this).css('background-color','red');
            var num=$(this)[0].id.split('-')[4];
            $('#home-top-banner-img > li').hide();
            $('#home-top-banner-img-'+num).show();
            console.dir($(this));
            clearInterval(time);
        });
        $('#home-top-banner-hover > li').mouseout(function(){
            num =$(this)[0].id.split('-')[4];
            time = setInterval(timingBanner,2000);
        });

        function timingBanner(){
            console.log('2');
            if(num>4){
                num=0;
            }
            $('#home-top-banner-hover > li').css('background-color','blue');
            $('#home-top-banner-img > li').hide();

            $('#home-top-banner-hover-'+num).css('background-color','red');
            $('#home-top-banner-img-'+num).show();
            num++;
        }
    })();


});