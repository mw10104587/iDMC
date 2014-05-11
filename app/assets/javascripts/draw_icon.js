var ongoingTouches = new Array;
var spotSize = {'x': 20, 'y': 20};
function init() {
	var el = document.getElementsByTagName("canvas")[0];
	var ctx = el.getContext("2d");
	var offset = findPos(el);  
    // $("#canvas").height($("#canvas").width());

    ctx.rect(0,0,600,600);
	ctx.fillStyle="black";
	ctx.fill();

	for (var i = 0; i < el.width/spotSize.x; i++) {
		for (var j = 0; j < el.height/spotSize.y; j++) {
       		var slotX = spotSize.x / 2 + spotSize.x * i;
       		var slotY = spotSize.y / 2 + spotSize.y * j;
            
		    var color = "#999999";
		    ctx.beginPath();
			ctx.arc(slotX, slotY, parseFloat(spotSize.x / 2) * 0.8, 0, 2 * Math.PI, false); // a circle at the start
		    ctx.fillStyle = color;
		    ctx.fill();
		}
 	}
 	window.startup();
}
function startup() {
  var el =document.body;
  el.addEventListener("touchstart", handleStart, false);
  el.addEventListener("touchend", handleEnd, false);
  el.addEventListener("touchcancel", handleCancel, false);
  el.addEventListener("touchleave", handleEnd, false);
  el.addEventListener("touchmove", handleMove, false);
  console.log("initialized.");
}

