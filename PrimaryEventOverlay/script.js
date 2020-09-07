let eventsLimit = 5,
    userLocale = "en-US",
    includeFollowers = true,
    includeRedemptions = true,
    includeHosts = true,
    minHost = 0,
    includeRaids = true,
    minRaid = 0,
    includeSubs = true,
    includeTips = true,
    minTip = 0,
    includeCheers = true,
    direction = "top",
    textOrder = "nameFirst",
    minCheer = 0;

let userCurrency,
    totalEvents = 0;

window.addEventListener('onEventReceived', function (obj) {
    if (!obj.detail.event) {
      return;
    }
    if (typeof obj.detail.event.itemId !== "undefined") {
        obj.detail.listener = "redemption-latest"
    }
    const listener = obj.detail.listener.split("-")[0];//string array separated by '-' likely goes 'follower-xxxxxxxxx'
    const event = obj.detail.event;//likely an object datatype

    if (listener === 'follower') {
        if (includeFollowers) {
          	onEvent('follower','Follower',event.name,delayTime);
        }
    } else if (listener === 'redemption') {
        if (includeRedemptions) {
          	onEvent('redemption','Redeemed',event.name,delayTime);
        }
    } else if (listener === 'subscriber') {
        if (includeSubs) {
            if (event.amount === 'gift') {
                onEvent('subscriber','Sub gift',event.name,delayTime);
            } else {
              	onEvent('subscriber',`Sub X${event.amount}`,event.name,delayTime);
            }

        }//if
    } else if (listener === 'host') {
        if (includeHosts && minHost <= event.amount) {
          	onEvent('host',`Host ${event.amount.toLocaleString()}`,event.name,delayTime);
        }
    } else if (listener === 'cheer') {
        if (includeCheers && minCheer <= event.amount) {
          	onEvent('cheer',`${event.amount.toLocaleString()} Bits`,event.name,delayTime);
        }
    } else if (listener === 'tip') {
        if (includeTips && minTip <= event.amount) {
            if (event.amount === parseInt(event.amount)) {
              onEvent('tip', event.amount.toLocaleString(userLocale, {
                    style: 'currency',
                    minimumFractionDigits: 0,
                    currency: userCurrency.code
                }), event.name,delayTime);
            } else {
              onEvent('tip', event.amount.toLocaleString(userLocale, {
                    style: 'currency',
                    currency: userCurrency.code
                }), event.name,delayTime);
            }
        }
    } else if (listener === 'raid') {
        if (includeRaids && minRaid <= event.amount) {
           	onEvent('raid', `Raid ${event.amount.toLocaleString()}`, event.name,delayTime);
        }
    }
});

window.addEventListener('onWidgetLoad', function (obj) {//This block initializes fields set by user. Data is collected above first then it is initialized.
    let recents = obj.detail.recents;
    recents.sort(function (a, b) {
        return Date.parse(a.createdAt) - Date.parse(b.createdAt);
    });
    userCurrency = obj.detail.currency;
    const fieldData = obj.detail.fieldData;
    eventsLimit = fieldData.eventsLimit;
    includeFollowers = (fieldData.includeFollowers === "yes");
    includeRedemptions = (fieldData.includeRedemptions === "yes");
    includeHosts = (fieldData.includeHosts === "yes");
    minHost = fieldData.minHost;
    includeRaids = (fieldData.includeRaids === "yes");
    minRaid = fieldData.minRaid;
    includeSubs = (fieldData.includeSubs === "yes");
    includeTips = (fieldData.includeTips === "yes");
    minTip = fieldData.minTip;
    includeCheers = (fieldData.includeCheers === "yes");
    minCheer = fieldData.minCheer;
    direction = fieldData.direction;
    userLocale = fieldData.locale;
    textOrder = fieldData.textOrder;
    fadeoutTime = fieldData.fadeoutTime;
  	delayTime = fieldData.delayTime;

    let eventIndex;//for loop that creates event list items
    for (eventIndex = 0; eventIndex < recents.length; eventIndex++) {
        const event = recents[eventIndex];

        if (event.type === 'follower') {
            if (includeFollowers) {
              	onEvent('follower','Follower',event.name,2);
            }
        } else if (event.type === 'redemption') {
            if (includeRedemptions) {
              	onEvent('redemption','Redeemed',event.name,2);
            }
        } else if (event.type === 'subscriber') {
            if (!includeSubs) continue;
            if (event.amount === 'gift') {
              	onEvent('subscriber','Sub gift',event.name,2);
            } else {
             	onEvent('subscriber',`Sub X${event.amount}`,event.name,2);
            }

        } else if (event.type === 'host') {
            if (includeHosts && minHost <= event.amount) {
              	onEvent('host',`Host ${event.amount.toLocaleString()}`,event.name,2);
            }
        } else if (event.type === 'cheer') {
            if (includeCheers && minCheer <= event.amount) {
              	onEvent('cheer',`${event.amount.toLocaleString()} Bits`,event.name,2);
            }
        } else if (event.type === 'tip') {
            if (includeTips && minTip <= event.amount) {
                if (event.amount === parseInt(event.amount)) {
                    onEvent('tip', event.amount.toLocaleString(userLocale, {
                      style: 'currency',
                      minimumFractionDigits: 0,
                      currency: userCurrency.code
                  	}), event.name,2);
                } else {
                    onEvent('tip', event.amount.toLocaleString(userLocale, {
                        style: 'currency',
                        currency: userCurrency.code
                    }), event.name,2);
                }
            }
        } else if (event.type === 'raid') {
            if (includeRaids && minRaid <= event.amount) {
                onEvent('raid', `Raid ${event.amount.toLocaleString()}`, event.name,2);
            }
        }
    }
});

