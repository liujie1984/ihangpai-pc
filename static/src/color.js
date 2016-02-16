define(function(require, exports, module) {
    function Color(id) {
        this.container = document.getElementById(id);
    }

    module.exports = Color;

    Color.prototype.render = function() {
        //this._init();
        console.dir(this.container);
        this.container.innerText='change color success';
        //this.icons.show();
        //this._spin();
    };
});

