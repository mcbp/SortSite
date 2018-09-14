//var BACKGROUND = "#0D1321";
var BACKGROUND = "#f9f8f8";
//var BAR = "#FFF9F8";
//var BAR = "#0D1321";
var BAR = "#cdd3ce";
//var COMPARE = "#9DACE3";
var COMPARE = "#f0b67f";
//var SWAP = "#80D39B";
var SWAP = "#eb5160";
var DARK = "#5a6062";
var SELECT = "#BE90D4";
// holds global timer ids for the bar creation animation
var growTimeouts = [];
var animation;
var activeTest = true;
var slowMode = false;
//var leaveColouredArray = [];

function drawArray(canvas, array, colours, initialFlag, _this) {

    //create canvas context
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = BAR;
    ctx.strokeStyle = BAR;
    ctx.moveTo(0,canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();

    var widthRatio = 2;
    var len = array.length;
    var barSpacing = canvas.width / (widthRatio * len + len + 1);
    var barWidth = barSpacing * widthRatio;
    var x = barSpacing;
    var y;

    if (growTimeouts.length > 0) {
        clearTimerArray(growTimeouts);
    }

    if (initialFlag == true) {
        var delay = 0;
        var speed = 0.5;

        for (var i = 0; i < array.length; i++) {
            y = array[i] * canvas.height;
            for (var j = 0; j < array[i]*canvas.height; j+=25) {
                if (array[i]*canvas.height - j < 25) {
                    j = array[i]*canvas.height;
                }
                var growBars = setTimeout(
                    ctx.fillRect.bind(ctx, x, canvas.height-j, barWidth, j),
                    (i == 0 ? 0 : delay) + j*speed
                );
                growTimeouts.push(growBars);
            }
            x = x + barWidth + barSpacing;
            delay += (1/array.length)*speed*1000;
        }

        // start main animation after waiting for the start up animation tro finish
        startDelay = delay+array[array.length-1]*canvas.height*speed;
        animation = window.setTimeout(_this.startAnimation, startDelay, _this);


    } else {

        //draw bars with size proportional to value inside array
        for (var i = 0; i < array.length; i++) {
            y = array[i] * canvas.height;
            ctx.fillStyle = colours[i];
            ctx.fillRect(x, canvas.height-y, barWidth, y-1)
            x = x + barWidth + barSpacing;
        }

    }
}

function clearTimerArray(timerArray) {
    for (var i = 0; i < timerArray.length; i++) {
        clearTimeout(timerArray[i]);
    }
    return timerArray;
}

function canvasArray(input_array, input_canvas, input_interval) {

    // setup canvasArray object values
    // this array is the actual values
    this.array = input_array;
    this.canvas = input_canvas;
    // this a duplicate array used for animation as I
    // don't want to be messing with the real one
    this.animatedArray = [];
    // array of the bar colours
    this.colours = [];
    this.queue = [];
    this.fillColour = BAR;
    this.input_interval = input_interval;
    if (input_interval < 200) {slowMode = true;} else {slowMode = false;}
    this.buildUpArray = [];
    this.leaveColouredArray = []

    for (var i = 0; i < this.array.length; i++) {
        this.animatedArray.push(this.array[i]);
        this.colours.push(BAR);
    }

    //so I can use "this" (referring to the canvasArray) inside the set interval function
    var _this = this;

    drawArray(this.canvas, this.array, this.colours, true, _this);

    //this.startAnimation(_this)

}

canvasArray.prototype.startAnimation = function(_this) {
    _this.isPaused = false;
    _this.isSorted = false;

    _this.animLoop = window.setInterval(function() {
        if(_this.isPaused == false) {
           _this.stepQueue();
        }
    }, _this.input_interval);

    $("#pause").click(function() {
        if(_this.isPaused == true) {
            _this.isPaused = false;
            document.getElementById("pause").innerHTML = "Pause";
        } else {
            _this.isPaused = true;
            document.getElementById("pause").innerHTML = "Resume";
        }
    });

    $("#step").click(function() {
        if(_this.isPaused == false) {
            _this.isPaused = true;
            document.getElementById("pause").innerHTML = "Resume";
        }
        _this.stepQueue();
    });


    $("#quiz").click(function() {
        if(_this.isPaused == false) {
            _this.isPaused = true;
            document.getElementById("pause").innerHTML = "Resume";
        }

        $(".answers").html($(".answers .answer").sort(function() {
            return Math.random()-0.5;
        }));

        document.getElementById("quiz").classList.add("hide");
        document.getElementById("question").classList.remove("hide");
        document.getElementById("pause").disabled = true;
        document.getElementById("step").disabled = true;

        var a1 = document.getElementById("answer1");
        a1.classList.remove("hide");
        a1.style.cursor = "pointer";
        var a2 = document.getElementById("answer2");
        a2.classList.remove("hide");
        a2.style.cursor = "pointer";
        var a3 = document.getElementById("answer3");
        a3.classList.remove("hide");
        a3.style.cursor = "pointer";

        a1.onclick = function() {
            document.getElementById("result-correct").classList.remove("hide");
            hideQuestion();
            setTimeout(resetQuiz, 3000);
        };

        a2.onclick = function() {
            document.getElementById("result-incorrect").classList.remove("hide");
            hideQuestion();
            setTimeout(resetQuiz, 3000);
        };

        a3.onclick = function() {
            document.getElementById("result-incorrect").classList.remove("hide");
            hideQuestion();
            setTimeout(resetQuiz, 3000);
       };


    });
}


function resetQuiz() {
    document.getElementById("quiz").classList.remove("hide");
    document.getElementById("question").classList.add("hide");
    document.getElementById("answer1").classList.add("hide");
    document.getElementById("answer2").classList.add("hide");
    document.getElementById("answer3").classList.add("hide");
    document.getElementById("result-correct").classList.add("hide");
    document.getElementById("result-incorrect").classList.add("hide");
    document.getElementById("pause").disabled = false;
    document.getElementById("step").disabled = false;
}


function hideQuestion() {
    document.getElementById("question").classList.add("hide");
    document.getElementById("answer1").classList.add("hide");
    document.getElementById("answer2").classList.add("hide");
    document.getElementById("answer3").classList.add("hide");
}


canvasArray.prototype.nonEvent = function(codeLines, statusLines) {
    this.queue.push([0, -1, -1, codeLines, statusLines]);
}

// ...codeLines is a variable amount of parameters,
// use if i need to highlight an unknown amount of lines of code
canvasArray.prototype.compare = function(i, j, codeLines, statusLines) {
    // update animation queue where compare = 1
    this.queue.push([1, i, j, codeLines, statusLines]);
    // compare elements at indices i and j
    // will return true if i is bigger than j
    // and false if smaller or equal
    if (this.array[i] > this.array[j]) {
        return true;
    } else {
        return false;
    }
}

canvasArray.prototype.swap = function(i, j, codeLines, statusLines) {
    // update animation queue where switch = 2
    this.queue.push([2, i, j, codeLines, statusLines]);
    // swap elements at indices i and j
    var temp = this.array[i];
    this.array[i] = this.array[j];
    this.array[j] = temp;
}

canvasArray.prototype.selectOne = function(one, codeLines, statusLines) {
    this.queue.push([3, one, -1, codeLines, statusLines]);
}

canvasArray.prototype.selectMultiple = function(multi, codeLines, statusLines) {
    this.queue.push([4, multi, -1, codeLines, statusLines]);
}

canvasArray.prototype.buildUp = function(i, j, codeLines, statusLines) {
    this.queue.push([5, i, j, codeLines, statusLines]);
}

canvasArray.prototype.selectOneAndClear = function(one, codeLines, statusLines) {
    this.queue.push([6, one, -1, codeLines, statusLines]);
}

canvasArray.prototype.clearBars = function() {
    this.leaveColouredArray = [];
    this.queue.push([7, -1, -1]);
}

canvasArray.prototype.leaveColouredCompare = function(i, j, codeLines, statusLines) {
    this.queue.push([8, i, j, codeLines, statusLines]);
    if (this.array[i] > this.array[j]) {
        return true;
    } else {
        return false;
    }
}

canvasArray.prototype.leaveColoured = function(i, codeLines, statusLines) {
    this.queue.push([9, i, -1, codeLines, statusLines]);
}

canvasArray.prototype.getMedian = function(a, b, c) {
    var temp = [this.array[a], this.array[b], this.array[c]];
    temp.sort();
    console.log(a, b, c);
    if (temp[1] == this.array[a]) {
        return a;
    } else if (temp[1] == this.array[b]) {
        return b;
    } else {
        return c;
    }
}


canvasArray.prototype.stepQueue = function() {
    //bubble = 1, merge = 2, selection = 3, insertion = 4
    clearCodeHighlights();
    hideStatus();

    // if queue empty just redraw
    if (this.queue.length == 0) {
        drawArray(this.canvas, this.animatedArray, this.colours);
        return;
    }

        // assign and remove first element from queue with shift()
        // step now equals [action, indexOfBar1, indexOfBar2]
        var answers = [];
        if (this.queue.length >= 4) {
            var a1, a2, a3;
            var iterateStart = 0;
            for (var i = 1; i < this.queue.length; i++) {
                if (typeof this.queue[i][4] !== 'undefined') {
                    a1 = this.queue[i]
                    iterateStart = i+1;
                    i = this.queue.length;
                }
            }
            for (var i = iterateStart; i < this.queue.length; i++) {
                if (typeof this.queue[i][4] !== 'undefined') {
                    a2 = this.queue[i]
                    iterateStart = i+1;
                    i = this.queue.length;
               }
            }
            for (var i = iterateStart; i < this.queue.length; i++) {
                if (typeof this.queue[i][4] !== 'undefined') {
                    a3 = this.queue[i]
                    i = this.queue.length;
                }
            }
            answers = [a1, a2, a3];
        }
        var step = this.queue.shift();
        var bar1 = step[1];
        var bar2 = step[2];

        for (var z = 0; z < this.leaveColouredArray.length; z++) {
            this.colours[this.leaveColouredArray[z]] = SELECT;
        }

        //change bar colours if they are being compared or swapped or any other action
        switch (step[0]) {

            //nothing = 0
            case 0:
                break;

            //compare = 1
            case 1:
                this.colours[bar1] = COMPARE;
                this.colours[bar2] = COMPARE;
                break;

            //swap = 2
            case 2:
                this.colours[bar1] = SWAP;
                this.colours[bar2] = SWAP;
                //update the display array
                var temp = this.animatedArray[bar1];
                this.animatedArray[bar1] = this.animatedArray[bar2];
                this.animatedArray[bar2] = temp;
                for (var i = 0; i < this.leaveColouredArray.length; i++) {
                    if (bar1 == this.leaveColouredArray[i]) {
                        this.leaveColouredArray[i] = bar2;
                    }
                    if (bar2 == this.leaveColouredArray[i]) {
                        this.leaveColouredArray[i] = bar1;
                    }
                }
                break;

            //select one = 3
            case 3:
                this.colours[bar1] = SELECT;
                break;

            //select multiple = 4
            case 4:
                for (var i = 0; i < bar1.length; i++) {
                    this.colours[bar1[i]] = SELECT;
                }
                this.buildUpArray = [];
                break;

            //build up = 5
            case 5:
                this.buildUpArray.push(bar1);
                for (var i = 0; i < this.buildUpArray.length; i++) {
                    this.colours[this.buildUpArray[i]] = SELECT;
                }
                this.colours[bar2] = COMPARE;
                break;

            //select and clear other bars= 6
            case 6:
                this.colours[bar1] = SELECT;
                this.colours[0] = BAR;
                break;

            //clear bars = 7
            case 7:
                for (var i = 0; i < this.colours.length; i++) {
                    this.colours[i] = BAR;
                }
                this.leaveColouredArray = [];
                break;

            //leave coloured compare
            case 8:
                this.colours[bar1] = COMPARE;
                this.colours[bar2] = COMPARE;
                break;

            //leave coloured
            case 9:
                this.leaveColouredArray.push(bar1);
                this.colours[bar1] = SELECT;
                break;
        }

        //set highlighted code
        //var highlightArray = step.slice(3,step.length);
        if (typeof step[3] !== 'undefined' && !slowMode) {
            var codeArray = step[3];
            for (var i = 0; i < codeArray.length; i++) {
                setCodeHighlight("code" + codeArray[i]);
            }
        }

        //set status text shown
        if (typeof step[4] !== "undefined") {
            if (!slowMode) {
                var statusArray = step[4];
                //change text and fill in inner HTML elements
                for (var i =0; i < statusArray.length; i++) {
                    showStatus("status" + statusArray[i]);

                    var bar1Array = document.getElementsByClassName("bar1");
                    for (var j = 0; j < bar1Array.length; j++) {bar1Array[j].innerHTML = bar1;}

                    var bar2Array = document.getElementsByClassName("bar2");
                    for (var j = 0; j < bar2Array.length; j++) {bar2Array[j].innerHTML = bar2;}

                    //var arrayLength = document.getElementsByClassName("arrayLength");
                    //for (var j = 0; j < arrayLength.length; j++) {arrayLength[j].innerHTML = "help";}
                }
            } else {
                showStatus("slowMode");
            }
        }

        //set test
        if (typeof answers !== "undefined") {
            for (var k = 0; k < answers.length; k++) {
                var statusArray = answers[k][4];
                if (typeof statusArray !== "undefined") {
                    for (var i =0; i < statusArray.length; i++) {

                        //clone element to answers
                        var element = document.getElementById("status" + statusArray[i]);
                        var cln = element.cloneNode(true);
                        cln.classList.remove('hide');
                        var answerItem = document.getElementById("answer" + (k+1));
                        answerItem.appendChild(cln);

                        //bar 1
                        var bar1Array = answerItem.getElementsByClassName("bar1");
                        for (var j = 0; j < bar1Array.length; j++) {bar1Array[j].innerHTML = answers[k][1];}

                        //bar 2
                        var bar2Array = answerItem.getElementsByClassName("bar2");
                        for (var j = 0; j < bar2Array.length; j++) {bar2Array[j].innerHTML = answers[k][2];}
                    }
                }
            }
        }


        // draw onto canvas and reset colours
        drawArray(this.canvas, this.animatedArray, this.colours);

        if (step[0] !== 8) {
            if (step[0] == 4) {
                for (var i = 0; i < bar1.length; i++) {
                    this.colours[bar1[i]] = BAR;
                }
            }
            if (this.colours[bar1] != SELECT) {
                this.colours[bar1] = BAR;
            }
            this.colours[bar2] = BAR;
        } else {

        }

}

canvasArray.prototype.clearQueue = function() {
    this.queue = [];
}

canvasArray.prototype.getLength = function() {
    return this.array.length;
}

canvasArray.prototype.clear = function() {
    window.clearInterval(this.animLoop);
}

function setCodeHighlight(id) {
    document.getElementById(id).classList.add("code-highlight");
}

function clearCodeHighlights() {
    var codeLines = document.getElementsByClassName("code");
    for (var i = 0; i < codeLines.length; i++) {
        codeLines[i].classList.remove("code-highlight");
    }
}

function showStatus(id) {
    document.getElementById(id).classList.remove("hide");
}

function hideStatus() {
    var statusLines = document.getElementsByClassName("status");
    for (var i = 0; i < statusLines.length; i++) {
        statusLines[i].classList.add("hide");
    }
}


function bubbleSort(array) {
    var n = array.getLength();
    //while swapped = true
    array.nonEvent([1, 2], [1]);
    for (var i = 0; i < n-1; i++) {
        //set swapped to false and iterate for elemets from 0 to lastUnsortedElement
        array.nonEvent([3, 4], [2]);
        for (var j = 0; j < (n - i - 1); j++) {
            //if left > right
            if(array.compare(j, j+1, [5], [3])) {
                //swap and set swapped to true
                array.swap(j, j+1, [6, 7], [4]);
            }
        }
    }
}


function mergeSort(array, left, right) {
    if (typeof(left) === 'undefined') left = 0;
    if (typeof(right) === 'undefined') {
        right = array.getLength() - 1;
        //split array up into partitions event
        array.nonEvent([1], [1]);
    }
    var half = Math.floor((left+right)/2);
    if (left >= right) {return;}

    // recursion as the array is split into halves
    if (right - left > 1) {
        mergeSort(array, left, half);
        mergeSort(array, half+1, right);
    }

    //merge partitions
    array.nonEvent([2], [2]);

    // next value from left and right halves
    var nl = left;
    var nr = half+1;
    // current order of the array
    var order = [];

    for (var i = left; i <= right; i++) {
        if (nl <= half && nr <= right) {
            if (array.compare(nr, nl, [3,4], [3])) {
                array.buildUp(nl, nr, [3,5], [4]);
                order.push(nl - left);
                nl++;
            } else {
                array.buildUp(nr, nl, [3,6,7], [5]);
                order.push(nr - left);
                nr++;
            }
        // nl or nr will overflow into the other partition if bar2 is not set to -1
        } else if (nl > half) {
            array.buildUp(nr, -1, [3,6,7], [7]);
            order.push(nr++ - left);
        } else if (nr > right) {
            array.buildUp(nl, -1, [3,4,5], [6]);
            order.push(nl++ - left);
        }
    }

    // 2d array of swaps needed for sorting
    var swaplist = [];
    var inplace = [];
    for (var i = 0; i < order.length; i++) {
        inplace.push(false);
    }

    for (var i = 0; i < order.length; i++) {
        var current = i;
        if (inplace[i]) {continue;}
        if (order[i] === i) {
            inplace[i] = true;
        }
        while (!inplace[order[current]]) {
            swaplist.push([current, order[current]]);
            inplace[current] = true;
            current = order[current];
        }
    }

    //push the current partition to queue
    var multi = [];
    for (var i = left; i <= right; i++) {
        multi[i] = i;
    }
    array.selectMultiple(multi, [8, 9], [8]);

    for (var i = 0; i < swaplist.length; i++) {
        array.swap(swaplist[i][0] + left, swaplist[i][1] + left, [10], [9]);
    }

}


function selectionSort(array) {
    //for all elements
    array.nonEvent([1], [1]);
    var n = array.getLength();
    for (var i = 0; i < n; i++) {
    //select first unsorted element
    array.selectOne(i, [2, 3], [2]);
        var min = i;
        for (var j = i + 1; j < n; j++) {
            if(array.compare(min, j, [4], [3])) {
                min = j;
                //set and highlight new minimum element
                array.selectOne(min, [5], [4]);
            }
        }
        if (i !== min) {
            array.swap(i, min, [6], [5]);
        }
    }
    array.clearBars();
}


function insertionSort(array) {
    var n = array.getLength();
    //mark first as sorted
    array.selectOne(0, [1], [1]);
    for (var i = 0; i < n; i++) {
        //for all elements
        if (i !== 0) {
            array.selectOneAndClear(i, [2, 3], [2]);
            array.selectOne(i, [4], [3]);
        }
        for (var j = i; j > 0; j--) {
            if (array.compare(j-1, j, [5], [4])) {
                array.swap(j, j-1, [6], [5]);
            } else {
                array.nonEvent([7, 8], [6]);
                j = 0;
            }
        }
    }
}

function randomInt(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function quickSort(array, left, right) {
    var n = array.getLength();
    if (typeof(left) === 'undefined') left = 0;
    if (typeof(right) === 'undefined') right = n - 1;

    //crossover has been reached
    if (left >= right) {
        return;
    }

    //divide and conquer otherwise
    //var pivotPoint = randomInt(left, right);
    var pivotPoint = array.getMedian(left ,right, Math.round((right+left)/2));
    //select pivot
    array.clearBars();
    array.selectOne(pivotPoint, [1, 2], [1]);

    //move pivot to end
    array.swap(pivotPoint, right, [3], [2]);

    //Partition, less than pivot move to left
    //greater than, move to right
    pivotPoint = left;
    for (var i = left; i < right; i++) {
      if (array.compare(right, i, [4, 5], [3])) {
        array.compare(i, i, [6], [4]);
        if (i != pivotPoint) {
          array.swap(i, pivotPoint, [7], [5]);
        }
        pivotPoint += 1
      } else {
        array.leaveColoured(i, [8, 9], [6]);
      }
    }
    array.swap(right, pivotPoint, [10], [7]);
    quickSort(array, left, pivotPoint - 1);
    quickSort(array, pivotPoint + 1, right);
    array.clearBars();
}


function prepareCanvas(event) {

        if (event.data.array !== null) {
            console.log("clearing previous data...");
            event.data.array.clear();
        }

        // sorting animation does not initialise until start up animation is complete
        // this is necessary to cancel the timer that will start the sorting animation
        if (animation !== null) {
            clearTimeout(animation);
        }

        clearCodeHighlights();
        resetQuiz();

        var size = document.getElementById("formArraySize").value;
        if (size > 500) {
            size = 500;
        }
        var interval = document.getElementById("formInterval").value;
        var values = [];

        //populate array with random numbers for now
        for (var i = 0; i < size; i++) {
            values.push(Math.random()*(1-0.1)+0.1);
        }

        event.data.array = new canvasArray(values, event.data.canvas, interval);

        switch(alg_name) {
            case "Bubble Sort":
                bubbleSort(event.data.array);
                break;
            case "Merge Sort":
                mergeSort(event.data.array);
                break;
            case "Selection Sort":
                selectionSort(event.data.array);
                break;
            case "Insertion Sort":
                insertionSort(event.data.array);
                break;
            case "Quicksort":
                quickSort(event.data.array);
                break;
        }

        // reset pause button
        document.getElementById("pause").innerHTML = "Pause";
}


$(document).ready(function() {

    var initialArray = null;
    // 0 = ?, 1 = compare, 2 = swap
    codeHighlights = [3, (5,6)];
    console.log("[0] = " + codeHighlights[0]);
    console.log("[1] = " + codeHighlights[1]);

    //create canvas and scale to page width
    var initialCanvas = document.getElementById("sort-canvas");
    initialCanvas.width = $("#canvas-container").width();
    var ctx = initialCanvas.getContext("2d");
    ctx.strokeStyle = BAR;
    ctx.moveTo(0,initialCanvas.height);
    ctx.lineTo(initialCanvas.width, initialCanvas.height);
    ctx.stroke();

    $("#start").click({canvas: initialCanvas, array: initialArray}, prepareCanvas);

});