/**
 * @name		Shuffle Letters
 * @author		Martin Angelov
 * @version 	1.0
 * @url			http://tutorialzine.com/2011/09/shuffle-letters-effect-jquery/
 * @license		MIT License
 */

(function($){

	$.fn.shuffleLetters = function(prop){

		var options = $.extend({
			"step"		: 8,			// How many times should the letters be changed
			"fps"		: 25,			// Frames Per Second
			"text"		: "", 			// Use this text instead of the contents
			"callback"	: function(){}	// Run once the animation is complete
		},prop)

		return this.each(function(){

			var el = $(this),
				str = "";


			// Preventing parallel animations using a flag;

			if(el.data('animated')){
				return true;
			}

			el.data('animated',true);


			if(options.text) {
				str = options.text.split('');
			}
			else {
				str = el.text().split('');
			}

			// The types array holds the type for each character;
			// Letters holds the positions of non-space characters;

			var types = [],
				letters = [];

			// Looping through all the chars of the string

			for(var i=0;i<str.length;i++){

				var ch = str[i];

				if(ch == " "){
					types[i] = "space";
					continue;
				}
				else if(/[a-z]/.test(ch)){
					types[i] = "lowerLetter";
				}
				else if(/[A-Z]/.test(ch)){
					types[i] = "upperLetter";
				}
				else {
					types[i] = "symbol";
				}

				letters.push(i);
			}

			el.html("");

			// Self executing named function expression:

			(function shuffle(start){

				// This code is run options.fps times per second
				// and updates the contents of the page element

				var i,
					len = letters.length,
					strCopy = str.slice(0);	// Fresh copy of the string

				if(start>len){

					// The animation is complete. Updating the
					// flag and triggering the callback;

					el.data('animated',false);
					options.callback(el);
					return;
				}

				// All the work gets done here
				for(i=Math.max(start,0); i < len; i++){

					// The start argument and options.step limit
					// the characters we will be working on at once

					if( i < start+options.step){
						// Generate a random character at this position
						strCopy[letters[i]] = randomChar(types[letters[i]]);
					}
					else {
						strCopy[letters[i]] = "";
					}
				}

				el.text(strCopy.join(""));
      //  consolelog.html(el);

				setTimeout(function(){

				shuffle(start+1);

      },/*1000);*/ 1000/options.fps);

    })(-options.step);


		});
	};

	function randomChar(type){
		var pool = "";

		if (type == "lowerLetter"){
			pool = "abcdefghijklmnopqrstuvwxyz0123456789";
		}
		else if (type == "upperLetter"){
			pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		}
		else if (type == "symbol"){
			pool = ",.?/\\(^)![]{}*&^%$#'\"";
		}

		var arr = pool.split('');
    //consolelog.html(arr[Math.floor(Math.random()*arr.length)]);
		return arr[Math.floor(Math.random()*arr.length)];
	}

})(jQuery);

/**
 * @name		Shuffle Delete
 * @author		Nathan Wisla (modifier)
 * @version 	1.0
 * @url			http://tutorialzine.com/2011/09/shuffle-letters-effect-jquery/
 * @license		MIT License
 */

