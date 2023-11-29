///<reference path="../../ref.d.ts"/>
//@ts-check
'use strict';
var ImprovedTube;
/*--------------------------------------------------------------
>>> MUTATIONS
----------------------------------------------------------------
# Media element
	Play()
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# MEDIA ELEMENT
--------------------------------------------------------------*/

/** Inject code to dispatch a `it-play` event every time the `play` method is called on any media element in the DOM (e.g., a video element) */
HTMLMediaElement.prototype.play = (original => function play() {
	'use strict';
	document.dispatchEvent(new CustomEvent('it-play'));
	return original.apply(this, arguments);
})(HTMLMediaElement.prototype.play);
