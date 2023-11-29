///<reference path="../../ref.d.ts"/>
//@ts-check
'use strict';
//@ts-ignore
var chrome;
//@ts-ignore
var satus;
var extension;
/*--------------------------------------------------------------
>>> INITIALIZATION
--------------------------------------------------------------*/

extension.features.youtubeHomePage('init');

document.documentElement.setAttribute('it-pathname', location.pathname);

window.addEventListener('yt-navigate-finish', () => {
	document.documentElement.setAttribute('it-pathname', location.pathname);

	extension.features.trackWatchedVideos();
	extension.features.thumbnailsQuality();
}, { passive: true });

extension.messages.create();
extension.messages.listener();

/**
 * Add a listener for `it-message-from-youtube` to document (to act on messages from youtube)\
 * Each message is taken from the text content of the first `#it-messages-from-youtube` element found in DOM\
 * Dispatches custom event `it-message-from-youtube--readed` after each message received
 */
document.addEventListener('it-message-from-youtube', () => {
	'use strict';
	const provider = document.getElementById('it-messages-from-youtube');
	if (provider?.textContent == null) return;

	const messageRaw = provider.textContent;
	document.dispatchEvent(new CustomEvent('it-message-from-youtube--readed'));
	const message = (() => {
		'use strict';
		try { return JSON.parse(messageRaw); }
		catch (error) {
			if (error instanceof SyntaxError) return messageRaw;
			else throw error;
		}
	})();
	if (message == null) return;

	if (message.requestOptionsUrl ?? false) extension.messages.send({ "responseOptionsUrl": chrome.runtime.getURL('menu/index.html') });
	else if (message.onlyOnePlayer ?? false) chrome.runtime.sendMessage({ name: 'only-one-player' });

	switch (message.action) {
		case 'popup player':
			chrome.runtime.sendMessage({
				action: 'fixPopup',
				url: message.url,
				playerSize: {
					width: message.width,
					height: message.height
				},
				title: message.title
			});
		break;
		case 'analyzer':
			if(!(extension.storage.data.analyzer_activation ?? false)) break;
			const data = message.name,
				date = new Date().toDateString(),
				hours = new Date().getHours().toString().padStart(2, '0') + ':00';

			extension.storage.data.analyzer ??= {};
			extension.storage.data.analyzer[date] ??= {};
			extension.storage.data.analyzer[date][hours] ??= {};
			extension.storage.data.analyzer[date][hours][data] ??= 0;

			extension.storage.data.analyzer[date][hours][data]++;

			chrome.storage.local.set({ analyzer: extension.storage.data.analyzer });
		break;
		case 'blacklist':
			extension.storage.data.blacklist ??= {};

			if (message.type === 'channel') {
				extension.storage.data.blacklist.channels ??= {};

				extension.storage.data.blacklist.channels[message.id] = {
					title: message.title,
					preview: message.preview
				};
			} else if (message.type === 'video') {
				extension.storage.data.blacklist.videos ??= {};

				extension.storage.data.blacklist.videos[message.id] = { title: message.title };
			}

			chrome.storage.local.set({ blacklist: extension.storage.data.blacklist });
		break;
		case 'watched':
			extension.storage.data.watched ??= {};

			if (message.type === 'add') extension.storage.data.watched[message.id] = { title: message.title };
			else if (message.type === 'remove') delete extension.storage.data.watched[message.id];

			chrome.storage.local.set({ watched: extension.storage.data.watched });
		break;
	}
}, { passive: true });

extension.events.on('init', async function (resolve) {
	extension.storage.listener();
	extension.storage.load(function () {
		resolve();
	});
}, {
	async: true
});

function bodyReady() {
	if (extension.ready && extension.domReady) {
		extension.features.addScrollToTop();
		extension.features.font();
	}
}

extension.events.on('init', function () {
	extension.features.bluelight();
	extension.features.dim();
	extension.features.youtubeHomePage();
	extension.features.collapseOfSubscriptionSections();
	extension.features.confirmationBeforeClosing();
	extension.features.defaultContentCountry();
	extension.features.popupWindowButtons();
	extension.features.markWatchedVideos();
	extension.features.relatedVideos();
	extension.features.comments();
	extension.features.openNewTab();
	bodyReady();
});

chrome.runtime.sendMessage({
	action: 'tab-connected'
}, function (response) {
	if (response) {
		extension.tabId = response.tabId;
	}
});

extension.inject([
	'/js&css/web-accessible/core.js',
	'/js&css/web-accessible/functions.js',
	'/js&css/web-accessible/www.youtube.com/appearance.js',
	'/js&css/web-accessible/www.youtube.com/themes.js',
	'/js&css/web-accessible/www.youtube.com/player.js',
	'/js&css/web-accessible/www.youtube.com/playlist.js',
	'/js&css/web-accessible/www.youtube.com/channel.js',
	'/js&css/web-accessible/www.youtube.com/shortcuts.js',
	'/js&css/web-accessible/www.youtube.com/blacklist.js',
	'/js&css/web-accessible/www.youtube.com/settings.js',
	'/js&css/web-accessible/init.js',
	'/js&css/web-accessible/mutations.js'
], function () {
	extension.ready = true;

	extension.events.trigger('init');
});

document.addEventListener('DOMContentLoaded', () => {
	extension.domReady = true;
	bodyReady();
}, { passive: true });

let prevRequestAction = "";
chrome.runtime.onMessage.addListener(request => {
	'use strict';
	switch(request?.action ?? ''){
		case 'focus': extension.messages.send({ focus: true }); break;
		case 'blur': extension.messages.send({ blur: true }); break;
		case 'pause': extension.messages.send({ pause: true }); break;
		case 'set-volume': extension.messages.send({ setVolume: request.value }); break;
		case 'set-playback-speed': extension.messages.send({ setPlaybackSpeed: request.value }); break;
		case 'mixer':
			//! the only possible response to a "mixer"-request is commented out; see js&css/web-accessible/core.js (event listener for "it-message-from-extension")
			//// extension.messages.send({ mixer: true });
			//// //! indicates that an asyncronous response is being processed; is this desired here; why? (also does not save this as previous request action)
			//// return true;
		break;
		case 'delete-youtube-cookies': extension.messages.send({ deleteCookies: true }); break;
		case 'another-video-started-playing':
			if (prevRequestAction === 'new-tab-opened') console.log("[ImprovedTube] Other video  Continue playing");
			else extension.features.onlyOnePlayerInstancePlaying();
		break;
	}
	prevRequestAction = request.action;
});

document.addEventListener('it-play', () => { chrome.runtime.sendMessage({ action: 'play' }); }, { passive: true });
