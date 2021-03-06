let userLocale = 'en-US',
    userCurrency,
    textOrder = 'nameFirst',
    glowStyle = $('#glow'),
    containers = {
        left : $("#left-container") ,
        right : $("#right-container") ,
        top : $("#header") ,
        bottom : $("#footer"),
      	message : $("#subfooter")
    },
    eventLib = {
        'default': {color:'#FFFFFF'} ,
        'follower': {color:'#0270D9' , text:'Follower'} ,
        'subscriber': {color:'#C1272D' , text:'Subscriber'} ,
        'tip': {color:'#FF6C00' , text:'Tip'} ,
        'cheer': {color:'#22EB3D' , text:'Cheer'} ,
        'redemption': {color:'#FFFFFF' , text:'Redeemed'} ,
        'host': {color:'#FCED21' , text:'Host'} ,
        'raid': {color:'#BC48D9' , text:'Raid'}
    };


let getProperties = async function () {
    let url = 'https://nathanwisla.github.io/RESTfulTwitch/OverlayProperties/',
        response = await fetch(url),
        properties;
    if (response.ok) {
        properties = await response.json();
        return Promise.resolve(properties);

    } else return Promise.reject('could not fetch json');
};

let findProperties = async function (gameTitle) {

    let json = await getProperties();

    for(let game of json.game) {
        if (gameTitle.toUpperCase() === game.name.toUpperCase()) {
            return Promise.resolve(game);

        }
    }
    return Promise.resolve(false)
};


let gameColorOverride = function (props) {
  $(':root').css({
    '--fontFamily':props.font,
    '--fontColor':props.fontColor,   
    '--fontBorderColor':props.fontBorderColor,
    '--fontSize':`${props.fontSize}px`,
    
    '--gooseColor':props.primary,
    '--gooseAnimColor':props.primaryAnim,
    '--defaultGlow':props.defaultGlow
  });
  defaultGlow = props.defaultGlow;
};


/**
 * @name		Shuffle Letters
 * @author		Martin Angelov (modified by Nathan Wisla)
 * @version 	1.0
 * @url			http://tutorialzine.com/2011/09/shuffle-letters-effect-jquery/
 * @license		MIT License
 */

(function($){

    $.fn.shuffleLetters = function(prop){

        var options = $.extend({
            "step"		: 8,			// How many times should the letters be changed
            "fps"		: 25,			// Frames Per Second
            "text"		: '', 			// Use this text instead of the contents
            "callback"	: function(){}	// Run once the animation is complete
        },prop);

        return this.each(function () {
            let el = $(this),
                str = "",
                fwd;
            // Preventing parallel animations using a flag;

            if (el.data('animated')) {
                return true;
            }

            el.data('animated', true);
          
            if (options.text !== '') {
                fwd = true;
                str = options.text.split('');
            } else {
                fwd = false;
                str = el.text().split('');
            }

            // The types array holds the type for each character;
            // Letters holds the positions of non-space characters;

            var types = [],
                letters = [];

            // Looping through all the chars of the string

            for (var i = 0; i < str.length; i++) {

                var ch = str[i];

                if (ch == " ") {
                    types[i] = "space";
                    continue;
                } else if (/[a-z]/.test(ch)) {
                    types[i] = "lowerLetter";
                } else if (/[A-Z]/.test(ch)) {
                    types[i] = "upperLetter";
                } else {
                    types[i] = "symbol";
                }

                letters.push(i);
            }

            el.html("");

            // Self executing named function expression:
            if (fwd) {
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

                    setTimeout(function(){

                        shuffle(start+1);

                    },/*1000);*/ 1000/options.fps);

                })(-options.step);

            } else {
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
                          // Generate a random character at this position
                          strCopy[letters[i]] = randomChar(types[letters[i]]);
                        }
                        else {
                          strCopy[letters[i]] = "";

                        }
                      }

                      el.text(strCopy.join(""));

                      setTimeout(function(){

                        shuffle(start-1);

                    },1000/options.fps);

                })(letters.length);
            }
        });
    }

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
        return arr[Math.floor(Math.random()*arr.length)];
    }

})(jQuery);


onEvent = function ({type, text, username, delayTime, message, redemptionType, cheerAmount}) { //cheerAmount will be passed as an arg (if it exists)
  let color;

  color = sortEvent(type, text, username, delayTime, message, redemptionType, cheerAmount);
  setTransition(color,0.5,1.5,0.5);
}


setTransition = function (color,fillTime,scaleSize,scaleTime) {
  glowStyle.css(
    {
      "fill": color ,
      "transform": `scale(${scaleSize})` ,
      "transition": `fill ${fillTime}s , transform ${scaleTime}s`
    }
  );
}


