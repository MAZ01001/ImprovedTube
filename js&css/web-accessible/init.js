///<reference path="../../ref.d.ts"/>
//@ts-check
'use strict';
var ImprovedTube;
/*--------------------------------------------------------------
>>> INITIALIZATION
--------------------------------------------------------------*/
ImprovedTube.messages.create();
ImprovedTube.messages.listener();

//? why was this added as a comment; what was it for; can this be deleted?
/*
//// document.body.removeChild(document.body.getElementsByTagName("script")[1]);
//~ parses the largest "{}" from the second script element in the body found (if any),
//~ removes "playerAds", "adPlacements", and "adSlots", logs "videoDetails" to console,
//~ and converts it back to a string and inserts it back to the script element
const scriptElement = document.body.getElementsByTagName("script")[1];
if (scriptElement?.textContent != null) {
	//~ Use regex to modify the JSON content while preserving the rest
	scriptElement.textContent = scriptElement.textContent.replace(/(^[^{]*)(\{.*?})([^}]*$)/gs, (match, before, json, after) => {
		'use strict';
		const parsedJSON = (() => {
			'use strict';
			try { return JSON.parse(json); }
			catch (error) {
				if(error instanceof SyntaxError) return null;
				else throw error;
			}
		})();
		if(parsedJSON == null) return match;
		delete parsedJSON.playerAds;
		delete parsedJSON.adPlacements;
		delete parsedJSON.adSlots;
		console.log("%O", parsedJSON.videoDetails);
		return before + JSON.stringify(parsedJSON) + after;
	});
}
*/

if (document.body) ImprovedTube.childHandler(document.body);

//~ Observe entire HTML (triggers after every node added or removed)
new MutationObserver(function (mutationList) {
	'use strict';
	for (const mutation of mutationList) {
		if (mutation.type === 'childList') {
			for (const addedNode of mutation.addedNodes) ImprovedTube.childHandler(addedNode);
			for (const removedNode of mutation.removedNodes) ImprovedTube.childHandler(removedNode, true);
		}
	}
}).observe(document.documentElement, {
	attributes: false,
	childList: true,
	subtree: true
});

//~ Observe entire HTML (triggers after every node added, removed, or modified)
//~ Only observes attribute changes for href attributes
new MutationObserver(function (mutationList) {
	'use strict';
	for (const mutation of mutationList) {
		if (mutation.type === 'attributes' && mutation.target instanceof HTMLAnchorElement) ImprovedTube.channelDefaultTab(mutation.target);
	}
}).observe(document.documentElement, {
	attributeFilter: ['href'],
	attributes: true,
	childList: true,
	subtree: true
});
// TODO ↓
ImprovedTube.init = function () {
	window.addEventListener('yt-page-data-updated', function () {
		ImprovedTube.pageType();
	});
	ImprovedTube.pageType();
	var yt_player_updated = function () {
		document.dispatchEvent(new CustomEvent('improvedtube-player-loaded'));

		window.removeEventListener('yt-player-updated', yt_player_updated);
	};

	window.addEventListener('yt-player-updated', yt_player_updated);
	this.channelCompactTheme();
	this.playerOnPlay();
	this.playerSDR();
	this.shortcuts();
	this.onkeydown();
	this.onmousedown();
	this.youtubeLanguage();

	if (ImprovedTube.elements.player && ImprovedTube.elements.player.setPlaybackRate) {
		ImprovedTube.videoPageUpdate();
		ImprovedTube.initPlayer();
	}
	
	if (window.matchMedia) {
		document.documentElement.dataset.systemColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}  ImprovedTube.myColors();
};

document.addEventListener('yt-navigate-finish', function () {
	ImprovedTube.pageType();
	ImprovedTube.commentsSidebar();
	
	if (ImprovedTube.elements.player && ImprovedTube.elements.player.setPlaybackRate) {
		ImprovedTube.videoPageUpdate();
		ImprovedTube.initPlayer();
	}

	ImprovedTube.channelPlayAllButton();
});

document.addEventListener('yt-page-data-updated', function () {
	if (document.documentElement.dataset.pageType === 'video' && ImprovedTube.regex.playlist_id.test(location.search)) {
		ImprovedTube.playlistRepeat();
		ImprovedTube.playlistShuffle();
		ImprovedTube.playlistReverse();
	}
	ImprovedTube.playlistPopupUpdate();
});

window.addEventListener('DOMContentLoaded', function () {
	ImprovedTube.elements.masthead = {
		start: document.querySelector('ytd-masthead #start'),
		end: document.querySelector('ytd-masthead #end'),
		logo: document.querySelector('ytd-masthead a#logo')
	};

	ImprovedTube.elements.app_drawer = {
		start: document.querySelector('tp-yt-app-drawer #header'),
		logo: document.querySelector('tp-yt-app-drawer a#logo')
	};

	ImprovedTube.improvedtubeYoutubeIcon();
});