(function($){

	$.fn.shuffleDelete = function(prop){

		var options = $.extend({
			"step"		: 8,			// How many times should the letters be changed
			"fps"		: 25,			// Frames Per Second
			"text"		: "", 			// Use this text instead of the contents
			"callback"	: function(){}	// Run once the animation is complete
		},prop)

		return this.each(function(){

			var el = $(this),
				str = "";


			// Preventing parallel animations using a flag;

			if(el.data('animated')){
				return true;
			}

			el.data('animated',true);


			if(options.text) {
				str = options.text.split('');
			}
			else {
				str = el.text().split('');
			}

			// The types array holds the type for each character;
			// Letters holds the positions of non-space characters;

			var types = [],
				letters = [];

			// Looping through all the chars of the string

			for(var i=0;i<str.length;i++){

				var ch = str[i];

				if(ch == " "){
					types[i] = "space";
					continue;
				}
				else if(/[a-z]/.test(ch)){
					types[i] = "lowerLetter";
				}
				else if(/[A-Z]/.test(ch)){
					types[i] = "upperLetter";
				}
				else {
					types[i] = "symbol";
				}

				letters.push(i);
			}

			el.html("");

			// Self executing named function expression:

			(function shuffle(start){

				// This code is run options.fps times per second
				// and updates the contents of the page element

				var i,
					len = letters.length,
					strCopy = str.slice(0);	// Fresh copy of the string

				//if(start>len){
        if(start<-options.step){

					// The animation is complete. Updating the
					// flag and triggering the callback;

					el.data('animated',false);
					options.callback(el);
					return;
				}

				// All the work gets done here
				for(i=Math.max(start,0); i < len; i++){

					// The start argument and options.step limit
					// the characters we will be working on at once

					if( i < start+options.step){
						// Generate a random character at thsi position
						strCopy[letters[i]] = randomChar(types[letters[i]]);
            //strCopy[letters[i]] = "";
					}
					else {
						strCopy[letters[i]] = "";
            //consolelog.html(letters[0]);
            //strCopy[letters[i]] = randomChar(types[letters[len-i]]);
					}
				}

				el.text(strCopy.join(""));
      //  consolelog.html(el);

				setTimeout(function(){

				shuffle(start-1);

      },/*1000);*/ 1000/options.fps);

    })(letters.length);//(-options.step);


		});
	};

	function randomChar(type){
		var pool = "";

		if (type == "lowerLetter"){
			pool = "abcdefghijklmnopqrstuvwxyz0123456789";
		}
		else if (type == "upperLetter"){
			pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		}
		else if (type == "symbol"){
			pool = ",.?/\\(^)![]{}*&^%$#'\"";
		}

		var arr = pool.split('');
    //consolelog.html(arr[Math.floor(Math.random()*arr.length)]);
		return arr[Math.floor(Math.random()*arr.length)];
	}

})(jQuery);

let containers = {
        left : $("#follower-container") ,
        right : $("#train-container") ,
        top : $("#header") ,
        bottom : $("#footer")
      } ,
  	eventLib = {
        'default': {color:'#FFFFFF'} ,
        'follower':{color:'#0270D9' , text:'Follower'} ,
        'subscriber':{color:'#C1272D' , text:'Subsciber'} ,
        'tip': {color:'#FF6C00' , text:'Tip'} ,
        'cheer': {color:'#22EB3D' , text:'Cheer'} ,
        'redemption': {color:'#FFFFFF' , text:'Redeemed'} ,
        'host': {color:'#FCED21' , text:'Host'} ,
        'raid': {color:'#BC48D9' , text:'Raid'}
      } ,
	glowStyle = $("#glow");

containers.left.shuffleLetters();
containers.right.shuffleLetters();
containers.top.shuffleLetters();
containers.bottom.shuffleLetters();

function setTransition(color,fillTime,scaleSize,scaleTime) {
  glowStyle.css(
    {
      "fill": color ,
      "transform": `scale(${scaleSize})` ,
      "transition": `fill ${fillTime}s , transform ${scaleTime}s`
    }
  );
}

$(".glow-layer-goose").on('transitionend', function() {
  setTransition(eventLib['default'].color,30,1,5);
});//reset the glowing animation back to normal

function sortEvent(type,text,username,delayTime){
//sort containers on left right top or bottom depending on what event occured
//left gets sorted by follower,host, raid
//right gets sorted by subscriber tipper cheer
//doesn't omit events like cheer
  let leftContainer = ['follower','host','raid']
      rightContainer = ['subscriber','tip','cheer','redemption'];
      color = eventLib['default'].color;

      containers.top.shuffleLetters({"text":eventLib[type].text});
      containers.bottom.shuffleLetters({"text":`${username} • ${text}`});
      color = eventLib[type].color;

  if(leftContainer.includes(type)){
    setTimeout(function (){
      containers.left.shuffleDelete();
      containers.top.shuffleDelete();
      setTimeout(function(){
        containers.bottom.shuffleDelete()
        containers.left.shuffleLetters({"text":`${username} • ${text}`});
      },1500);
    },delayTime*1000);
    return color;
  }

  if (rightContainer.includes(type)) {
    setTimeout(function (){
      containers.right.shuffleDelete();
      containers.top.shuffleDelete()
      setTimeout(function(){
        containers.bottom.shuffleDelete();
        containers.right.shuffleLetters({"text":`${username} • ${text}`});
      },1500);
    },delayTime*1000);
    return color;
  }
}

function onEvent(type, text, username, delayTime) {
  let color;
  color = sortEvent(type,text,username, delayTime);
  setTransition(color,0.5,1.5,0.5);
}
