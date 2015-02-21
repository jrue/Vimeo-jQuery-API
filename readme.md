Simple jQuery Vimeo API
================

An easy way to control Vimeo videos using standard jQuery event structure and methods.

Setup
========
Make sure to include this plugin's .js file *after* jQuery library. Use the minified version for best performance.

This plugin works with iframe Vimeo embeds only. You can target the iframe using any normal jQuery CSS conventions, but often it's easier to put an id attribute on the iframe to target it specifically.

```html
<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
<script src="src/jquery.vimeo.api.min.js"></script>

<iframe id="myvideo" src="//player.vimeo.com/video/77889659" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

```

Place API calls inside jQuerys document ready function.

```
<script>
$(document).ready(function($) {
    $("#myvideo").vimeo("play");
});
</script>
```

Multiple videos
========
This plugin will work fine with just a single Vimeo embed with no additional work. But because of a peculiarity with the way Vimeo sends messages, it's impossible to tell which API messages go with which video when there are multiple embeds on the page. The solution for this is to identify each video by appending a special query string identifier to each video's URL.

**Important for multiple videos!!**
<pre>
&lt;iframe src="//player.vimeo.com/video/77889659?title=0&amp;byline=0&amp;portrait=0<strong>&amp;api=1&amp;player_id=video1</strong>" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen&gt;&lt;/iframe&gt;

&lt;iframe src="//player.vimeo.com/video/93422288?title=0&amp;byline=0&amp;portrait=0<strong>&amp;api=1&amp;player_id=video2</strong>" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen&gt;&lt;/iframe&gt;
</pre>
Notice at the end of each embedded Vimeo URL, we appended <strong>`&api=1&player_id=video1`</strong> to the end. The `video1` portion should be any unique identifier, ideally matching the id of the iframe. This will ensure best performance.

API Methods
========
For methods, you can call API immediately with one argument as a string. For methods which take additional information 

```javascript
$("#myvideo").vimeo("play");
$("#myvideo").vimeo("seekTo", 5); //seeks to five seconds
```

####$("#myvideo").vimeo("play");
Plays videos as soon as this is called. Note for time sensitive presentations: this will wait until the video is ready and receives a ready message from Vimeo, so there might be a slight delay if playing right when the page loads.

####$("#myvideo").vimeo("pause");
Will pause video at it's current location.

####$("#myvideo").vimeo("unload");
Equivalent to stop or rewind, as it reverts player back to original state.

####$("#myvideo").vimeo("setVolume", 0.5);
Sets the volume of the video as a percentage from 0 to 1.

####$("#myvideo").vimeo("setLoop", true);
Set looping to boolean value.

####$("#myvideo").vimeo("seekTo", 5);
Seeks to specified number of seconds. (Does not work on mobile)

####$("#myvideo").vimeo("setColor", "#333333");
Sets color of player to hex value as a string.

##Return Calls
These are methods which return information about video. Because we need to contact Vimeo for information about the status of the video, the second argument needs to be a callback function. This also means, these calls will be asynchronous, and there might be a small delay.

####paused
```javascript
$("#myvideo").vimeo("paused", function(data){  
    console.log( "Is paused?", data ); 
})
```
Returns boolean showing whether video is paused.

####getCurrentTime
```javascript
$("#myvideo").vimeo("getCurrentTime", function(data){
	console.log( "Current time", data ); 
})
```
Returns current play time as seconds. This is a one time return. For continous updates, use playProgress event.

####getDuration
```javascript
$("#myvideo").vimeo("getDuration", function(data){
	console.log( "Video length", data ); 
})
```
Return total duration of video in seconds.

####getVolume
```javascript
$("#myvideo").vimeo("getVolume", function(data){
	console.log( "Volume is", data ); 
})
```
Return volume in seconds

####getVideoHeight or getVideoWidth
```javascript
$("#myvideo").vimeo("getVideoHeight", function(data){
	console.log( "Height", data ); 
})
$("#myvideo").vimeo("getVideoWidth", function(data){
	console.log( "Width", data ); 
})
```
Height or width as number.

####getVideoUrl
```javascript
$("#myvideo").vimeo("getVideoUrl", function(data){
	console.log( "Video URL", data ); 
})
```
Get the url to the video itself as a string. (not the Vimeo page, but the actual video embed)

####getColor
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


####play
```javascript
$("#myvideo").on("play", function(){
	console.log( "Video is playing" );
});
```
Fires whenever the video is played.

####pause
```javascript
$("#myvideo").on("pause", function(){
	console.log( "Video is paused" );
});
```
Fires whenever the video is paused.

####finish
```javascript
$("#myvideo").on("finish", function(){
	console.log( "Video is done playing" );
});
```
Fires whenever the video is finished.

####loadProgress
```javascript
$("#myvideo").on("loadProgress", function(d){
	console.log( d.bytesLoaded );
});
//{
//	"percent"     : "0.326",
//	"bytesLoaded" : "32159909",
//	"bytesTotal"  : "98650027",
//	"duration"    : "365.507"
//}
```
This will continuously return info as video is **loading**.

####playProgress
```javascript
$("#myvideo").on("playProgress", function(d){
	console.log( d.percent );
});
//{
//	"seconds"  : "4.308",
//	"percent"  : "0.012",
//	"duration" : "359.000"
//}
```
This will continuously return info as video is **playing**.

####seek
```javascript
$("#myvideo").on("seek", function(d){
	console.log( d.seconds );
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
* 2015-02-20   v0.9.1   Added package controls for bower, npm, and Grunt tasks.
* 2015-02-06   v0.9.0   Fixed window.location.protocol, which was missing a colon.
* 2014-12-25   v0.8.9   Fixed issue with Firefox, which didn't recognize hasOwnProperty. Used for...in instead.


