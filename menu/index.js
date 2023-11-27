///<reference path="../ref.d.ts"/>
//@ts-check
'use strict';
//@ts-ignore
var chrome;
//@ts-ignore
var satus;
/*--------------------------------------------------------------
>>> INDEX:
----------------------------------------------------------------
# Global variable
# Initialization
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# GLOBAL VARIABLE
--------------------------------------------------------------*/

/**
 * @global
 * @see menu in `ref.d.ts`
 */
var menu = {
	skeleton: {}
};

/*--------------------------------------------------------------
# INITIALIZATION
--------------------------------------------------------------*/

satus.storage.import(function (items) {
	var language = items.language;

	if (!language || language === 'default') {
		language = window.navigator.language;
	}

	satus.locale.import(language, function () {
		satus.render(menu.skeleton);

		menu.exportSettings();
		menu.importSettings();

		satus.parentify(menu.skeleton, [
			'attr',
			'baseProvider',
			'layersProvider',
			'rendered',
			'storage',
			'parentObject',
			'parentSkeleton',
			'childrenContainer',
			'value'
		]);

		menu.attributes();
		satus.events.on('storage-set', menu.attributes);
	}, '_locales/');
});

chrome.runtime.sendMessage({
	action: 'options-page-connected'
}, function (response) {
	if (response.isTab) {
		document.body.setAttribute('tab', '');
	}
});
