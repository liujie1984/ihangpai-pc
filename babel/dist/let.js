'use strict';

//let只在代码块里面有效
//let没有变量声明提升
{
    console.dir(a);
    var a = 10;
    var b = 1;
    console.dir(a);
}
//console.dir(a);
console.dir(b);

//暂时性死区
//只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，
// 只有等到声明变量的那一行代码出现，才可以获取和使用该变量

var tmp = 123;
if (true) {
    _tmp = 'abc'; // ReferenceError
    console.dir(_tmp);
    var _tmp = undefined;
    console.dir(_tmp);
}

//重复声明报错
{
    var _c = 1;
    var c = 10;
    console.dir(_c);
}