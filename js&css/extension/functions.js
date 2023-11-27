///<reference path="../../ref.d.ts"/>
//@ts-check
'use strict';
//@ts-ignore
var chrome;
//@ts-ignore
var satus;
var extension;
/*--------------------------------------------------------------
>>> FUNCTIONS:
----------------------------------------------------------------
# Get URL parameter
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# GET URL PARAMETER
--------------------------------------------------------------*/

extension.functions.getUrlParameter = function (url, parameter) {
	var match = url.match(new RegExp('(\\?|\\&)' + parameter + '=[^&]+'));

	if (match) {
		return match[0].substr(3);
	}
};