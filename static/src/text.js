define(function(require, exports, module) {
    function Text(id) {
        this.container = document.getElementById(id);
    }

    module.exports = Text;

    Text.prototype.render = function() {
        //this._init();
        console.dir(this.container);
        this.container.innerText='change TEXT success';
        //this.icons.show();
        //this._spin();
    };
});