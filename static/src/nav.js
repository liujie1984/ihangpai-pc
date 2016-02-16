define(function(require) {
    var $ = require('jquery');
    var Utils = require('./utils');
    var utils = new Utils();
    
    (function judgeLogin(){
        //用户已登录
        if(utils.getCookie('user_verify')!=undefined&&utils.getCookie('user_verify')!=''){
            console.log('user_verify已存在');
            alreadyLogin(localStorage.nickname,localStorage.avatar_url);
        }else{
            beforeLogin();
        }

    })();

    (function storageLocalhost(){
        //存储域名
        if (location.href.indexOf('fabu') > 0){
            localStorage.localhost='http://mapi.52hangpai.cn/';
        }
        if (location.href.indexOf('t-fabiao') > 0) {
            localStorage.localhost='http://alpha.52hangpai.cn/';
        }
        console.log(localStorage.localhost);
    })();

    (function showMywork(){
        $('#user-info').on('mouseover',function(){
            $('#user-myworks').show();
        }).on('mouseout',function(){
            $('#user-myworks').hide();
        });
    })();

    (function quitLogin() {
        //绑定退出事件
        $('#quit').click(function(){
            localStorage.clear();
            var date=new Date();
            date.setTime(date.getTime()-10000);
            document.cookie='user_verify'+'=; expire='+date.toGMTString()+'; path=/;domain=.52hangpai.cn';
            //utils.clearCookie('user_verify');
            window.location='/api/login';
        });
    })();

    //设置第三方登录的url
    (function setThirdPartyUrl(){
        //正式服
        if (location.href.indexOf('fabu') > 0){
            //qq第三方url设置
            var qqLoginHref = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101260753&redirect_uri=http://fabu.52hangpai.cn/third_party_login/qq_login';
            //nav
            $('#qq-login').attr('href',qqLoginHref);
            //login
            $('#qq').children().attr('href',qqLoginHref);

            //微信第三方url设置
            var encodeRedirectUri=encodeURIComponent('http://fabu.52hangpai.cn/third_party_login/wx_login');
            var wxLoginHref='https://open.weixin.qq.com/connect/qrconnect?appid=wxc5cd0381ab942049&redirect_uri='
                +encodeRedirectUri+'&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect';
            $('#weixin-login').attr('href',wxLoginHref);
            $('#weixin').children().attr('href',wxLoginHref);

            //优酷第三方登录
            var youkuLoginHref = 'https://openapi.youku.com/v2/oauth2/authorize?response_type=code&client_id=143c766800baef8a&redirect_uri=http://fabu.52hangpai.cn/third_party_login/youku_login';
            //nav
            $('#youku-login').attr('href',youkuLoginHref);
            //login
            $('#youku').children().attr('href',youkuLoginHref);
        }
        //测试服
        if (location.href.indexOf('t-fabiao') > 0) {
            var qqLoginHref = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101261235&redirect_uri=http://t-fabiao.52hangpai.cn/third_party_login/qq_login';
            $('#qq-login').attr('href',qqLoginHref);
            //login
            $('#qq').children().attr('href',qqLoginHref);

            //微信第三方url设置
            var encodeRedirectUri=encodeURIComponent('http://t-fabiao.52hangpai.cn/third_party_login/wx_login');
            var wxLoginHref='https://open.weixin.qq.com/connect/qrconnect?appid=wxfc9b795f6150b319&redirect_uri='
                +encodeRedirectUri+'&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect';
            $('#weixin-login').attr('href',wxLoginHref);
            $('#weixin').children().attr('href',wxLoginHref);

            var youkuLoginHref = 'https://openapi.youku.com/v2/oauth2/authorize?response_type=code&client_id=3b0ef82784168b3f&redirect_uri=http://t-fabiao.52hangpai.cn/third_party_login/youku_login';
            //nav
            $('#youku-login').attr('href',youkuLoginHref);
            //login
            $('#youku').children().attr('href',youkuLoginHref);
        }
    })();
    (function navUrl(){
        if (location.href.indexOf('fabu') > 0){
            $('nav').data('localhost','http://mapi.52hangpai.cn/');
        }
        if (location.href.indexOf('t-fabiao') > 0) {
            $('nav').data('localhost','http://test.52hangpai.cn/');
        }
        console.log('$url:'+$('nav').data('localhost'));
    })();
    function alreadyLogin(nickname,avatar_url){
        $('#ihp-login').hide();
        $('#nickname').text(nickname);
        $('#avatar').attr('src',avatar_url);
        $('#already-login').show();
    }
    function beforeLogin(){
        $('#ihp-login').show();
        $('#already-login').hide();
    }
});