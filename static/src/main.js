define(function(require) {

    var Color = require('./color');
    var color = new Color('color');
    color.render();

    var Text = require('./text');
    var text = new Text('text');
    text.render();

    var $ = require('jquery');
    console.dir($);
    $("#color").css({"font-size":"50px"});

});