sortEvent = function (type, text, username, delayTime, message, redemptionType, cheerAmount) {
//sort containers on left right top or bottom depending on what event occured
//left gets sorted by follower,host, raid
//right gets sorted by subscriber tipper cheer

    let leftContainer = ['follower','host','raid'], //add cheer as a threshold under 50 bits, redemption as "effect"
        rightContainer = ['subscriber','tip','cheer','redemption'], //add cheer as threshold over 50 bits, other redemptions
    	color = eventLib.default.color,
        msg = $(containers.message),
        lCheck = leftContainer.includes(type) || 
        					rightContainer.includes(type) && cheerAmount < 50 || 
        					rightContainer.includes(type) && redemptionType === 'effect',
        unworthyEvents = rightContainer.includes(type) && redemptionType === 'effect';
	
	if (!unworthyEvents) containers.top.shuffleLetters({"text":eventLib[type].text});

    containers.bottom.shuffleLetters({"text":`${username} • ${text}`});
	msg.html(message);
  	msg.fadeIn();

    color = eventLib[type].color;
	

      let lr = lCheck ? 'left' : 'right';

      setTimeout(function (){

          if (!unworthyEvents) containers[lr].shuffleLetters();
        
          containers.top.shuffleLetters();
        
          setTimeout(function () {
              containers.bottom.shuffleLetters();
              msg.fadeOut(1000,'swing',()=>msg.html(''));

              if(!unworthyEvents) containers[lr].shuffleLetters({"text":`${username} • ${text}`});
              
          },1500);
      },delayTime*1000);
    
    return color;
    
}


TwitchEventListener = function (event, listener, delayTime) {
    let
        eventParams = {
            type: listener,
            text: undefined,
            username: event.name,
            delayTime: delayTime,
            message: listener !== 'cheer' ? event.message : undefined,
            redemptionType: undefined,
            cheerAmount: undefined
        };

    if (listener === 'follower') {
        eventParams.text = 'Follower';
      
    } else if (listener === 'redemption') {
      	eventParams.redemptionType = event.type;
        eventParams.text = `${event.item}`;        
      
    } else if (listener === 'subscriber') {
        if (event.amount === 'gift') {
            eventParams.text = 'Sub gift';

        } else if (event.amount === undefined) {//group 'amount' conditions first
            eventParams.text = 'Resub';

        } else if (event.subExtension) {
            eventParams.text = `x${event.amount} Extension`;

        } else if(event.bulkGifted || (!event.isCommunityGift && event.gifted)) {
            eventParams.text = `Sub x${event.amount} Gifts`;
            eventParams.username = event.sender;

        } else if (!event.isCommunityGift) { //do not update on people who were gifted subscriptions
            eventParams.text = `Sub x${event.amount}`;
        }  //No else statement because that will cover bulk gifts and make a long loop

    } else if (listener === 'cheer') {
        eventParams.text = `x${event.amount.toLocaleString()} Bits`;
        eventParams.cheerAmount = event.amount;

    } else if (listener === 'tip') {
        if (event.amount === parseInt(event.amount)) {
            eventParams.text = event.amount.toLocaleString(userLocale, {
                style: 'currency',
                minimumFractionDigits: 0,
                currency: userCurrency.code
            });

        } else {
            eventParams.text = event.amount.toLocaleString(userLocale, {
                style: 'currency',
                currency: userCurrency.code
            });
        }

    } else if (listener === 'raid') {
        eventParams.text = `Raid ${event.amount.toLocaleString()}`;
      
    } //else if (listener === 'host') {
    	//eventParams.text = `Host ${event.amount.toLocaleString()}`;          
    //}
  
	if (!event.isCommunityGift && eventParams.text){
    	onEvent(eventParams)
	}
}


$(".glow-layer-goose").on('transitionend', function() {
  setTransition(eventLib.default.color,30,1,5);
});//reset the glowing animation back to normal


$(this).on('onEventReceived', function (obj) { //Event Listener on received event
    if (!obj.detail.event) {
      return;
    }
    if (typeof obj.detail.event.itemId !== "undefined") {
        obj.detail.listener = "redemption-latest"
    }
    let listener = obj.detail.listener.split('-')[0], //string array separated by '-' goes 'follower-xxxxxxxxx'
        event = obj.detail.event;//an object datatype

 	TwitchEventListener(event, listener, delayTime);
});


$(this).on('onWidgetLoad', async function (obj) {//This block initializes fields set by user. Data is collected above first then it is initialized.
    let data = obj.detail.session.data;

  	let recents = obj.detail.recents;
    recents.sort(function (a, b) {
        return - (Date.parse(a.createdAt) - Date.parse(b.createdAt));
    });
  
  	//Do not declare with var or let, these are global object variables
    userCurrency = obj.detail.currency;
    fieldData = obj.detail.fieldData;
    defaultGlow = fieldData.defaultGlow;
  
    let gameProps = await findProperties(fieldData.gameName);
  
  	if (gameProps){
      gameColorOverride(gameProps);
    }
  	

   	userLocale = fieldData.locale;
    delayTime = fieldData.delayTime;

    eventLib.default.color = defaultGlow;
  
    for (let eventIndex = 0; eventIndex < recents.length; eventIndex++) {
      let event = recents[eventIndex],
          listener = event.type;

      TwitchEventListener(event,listener,2);
    }
});
