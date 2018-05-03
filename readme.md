Simple Vimeo API jQuery Plugin
================

NOTE: Vimeo published a much improved JavaScript API similar to this one. It's advisable to use the official one instead: [https://github.com/vimeo/player.js](https://github.com/vimeo/player.js)
===============

An easy way to control Vimeo videos using standard jQuery event structure and methods.


Download
========

You can check out the entire repo, or download the latest release below (production files are in the dist folder):

[jQuery Vimeo API v0.10.3 (zip)](https://github.com/jrue/Vimeo-jQuery-API/archive/v0.10.3.zip)<br>
[jQuery Vimeo API v0.10.3 (tar.gz)](https://github.com/jrue/Vimeo-jQuery-API/archive/v0.10.3.tar.gz)

You can also link directly to the file using MaxCDN.

```html
<script src="https://cdn.rawgit.com/jrue/Vimeo-jQuery-API/master/dist/jquery.vimeo.api.min.js" integrity="sha384-5HEFbHMdJ1B0NgJ2dK6/jCaTT4DoL3ucsGIIRSyYEAm8KvHrOm6zpb95OCifXv0m" crossorigin="anonymous"></script>
```

Setup
========
Make sure to include this plugin's .js file *after* jQuery library. Use the minified version in dist folder for best performance.

This plugin works with iframe Vimeo embeds only. You can target the iframe using any normal jQuery CSS conventions, but often it's easier to put an id attribute on the iframe to target it specifically.

```html
<script src="//code.jquery.com/jquery-latest.min.js"></script>
<script src="dist/jquery.vimeo.api.min.js"></script>

<!-- Vimeo embed code with custom id attribute added -->
<iframe id="myvideo" src="//player.vimeo.com/video/77889659" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

<script>
//use jquery document ready function
$(document).ready(function($) {

    $("#myvideo").vimeo("play");

});
</script>
```

Multiple videos
========
For multiple videos, it is recommended to include a query string to the end of the URL of your video with the variables `api=1`, and `player_id=[unique_name]` for each video, like so:

<pre>&lt;iframe src="//player.vimeo.com/video/00000?<strong>&amp;api=1&amp;player_id=vid1</strong>" ... &lt;/iframe&gt;</pre>

Because of a peculiarity with the way Vimeo sends messages, it's impossible to tell which API messages we receive from Vimeo belong to any specific video on the page. The solution for this is to identify each video by appending a special query string identifier to each video's URL.

For convenience (and for CMS plugins) this plugin is designed to work without doing this; it will automatically append generic ids to the query strings of the Vimeo embeds on the page. But in doing so, there will be a brief reloading of the video at page load when it changes the src attribute. In order to prevent this, you should manually add your own.

Dynamically Loading Videos
========
When dynamically loading videos after page load, this plugin won't capture them in the event chain. You will have to manually call a special method I added called `.vimeoLoad()` after appending your iframe, so it will be processed by the plugin.

```javascript
$("<iframe />")
    .attr("id", "myiframe")
    .attr("src", "https://player.vimeo.com/video/128947850")
    .appendTo("body")
    .vimeoLoad() //call this function after appending your iframe
    .vimeo("play");
```

Again, **vimeoLoad()** is only required when dynamically adding videos after the fact. This is experimental, and worked in all my test. Please let me know if you have issues in the issue tracker.

Mobile
========
Due to an apparent restriction on iOS, you cannot initiate videos with this API (specifically the play method). However, the events do work and you can trigger other elements on the page during playProgress or finish events.


API Methods
========
For methods, you can call API immediately with one argument as a string. For methods which take additional information 

```javascript
$("#myvideo").vimeo("play");
$("#myvideo").vimeo("seekTo", 5); //seeks to five seconds
```

play
----
```javascript
$("#myvideo").vimeo("play");
```

Plays videos as soon as this is called. Note for time sensitive presentations: this will wait until the video is ready and receives a ready message from Vimeo, so there might be a slight delay if playing right when the page loads. (Due to a restriction in the way Vimeo works, it's not possible to initiate videos on mobile using anything other than the built-in play button.)

pause
----
```javascript
$("#myvideo").vimeo("pause");
```

Will pause video at it's current location. (Not able to work on mobile)

unload
----
```javascript
$("#myvideo").vimeo("unload");
```

Equivalent to stop or rewind, as it reverts player back to original state.

setVolume
----
```javascript
$("#myvideo").vimeo("setVolume", 0.5);
```

Sets the volume of the video as a percentage from 0 to 1.

setLoop
----
```javascript
$("#myvideo").vimeo("setLoop", true);
```

Set looping to boolean value.

seekTo
----
```javascript
$("#myvideo").vimeo("seekTo", 5);
```

Seeks to specified number of seconds. (Does not work on mobile)

setColor
----
```javascript
$("#myvideo").vimeo("setColor", "#333333");
```

Sets color of player to hex value as a string.

Return Calls
=====
These are methods which return information about video. Because we need to contact Vimeo for information about the status of the video, the second argument needs to be a callback function. This also means, these calls will be asynchronous, and there might be a small delay.

paused
----
```javascript
$("#myvideo").vimeo("paused", function(data){  
    console.log( "Is paused?", data ); 
})
```
Returns boolean showing whether video is paused.

getCurrentTime
----
```javascript
$("#myvideo").vimeo("getCurrentTime", function(data){
	console.log( "Current time", data ); 
})
```
Returns current play time as seconds. This is a one time return. For continuous updates, use playProgress event.

getDuration
----
```javascript
$("#myvideo").vimeo("getDuration", function(data){
	console.log( "Video length", data ); 
})
```
Return total duration of video in seconds.

getVolume
----
```javascript
$("#myvideo").vimeo("getVolume", function(data){
	console.log( "Volume is", data ); 
})
```
Return volume in seconds

getVideoHeight or getVideoWidth
----
```javascript
$("#myvideo").vimeo("getVideoHeight", function(data){
	console.log( "Height", data ); 
})
$("#myvideo").vimeo("getVideoWidth", function(data){
	console.log( "Width", data ); 
})
```
Height or width as number.

getVideoUrl
----
```javascript
$("#myvideo").vimeo("getVideoUrl", function(data){
	console.log( "Video URL", data ); 
})
```
Get the url to the video itself as a string. (not the Vimeo page, but the actual video embed)

getColor
----
```javascript
$("#myvideo").vimeo("getColor", function(data){
	console.log( "Player color", data ); 
})
```
Color as string.

API Events
========
This plugin uses the standard jQuery notation for calling events.

These will **trigger when they happen**. As with any event, you need to include a function callback.

###ready
```javascript
$("#myvideo").on("ready", function(){  
    console.log( "Vimeo is ready!" ); 
});
```
Fires when the video is ready.

###play
```javascript
$("#myvideo").on("play", function(){
	console.log( "Video is playing" );
});
```
Fires whenever the video is played.

###pause
```javascript
$("#myvideo").on("pause", function(){
	console.log( "Video is paused" );
});
```
Fires whenever the video is paused.

###finish
```javascript
$("#myvideo").on("finish", function(){
	console.log( "Video is done playing" );
});
```
Fires whenever the video is finished.

###loadProgress
```javascript
$("#myvideo").on("loadProgress", function(event, data){
	console.log( data );
});
//{
//	"percent"     : "0.326",
//	"bytesLoaded" : "32159909",
//	"bytesTotal"  : "98650027",
//	"duration"    : "365.507"
//}
```
This will continuously return info as video is **loading**.

###playProgress
```javascript
$("#myvideo").on("playProgress", function(event, data){
	console.log( data );
});
//{
//	"seconds"  : "4.308",
//	"percent"  : "0.012",
//	"duration" : "359.000"
//}
```
This will continuously return info as video is **playing**.

###seek
```javascript
$("#myvideo").on("seek", function(event, data){
	console.log( data );
});
//{
//	"seconds"  : "192.622",
//	"percent"  : "0.527",
//	"duration" : "365.507"
//}
```
This will continuously return info as video is **seeking**.

Chaining
========
This plugin supports chaining any of the above items.

```javascript
$("#myvideo").vimeo("play")
	.vimeo("getVolume", function(d){ console.log("volume", d); })
    .vimeo("setVolume", 0.5)
    .vimeo("getVolume", function(d){ console.log("new volume", d); })
    .on("pause", function(){ console.log("paused"); })
```

Released under the MIT license
* http://opensource.org/licenses/MIT

Changelog
=========
* 2016-05-05   v0.10.3   Major bug fix to events chain being called before iframe is loaded in some cases.
* 2016-04-09   v0.10.2   Created new vimeoLoad() method for dynamically loaded videos
* 2015-06-01   v0.10.1   Force https always. API calls don't seem to work over http
* 2015-04-14   v0.10.0   Support for multiple videos automatically.
* 2015-03-09   v0.9.3   Fixed playProgress and loadProgress events due to capitalization issue.
* 2015-02-20   v0.9.2   Fixed Bower package, so it only installs js files.
* 2015-02-20   v0.9.1   Added package controls for bower, npm, and Grunt tasks.
* 2015-02-06   v0.9.0   Fixed window.location.protocol, which was missing a colon.
* 2014-12-25   v0.8.9   Fixed issue with Firefox, which didn't recognize hasOwnProperty. Used for...in instead.


