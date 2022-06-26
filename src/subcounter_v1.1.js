(function() {
var sga = ""; // Stores live counter object
var sgi = "";

/*
    Makes request to YouTube API to retrive current number of designated channel subscribers
    * Suprisingly, this function was never used and request algorithm was used somewhere else in the code
*/
var scRequest = function(cid){
	var scn = String;
	var scr = new XMLHttpRequest();
	scr.open('GET','https://www.googleapis.com/youtube/v3/channels?part=statistics&id='+cid+'&key=AIzaSyBU_oWEIULi3-n96vWKETYCMsldYDAlz2M');
	scr.onload = function(){
		if (this.status == 200) {
			var cda = JSON.parse(this.responseText);
			var ccn = cda.items[0].statistics.subscriberCount;
			scn = ccn;
		}
	};
	scr.send();
	return scn;
};

/*
    Creates object for live counter
*/
var scCreate = function(){
	var sca = document.createElement("div"); // counter
	var scb = document.createElement("ul"); // dial
	var scc = document.createElement("li"); // first digit
	scc.innerHTML = "0"; // Sets initial counter digit
	scb.appendChild(scc); // Puts digit inside dial
	sca.className = "sc_stat-counter"; // Puts dial inside counter
	sca.appendChild(scb);
	return sca;
};

/*
    Updates the digits in the counter dial
*/
var scUpdate = function(el,num){
	var sca = num.toString(); // Converting number to string to use as array for loop-cycle
	var scb = sca.length;
	var scc = el.getElementsByTagName("ul"); // Retreiving the dial
	var scd = scc.length;
	var scr = el.getBoundingClientRect(); // Retreiving the bounding rect object to determine the width and height of object
	var scq = el.childNodes[0].getBoundingClientRect();
	el.style.width = (scq.width*scb).toString()+"px"; // Setting new width of counter
	el.style.height = scr.height.toString()+"px"; // Setting new height of counter
	if(scb>=scd){
		if(scb>scd){ // If new number has more dials with digits than previous then increase the dials
			for(j=0;j<scb-scd;j++){
				var sce = document.createElement("ul");
				var scf = document.createElement("li");
				scf.innerHTML = "0";
				sce.appendChild(scf);
				el.insertBefore(sce,el.childNodes[0]);
			}
		}
		for(i=scb-1;i>-1;i--){
			var scg = scc[i].childNodes[0].innerHTML; // The previous digit
			var sch = sca[i]; // The new digit
            // Setting dial with digits in the right positon
			scc[i].style.width = scq.width.toString()+"px";
			scc[i].style.position = "absolute";
			scc[i].style.left = (scq.width*i).toString()+"px";
			scAnimate(scc[i],scg,sch); // Perform the sliding animation
		}
	}else{
		for(i=scd-1;i>-1;i--){
			if(i<=scb){
				var scl = scc[i].childNodes[0].innerHTML;
				var scm = sca[i];
				scc[i].style.width = scq.width.toString()+"px";
				scc[i].style.position = "absolute";
				scc[i].style.left = (scq.width*i).toString()+"px";
				scAnimate(scc[i],scl,scm);
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
	var sci = el.childNodes[0].getBoundingClientRect(); // Retreiving the bounding rect object to determine the width and height of object
	if(cv1<cv2){ // If previous digit less than new one
		for(k=0;k<cv2-cv1;k++){
            // Creating digits that should be displayed during the animation
			var scj = document.createElement("li");
			scj.innerHTML = Number(cv1)+k+1;
			el.appendChild(scj);
		}
        // The animation procedure
		el.style.top = "0";
		el.classList.add("animate");
		el.style.top = "-"+(sci.height*(cv2-cv1)).toString()+"px";
		scFinalize(el,cv2); // To wrap things up after animation
	}else{
		for(k=0;k<cv1-cv2;k++){
			var sck = document.createElement("li");
			sck.innerHTML = Number(cv1)-k-1;
			el.insertBefore(sck,el.childNodes[0]);
		}
		el.style.top = "-"+(sci.height*(cv1-cv2)).toString()+"px";
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
	var sca = document.getElementsByClassName("channel-header-subscription-button-container")[0]; // Retreiving subscribe button from channel header in old design
	var scb = document.getElementById("watch7-subscription-container"); // Retreiving subscribe button from watch page in old design
	var scl = document.getElementById("subscriber-count"); // Retriving subscribers count in Polymer design
	var sce = scCreate();
	if(scl != null && scl.tagName == "YT-FORMATTED-STRING"){ // If Polymer design
		var scm = scl.innerHTML;
		var scn = " "+scm.split(" ")[scm.split(" ").length-1];
		var sco = window["ytInitialData"].responseContext.serviceTrackingParams[0].params[0].value;
		var scp = document.createTextNode(scn);
		scl.innerHTML = "";
		scl.appendChild(sce);
		scl.appendChild(scp);
		sgi = sco;
		sga = sce;
	}else{
		if(sca != null){ // If on channel page
			var scc = sca.getElementsByClassName("yt-uix-subscription-button")[0];
			var scd = sca.getElementsByClassName("yt-subscription-button-subscriber-count-branded-horizontal")[0];
			var sci = scc.getAttribute("data-channel-external-id");
			scd.innerHTML="";
			scd.appendChild(sce);
			if(scd.classList.contains("yt-uix-tooltip")){scd.classList.remove("yt-uix-tooltip");}
			if(scd.hasAttribute("title")){scd.removeAttribute("title");}
			sgi = sci;
			sga = sce;
		}else if(scb != null){ // If on watch page
			var sck = scb.getElementsByClassName("yt-uix-button-subscription-container")[0];
			var scf = sck.getElementsByClassName("yt-uix-subscription-button")[0];
			var scg = sck.getElementsByClassName("yt-subscription-button-subscriber-count-branded-horizontal")[0];
			var sch = scf.getAttribute("data-channel-external-id");
			scg.innerHTML="";
			scg.appendChild(sce);
			if(scg.hasAttribute("title")){scg.removeAttribute("title");}
			sgi = sch;
			sga = sce;
		}
	}
};

// Adding stylesheet 
var scp = document.createElement("link");
scp.setAttribute("type","text/css");
scp.setAttribute("rel","stylesheet");
scp.setAttribute("href","https://raw.githubusercontent.com/SVGvsevolod/subcounter/main/src/subcounter.css");
document.getElementsByTagName("head")[0].appendChild(scp);
setInterval(function(){
	if(document.getElementsByClassName("sc_stat-counter").length===0){
        // Initiates the counter
		scInit();
	}else{
        // The scRequest function algorithm
		var scr = new XMLHttpRequest();
		scr.open('GET','https://www.googleapis.com/youtube/v3/channels?part=statistics&id='+sgi+'&key=AIzaSyBU_oWEIULi3-n96vWKETYCMsldYDAlz2M');
		scr.onload = function(){
			if (this.status == 200) {
				var cda = JSON.parse(this.responseText);
				var ccn = cda.items[0].statistics.subscriberCount;
				scUpdate(sga,ccn);
			}
		};
		scr.send();
	}
},2000);
})();