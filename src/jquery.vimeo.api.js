;(function($, window) {

    var vimeoJqueryAPI = {

        //catches return messages when methods like getVolume are called. 
        //counter is if multiple calls are made before one returns.
        catchMethods : {methodreturn:[], count:0},

        //This kicks things off on window message event
        init : function(d){

            var vimeoVideo,
                vimeoAPIurl,
                data;

            //is this window message from vimeo?
            if(!d.originalEvent.origin.match(/vimeo/g))
                return;

            //make sure data was sent
            if(!("data" in d.originalEvent))
                return;

            //store data as JSON object
            data = $.type(d.originalEvent.data) === "string" ? $.parseJSON(d.originalEvent.data) : d.originalEvent.data;

            //make sure data is not blank
            if(!data)
                return;

            //get the id of this vimeo video, hopefully they set it. If not, use first one we find
            vimeoVideo   = this.setPlayerID(data);
            vimeoAPIurl  = this.setVimeoAPIurl(vimeoVideo);

            //If this is an event message, like ready or paused
            if(data.hasOwnProperty("event"))
                this.handleEvent(data, vimeoVideo, vimeoAPIurl);

            //IF this is a return event message, like getVolume or getCurrentTime
            if(data.hasOwnProperty("method"))
                this.handleMethod(data, vimeoVideo, vimeoAPIurl);

        },

        setPlayerID : function(d){

            //if they set an player_id as a query string in the URL
            if(d.hasOwnProperty("player_id")){
                if($("#" + d.player_id).length){
                    return $("#" + d.player_id);
                } else {
                    return $("iframe[src*=" + d.player_id + "]");
                }
            } else {

                //No player_id. Use the first Vimeo video on the page, and hope they don't have multiples
                return $("iframe[src*='vimeo']").eq(0);
            }

        },

        setVimeoAPIurl : function(d){

            //prepend vimeo url with proper protocol
            if(d.attr('src').substr(0, 4) !== 'http'){
                return window.location.protocol !== 'https:' ? 'http:'+d.attr('src').split('?')[0] : 'https:'+d.attr('src').split('?')[0];
            } else {
                return d.attr('src').split('?')[0];
            }
        },

        handleMethod : function(d, vid, api){

            //If the message is returned from a method call, store it for later.
            this.catchMethods.methodreturn.push(d.value);

        },

        handleEvent : function(d, vid, api){
            switch (d.event.toLowerCase()) {
                case 'ready':

                    //Go through all events attached to this element, and set an event listener
                    for(var prop in $._data(vid[0], "events")){
                        if(prop.match(/loadProgress|playProgress|play|pause|finish|seek|cuechange/)){
                            vid[0].contentWindow.postMessage(JSON.stringify({method: 'addEventListener', value: prop}), api);
                        }
                    }

                    //if methods are sent before video is ready, call them now
                    if(vid.data("vimeoAPICall")){
                        var vdata = vid.data("vimeoAPICall");
                        for(var i=0; i< vdata.length; i++){
                            vid[0].contentWindow.postMessage(JSON.stringify(vdata[i].message), vdata[i].api);
                        }
                        vid.removeData("vimeoAPICall");
                    }

                    //this video is ready
                    vid.data("vimeoReady", true);
                    vid.triggerHandler("ready");

                    break;

                case 'seek':
                    vid.triggerHandler("seek", [d.data]);
                    break;

                case 'loadprogress':
                    vid.triggerHandler("loadProgress", [d.data]);
                    break;

                case 'playprogress':
                    vid.triggerHandler("playProgress", [d.data]);
                    break;

                case 'pause':
                    vid.triggerHandler("pause");
                    break;

                case 'finish':
                    vid.triggerHandler("finish");
                    break;

                case 'play':
                    vid.triggerHandler("play");
                    break;

                case 'cuechange':
                    vid.triggerHandler("cuechange");
                    break;
            }
        }
    };

    $(window).on("message", function(e){ vimeoJqueryAPI.init(e); });


    /**
     *  Vimeo jQuery method plugin
     *
     * @param element {jQuery Object} The element this was called on (verifies it's an iframe)
     * @param option1 {string} The method to send to vimeo.
     * @param option2 {string|function} If a string, it's the value (i.e. setVolume 2) otherwise, it's a callback function
     */
    $.vimeo = function(element, option1, option2) {

        var message = {},
            catchMethodLength = vimeoJqueryAPI.catchMethods.methodreturn.length;

        if(typeof option1 === "string")  
            message.method = option1;

        if(typeof option2 !== undefined && typeof option2 !== "function") 
            message.value  = option2;

        //call method, but check if video was ready, otherwise cue it up with jQuery data to be called when video is ready
        if(element.prop("tagName").toLowerCase() === 'iframe' && message.hasOwnProperty("method")){
            if(element.data("vimeoReady")){
                element[0].contentWindow.postMessage(JSON.stringify(message), vimeoJqueryAPI.setVimeoAPIurl(element));
            } else {
                var _data = element.data("vimeoAPICall") ? element.data("vimeoAPICall") : [];
                _data.push({message:message, api:vimeoJqueryAPI.setVimeoAPIurl(element)});
                element.data("vimeoAPICall", _data);
            }
        }

        //If this method will return data, (starts with "get") then use callback once return message comes through
        if((option1.toString().substr(0, 3) === "get" || option1.toString() === "paused") && typeof option2 === "function"){
            (function(cml, func, i){
                var interval = window.setInterval(function(){

                    if(vimeoJqueryAPI.catchMethods.methodreturn.length != cml){
                        window.clearInterval(interval);
                        func(vimeoJqueryAPI.catchMethods.methodreturn[i]);
                    }
                }, 10);
            })(catchMethodLength, option2, vimeoJqueryAPI.catchMethods.count);
            vimeoJqueryAPI.catchMethods.count++;
        } 
        return element;
    };

    $.fn.vimeo = function(option1, option2) {
            return $.vimeo(this, option1, option2);
    };

})(jQuery, window);