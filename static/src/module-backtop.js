define(function(require, exports, module) {
    var $ = require('jquery');
    function BackTop() {
        //this.container = document.getElementById(id);
    }

    module.exports = BackTop;

    BackTop.prototype.render = function() {
        this._init();
        this._go();
    };

    BackTop.prototype._init = function() {
        var backtop="<img class='back-top' src='http://7xqamv.com2.z0.glb.qiniucdn.com/icon-backtop.png'/>";
        $('html').append(backtop);
        $('.back-top').css({
            'position':'fixed',
            'bottom': '40px',
            'right':'10px',
            'display':'none'
        });
    };
    BackTop.prototype._go = function() {
        $(window).scroll(function(){
            if($(window).scrollTop()>100){
                $(".back-top").fadeIn(500);
            } else {
                $(".back-top").fadeOut(500);
            }
        });
        $(".back-top").click(function(){
            $('body,html').animate({scrollTop:0},1000);
            return false;
        });
    };
});