function handleStart(evt) {
	//  console.log("touchstart.");
	var el = document.getElementsByTagName("canvas")[0];
	var ctx = el.getContext("2d");
	var touches = evt.changedTouches;
	var offset = findPos(el);  
    
	for (var i = 0; i < touches.length; i++) {
		if(touches[i].clientX-offset.x >0 && 
	       touches[i].clientX-offset.x < parseFloat(el.width) && 
	       touches[i].clientY-offset.y >0 && 
	       touches[i].clientY-offset.y < parseFloat(el.height)) {
	       		var slotX = spotSize.x / 2 + spotSize.x * Math.floor((touches[i].clientX-offset.x)/spotSize.x);
	       		var slotY = spotSize.y / 2 + spotSize.y * Math.floor((touches[i].clientY-offset.y)/spotSize.y);
	            evt.preventDefault();
			    console.log("touchstart:" + i + "...");
			    ongoingTouches.push(copyTouch(touches[i]));
			    var color = colorForTouch(touches[i]);
			    ctx.beginPath();
				ctx.arc(slotX, slotY, parseFloat(spotSize.x / 2) * 0.8, 0, 2 * Math.PI, false); // a circle at the start
			    ctx.fillStyle = color;
			    ctx.fill();
			    console.log("touchstart:" + i + ".");
	  	}
 	}
}
function handleMove(evt) {

	var el = document.getElementsByTagName("canvas")[0];
	var ctx = el.getContext("2d");
	var touches = evt.changedTouches;
	var offset = findPos(el);

	for (var i = 0; i < touches.length; i++) {
        if(touches[i].clientX-offset.x >0 && 
           touches[i].clientX-offset.x < parseFloat(el.width) && 
           touches[i].clientY-offset.y >0 && 
           touches[i].clientY-offset.y < parseFloat(el.height)) {
            evt.preventDefault();
    		var color = colorForTouch(touches[i]);
    		var idx = ongoingTouchIndexById(touches[i].identifier);
			var slotX = spotSize.x / 2 + spotSize.x * Math.floor((touches[i].clientX-offset.x)/spotSize.x);
       		var slotY = spotSize.y / 2 + spotSize.y * Math.floor((touches[i].clientY-offset.y)/spotSize.y);

		    if (idx >= 0) {
				console.log("continuing touch " + idx);
				ctx.beginPath();
				console.log("ctx.moveTo(" + ongoingTouches[idx].clientX + ", " + ongoingTouches[idx].clientY + ");");
				// ctx.moveTo(ongoingTouches[idx].clientX-offset.x, ongoingTouches[idx].clientY-offset.y);
				ctx.arc(slotX, slotY, parseFloat(spotSize.x / 2) * 0.8, 0, 2 * Math.PI, false); // a circle at the start
			    ctx.fillStyle = color;
			    ctx.fill();
				// console.log("ctx.lineTo(" + touches[i].clientX + ", " + touches[i].clientY + ");");
				// ctx.lineTo(touches[i].clientX-offset.x, touches[i].clientY-offset.y);
				// ctx.lineWidth = 4;
				// ctx.strokeStyle = color;
				// ctx.stroke();

				ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
				console.log(".");
		    } 
		    else {
		    	console.log("can't figure out which touch to continue");
		    }
  		}
    }
}
function handleEnd(evt) {

//  console.log("touchend/touchleave.");
	var el = document.getElementsByTagName("canvas")[0];
	var ctx = el.getContext("2d");
	var touches = evt.changedTouches;
	var offset = findPos(el);
        
	for (var i = 0; i < touches.length; i++) {
		if(	touches[i].clientX-offset.x >0 && 
			touches[i].clientX-offset.x < parseFloat(el.width) && 
			touches[i].clientY-offset.y >0 && 
			touches[i].clientY-offset.y < parseFloat(el.height)){
            evt.preventDefault();
		    var color = colorForTouch(touches[i]);
		    var idx = ongoingTouchIndexById(touches[i].identifier);
			var slotX = spotSize.x / 2 + spotSize.x * Math.floor((touches[i].clientX-offset.x)/spotSize.x);
       		var slotY = spotSize.y / 2 + spotSize.y * Math.floor((touches[i].clientY-offset.y)/spotSize.y);
        
		    if (idx >= 0) {
				ctx.lineWidth = 4;
				ctx.fillStyle = color;
				ctx.beginPath();

				ctx.arc(slotX, slotY, parseFloat(spotSize.x / 2) * 0.8, 0, 2 * Math.PI, false); // a circle at the start
			    ctx.fillStyle = color;
			    ctx.fill();
				// ctx.moveTo(ongoingTouches[idx].clientX-offset.x, ongoingTouches[idx].clientY-offset.y);
				// ctx.lineTo(touches[i].clientX-offset.x, touches[i].clientY-offset.y);
				// ctx.fillRect(touches[i].clientX - 4-offset.x, touches[i].clientY - 4-offset.y, 8, 8); // and a square at the end
				ongoingTouches.splice(i, 1); // remove it; we're done
		    } 
		    else {
		    	console.log("can't figure out which touch to end");
		    }
  		}
    }
}
function handleCancel(evt) {
  evt.preventDefault();
  console.log("touchcancel.");
  var touches = evt.changedTouches;
  
  for (var i = 0; i < touches.length; i++) {
    ongoingTouches.splice(i, 1); // remove it; we're done
  }
}
function colorForTouch(touch) { 
  var r = touch.identifier % 16;
  var g = Math.floor(touch.identifier / 3) % 16;
  var b = Math.floor(touch.identifier / 7) % 16;
  r = r.toString(16); // make it a hex digit
  g = g.toString(16); // make it a hex digit
  b = b.toString(16); // make it a hex digit
  var color = "#" + r + g + b;
  console.log("color for touch with identifier " + touch.identifier + " = " + color);
  return "#00ff00";
}
function copyTouch(touch) {
  return {identifier: touch.identifier,clientX: touch.clientX,clientY: touch.clientY};
}
function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;
    
    if (id == idToFind) {
      return i;
    }
  }
  return -1; // not found
}
 
function findPos (obj) {
    var curleft = 0,
        curtop = 0;

    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);

        return { x: curleft-document.body.scrollLeft, y: curtop-document.body.scrollTop };
    }
}