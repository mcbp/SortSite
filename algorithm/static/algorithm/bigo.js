
//O(1)
var constantArraySize = 5;
//execute
$("#executeConstant").click(function () {
    document.getElementById("outConstant").innerHTML = "4";
    document.getElementById("runConstant").innerHTML = "O(1) => 1";
});
//add
$("#addConstant").click(function () {
    constantArraySize++;
    $('#addConstantHere').append(", " + constantArraySize)
});


//O(n)
var linearArraySize = 5;
//execute
$("#executeLinear").click(function () {
    var array = [];
    for (var i = 0; i < linearArraySize; i++) {
        array.push(i+1);
    }
    document.getElementById("outLinear").innerHTML = array.toString();
    document.getElementById("runLinear").innerHTML = "O(n) => " + linearArraySize;
});
//add
$("#addLinear").click(function () {
    linearArraySize++;
    $('#addLinearHere').append(", " + linearArraySize)
});


//O(n^2)
var quadSize = 2;
var letters = ["x", "y", "z", "a", "b", "c", "d", "e", "f", "g"];
//execute
$("#executeQuad").click(function () {
    var array = [];
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < Math.pow(5, quadSize-1); j++) {
            array.push(i+1);
        }
    }
    document.getElementById("outQuad").innerHTML = array.toString();
    document.getElementById("runQuad").innerHTML = "O(n^" + quadSize + ") => " + Math.pow(5, quadSize);
});
//add
$("#addQuad").click(function () {
    var tabs = "    ";
    for (var i = 1; i < quadSize; i++) {
        tabs += "    ";
    }
    quadSize++;
    $('#addQuadHere').append("\n" + tabs + "<c>for</c> " + letters[quadSize-1] + " <c>in</c> array:");
    tabs = tabs.substring(0, tabs.length-4);
    document.getElementById('addQuadTabsHere').innerHTML = tabs;
});


//O(log n)
var logArraySize = 8;
//execute
$("#executeLog").click(function () {
    var array = [];
    for (var i = 1; i <= logArraySize; i=i*2) {
        array.push(i);
    }
    document.getElementById("outLog").innerHTML = array.toString();
    document.getElementById("runLog").innerHTML = "O(log n) => " + Math.log2(logArraySize);
});
//add
$("#addLog").click(function () {
    logArraySize++;
    $('#addLogHere').append(", " + logArraySize)
});