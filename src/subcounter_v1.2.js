(function() {
var scc = scCreate(); // Stores live counter object
var scid; // Was meant to store YouTube channel ID
var scn; // Stores subscribers number
var scoa = document.getElementsByClassName("channel-header-subscription-button-container")[0]; // Retreiving subscribe button from channel header in old design
var scob = document.getElementById("watch7-subscription-container"); // Retreiving subscribe button from watch page in old design
var scoc = document.getElementById("subscriber-count"); // Retriving subscribers count in Polymer design
var scr = new XMLHttpRequest(); // Stores XMLHttpRequest object
var scs = false; // Stylesheet availability indicator

/*
    Creates object for live counter
*/
var scCreate = function(){
	var a = document.createElement("div"); // counter
	var b = document.createElement("ul"); // dial
	var c = document.createElement("li"); // first digit
	c.innerHTML = "0"; // Sets initial counter digit
	b.appendChild(c); // Puts digit inside dial
	a.className = "sc_stat-counter"; // Puts dial inside counter
	a.appendChild(b);
	return a;
};

/*
    Makes request to YouTube API to retrive current number of designated channel subscribers
*/
scRequest = function(){
	scr.open('GET','https://www.googleapis.com/youtube/v3/channels?part=statistics&id='+scid+'&key=AIzaSyBU_oWEIULi3-n96vWKETYCMsldYDAlz2M');
	scr.onload = function(){
		if(this.status == 200){
			var a = JSON.parse(this.responseText);
			var b = cda.items[0].statistics.subscriberCount;
			scn = b;
		}
	};
	scr.send();
};

/*
    Updates the digits in the counter dial
*/
var scUpdate = function(el,num){
	var a = num.toString(); // Converting number to string to use as array for loop-cycle
	var b = a.length;
	var c = el.getElementsByTagName("ul"); // Retreiving the dial
	var d = c.length;
	var r = el.getBoundingClientRect(); // Retreiving the bounding rect object to determine the width and height of object
	var q = el.childNodes[0].getBoundingClientRect();
	el.style.width = (q.width*b).toString()+"px"; // Setting new width of counter
	el.style.height = r.height.toString()+"px"; // Setting new height of counter
	if(b>=d){
		if(b>d){ // If new number has more dials with digits than previous then increase the dials
			for(j=0;j<b-d;j++){
				var e = document.createElement("ul");
				var f = document.createElement("li");
				f.innerHTML = "0";
				e.appendChild(f);
				el.insertBefore(e,el.childNodes[0]);
			}
		}
		for(i=b-1;i>-1;i--){
			var g = c[i].childNodes[0].innerHTML; // The previous digit
			var h = a[i]; // The new digit
            // Setting dial with digits in the right positon
			c[i].style.width = q.width.toString()+"px";
			c[i].style.position = "absolute";
			c[i].style.left = (q.width*i).toString()+"px";
			scAnimate(c[i],g,h); // Perform the sliding animation
		}
	}else{
		for(i=d-1;i>-1;i--){
			if(i<=b){
				var l = c[i].childNodes[0].innerHTML;
				var m = a[i];
				c[i].style.width = q.width.toString()+"px";
				c[i].style.position = "absolute";
				c[i].style.left = (q.width*i).toString()+"px";
				scAnimate(c[i],l,m);
			}else{ // Otherwise decrease unnecessary dials
				el.removeChild(el.childNodes[i]);
			}
		}
	}
};

/*
    Performs the sliding animation of digits
*/
var scAnimate = function(el,cv1,cv2){
	var x = el.childNodes[0].getBoundingClientRect(); // Retreiving the bounding rect object to determine the width and height of object
	if(cv1<cv2){ // If previous digit less than new one
		for(k=0;k<cv2-cv1;k++){
            // Creating digits that should be displayed during the animation
			var y = document.createElement("li");
			y.innerHTML = Number(cv1)+k+1;
			el.appendChild(y);
		}
        // The animation procedure
		el.style.top = "0";
		el.classList.add("animate");
		el.style.top = "-"+(x.height*(cv2-cv1)).toString()+"px";
		scFinalize(el,cv2); // To wrap things up after animation
	}else{
		for(k=0;k<cv1-cv2;k++){
			var z = document.createElement("li");
			z.innerHTML = Number(cv1)-k-1;
			el.insertBefore(z,el.childNodes[0]);
		}
		el.style.top = "-"+(x.height*(cv1-cv2)).toString()+"px";
		var delay = function(){
			setTimeout(function(){
				el.classList.add("animate");
				el.style.top = "0";
			},5);
		};
		delay();
		scFinalize(el,cv2);
	}
};

/*
    Wraps things up after sliding animation
*/
var scFinalize = function(el,cnf){
	setTimeout(function(){
		el.innerHTML = "<li>"+cnf+"</li>";
		el.classList.remove("animate");
		el.style.top = "0";
	},550);
};

/*
    Initiates the counter and puts where it should be
*/
var scInit = function(){
	if(scs==false){ // If stylesheet is not loaded
		var s = document.createElement("link");
		s.setAttribute("type","text/css");
		s.setAttribute("href","https://raw.githubusercontent.com/SVGvsevolod/subcounter/main/src/subcounter.css");
		document.getElementsByTagName("head")[0].appendChild(s);
		scs = true;
	}
	scUpdate(scc,0);
	if(window.Polymer!=undefined && scoc!=null){ // If Polymer design
		var a = scoc.innerHTML;
		var b = " "+a.split(" ")[a.split(" ").length-1];
		var c = document.createTextNode(b);
		scoc.innerHTML = "";
		scoc.appendChild(scc);
		scoc.appendChild(c);
	}else{
		if(scoa!=null){
			var a = scoa.getElementsByClassName("yt-subscription-button-subscriber-count-branded-horizontal")[0];
			a.innerHTML = "";
			a.appendChild(scc);
			if(a.classList.contains("yt-uix-tooltip")){a.classList.remove("yt-uix-tooltip");}
			if(a.hasAttribute("title")){a.removeAttribute("title");}
		}else if(scob!=null){
			var a = scob.getElementsByClassName("yt-uix-button-subscription-container")[0];
			var b = a.getElementsByClassName("yt-subscription-button-subscriber-count-branded-horizontal")[0];
			b.innerHTML = "";
			b.appendChild(scc);
			if(b.hasAttribute("title")){b.removeAttribute("title");}
		}
	}
	scRequest();
	scUpdate(scc,scn);
}

setInterval(function(){
	var cid;
	if(window.Polymer!=undefined && scoc!=null){
		cid = window["ytInitialData"].responseContext.serviceTrackingParams[0].params[0].value;
	}else{
		if(scoa!=null){ // If on channel page
			var a = scoa.getElementsByClassName("yt-uix-subscription-button")[0];
			var b = a.getAttribute("data-channel-external-id");
			cid = b;
		}else if(scob!=null){ // If on watch page
			var a = scob.getElementsByClassName("yt-uix-button-subscription-container")[0];
			var b = a.getElementsByClassName("yt-uix-subscription-button")[0];
			var c = b.getAttribute("data-channel-external-id");
			cid = c;
		}
	}
	if(scid!=cid){
		scid = cid;
		scInit();
	}else{
		scRequest();
		scUpdate(scc,scn);
	}
},2000);

})();