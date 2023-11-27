///<reference path="../../ref.d.ts"/>
//@ts-check
'use strict';
var ImprovedTube;
/*--------------------------------------------------------------
>>> MUTATIONS
----------------------------------------------------------------
# Media element
	# Play
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# MEDIA ELEMENT
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# PLAY
--------------------------------------------------------------*/

HTMLMediaElement.prototype.play = (function (original) {
	return function () {
		document.dispatchEvent(new CustomEvent('it-play'));

		return original.apply(this, arguments);
	}
})(HTMLMediaElement.prototype.play);