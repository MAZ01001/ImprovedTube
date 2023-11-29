///<reference path="../../ref.d.ts"/>
//@ts-check
'use strict';
/*--------------------------------------------------------------
>>> CORE:
----------------------------------------------------------------
# Global variable
# CODEC || 30FPS
# Messages
	# Create element
	# Listener
	# Send
	listener it-message-from-extension
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# GLOBAL VARIABLE
--------------------------------------------------------------*/

/**
 * @global
 * @see ImprovedTube in `ref.d.ts`
 */
//@ts-ignore
var ImprovedTube = ImprovedTube ?? {
	messages: {
		queue: []
	},
	storage: {},
	elements: {
		buttons: {},
		masthead: {},
		app_drawer: {},
		playlist: {},
		livechat: {},
		related: {},
		comments: {},
		collapse_of_subscription_sections: [],
		mark_watched_videos: [],
		blacklist_buttons: []
	},
	regex: Object.freeze({
		channel: /\/(@|c\/@?|channel\/|user\/)(?<name>[^/]+)/,
		channel_home_page: /\/@|((channel|user|c)\/)[^/]+(\/featured)?\/?$/,
		channel_home_page_postfix: /\/(featured)?\/?$/,
		thumbnail_quality: /(default\.jpg|mqdefault\.jpg|hqdefault\.jpg|hq720\.jpg|sddefault\.jpg|maxresdefault\.jpg)+/,
		video_id: /[?&]v=([^&]+)/,
		video_time: /[?&](?:t|start)=([^&]+)/,
		playlist_id: /[?&]list=([^&]+)/,
		channel_link: /https:\/\/www.youtube.com\/@|((channel|user|c)\/)/
	}),
	video_src: false,
	initialVideoUpdateDone: false,
	latestVideoDuration: 0,
	video_url: '',
	focus: false,
	played_before_blur: false,
	played_time: 0,
	ignore_autoplay_off: false,
	mini_player__mode: false,
	mini_player__move: false,
	mini_player__cursor: '',
	mini_player__x: 0,
	mini_player__y: 0,
	mini_player__max_x: 0,
	mini_player__max_y: 0,
	mini_player__original_width: 0,
	mini_player__original_height: 0,
	mini_player__width: 200,
	mini_player__height: 160,
	miniPlayer_mouseDown_x: 0,
	miniPlayer_mouseDown_y: 0,
	mini_player__player_offset_x: 0,
	mini_player__player_offset_y: 0,
	miniPlayer_resize_offset: 16,
	playlistReversed: false,
	status_timer: false,
	defaultApiKey: 'AIzaSyCXRRCFwKAXOiF1JkUBmibzxJF1cPuKNwA'
};

/*--------------------------------------------------------------
CODEC || 30FPS
----------------------------------------------------------------
	Do not move, needs to be on top of first injected content
	file to patch HTMLMediaElement before YT player uses it.
--------------------------------------------------------------*/
if (localStorage['it-codec'] || localStorage['it-player30fps']) {
	//~ it-codec = /webm|vp8|vp9|av01/

	if (window.MediaSource) window.MediaSource.isTypeSupported = (original => function isTypeSupported(type) {
		'use strict';
		if (localStorage['it-codec'] && new RegExp(localStorage['it-codec']).test(type)) return false;
		if (localStorage['it-player30fps'] && Number(/framerate=([+-]?[0-9]+)/i.exec(type)?.[1] ?? NaN) > 30) return false;
		return original.apply(this, arguments);
	})(window.MediaSource.isTypeSupported);

	HTMLMediaElement.prototype.canPlayType = (original => function canPlayType(type) {
		'use strict';
		if (localStorage['it-codec'] && new RegExp(localStorage['it-codec']).test(type)) return '';
		if (localStorage['it-player30fps'] && Number(/framerate=([+-]?[0-9]+)/i.exec(type)?.[1] ?? NaN) > 30) return '';
		return original.apply(this, arguments);
	})(HTMLMediaElement.prototype.canPlayType);
};

/*--------------------------------------------------------------
# MESSAGES
--------------------------------------------------------------*/

ImprovedTube.messages.create = function () {
	'use strict';
	this.element ??= document.createElement('div');

	this.element.id = 'it-messages-from-youtube';
	this.element.style.display = 'none';

	document.documentElement.appendChild(this.element);
};

ImprovedTube.messages.listener = function () {
	'use strict';
	const fnc = () => {
		'use strict';
		this.queue.shift();
		if (this.queue.length > 0) {
			this.element?.replaceChildren(this.queue[0]);
			document.dispatchEvent(new CustomEvent('it-message-from-youtube'));
		}
	};
	document.removeEventListener('it-message-from-youtube--readed', fnc);
	document.addEventListener('it-message-from-youtube--readed', fnc, { passive: true });
};

ImprovedTube.messages.send = function (message) {
	'use strict';
	if (typeof message === 'object') message = JSON.stringify(message);
	this.queue.push(message);
	if (this.queue.length === 1) {
		this.element?.replaceChildren(message);
		document.dispatchEvent(new CustomEvent('it-message-from-youtube'));
	}
};

/**
 * Add a listener for `it-message-from-extension` to document (to act on messages from the extension)\
 * Each message is taken from the text content of the first `#it-messages-from-extension` element found in DOM\
 * Dispatches custom event `it-message-from-extension--readed` after each message received
 */
document.addEventListener('it-message-from-extension', () => {
	'use strict';
	const provider = document.getElementById('it-messages-from-extension');
	if (provider?.textContent == null) return;

	const messageRaw = provider.textContent;
	document.dispatchEvent(new CustomEvent('it-message-from-extension--readed'));
	const message = (() => {
		'use strict';
		try { return JSON.parse(messageRaw); }
		catch (error) {
			if (error instanceof SyntaxError) return messageRaw;
			else throw error;
		}
	})();
	if (message == null) return;

	if (message.action === 'storage-loaded') {
		ImprovedTube.storage = message.storage;

		const codecConf = [];

		if (ImprovedTube.storage.block_vp9) codecConf.push('vp9|vp09');
		if (ImprovedTube.storage.block_h264) codecConf.push('avc1');
		if (ImprovedTube.storage.block_av1) codecConf.push('av01');

		if (codecConf.length === 0) localStorage.removeItem('it-codec');
		else localStorage['it-codec'] = codecConf.join('|');

		if (ImprovedTube.storage.player_60fps ?? true) localStorage.removeItem('it-player30fps');
		else localStorage['it-player30fps'] = true;

		//~ immediately apply changes
		ImprovedTube.init();
	} else if (message.action === 'storage-changed') {
		const camelizedKey = message.camelizedKey;

		ImprovedTube.storage[message.key] = message.value;

		if (message.key === 'player_60fps') {
			if (ImprovedTube.storage.player_60fps ?? true) localStorage.removeItem('it-player30fps');
			else localStorage['it-player30fps'] = true;
		} else if (['block_vp9', 'block_h264', 'block_av1'].includes(message.key)) {
			const codecConf = [];

			if(ImprovedTube.storage.block_vp9) codecConf.push('vp9|vp09');
			if(ImprovedTube.storage.block_h264) codecConf.push('avc1');
			if(ImprovedTube.storage.block_av1) codecConf.push('av01');

			if (codecConf.length === 0) localStorage.removeItem('it-codec');
			else localStorage['it-codec'] = codecConf.join('|');
		}

		// BUG ? method does not exist in ImprovedTube
		if (message.value === 'when_paused') ImprovedTube.whenPaused?.();

		switch (camelizedKey) {
			case 'theme':
				ImprovedTube.myColors();
				ImprovedTube.setTheme();
			break;
			case 'description':
				if (['expanded', 'classic_expanded'].includes(ImprovedTube.storage.description ?? '')) (document.getElementById('more') ?? document.getElementById('expand'))?.click();
				else if (['normal', 'classic'].includes(ImprovedTube.storage.description ?? '')) (document.getElementById('less') ?? document.getElementById('collapse'))?.click();
				ImprovedTube.improvedtubeYoutubeButtonsUnderPlayer();
			break;
			case 'transcript':
				if (ImprovedTube.storage.transcript == null) break;
				if (ImprovedTube.storage.transcript) document.querySelector('*[target-id*=transcript]')?.removeAttribute('visibility');
				else {
					/** @type {HTMLButtonElement | null} */
					const button = document.querySelector('*[target-id*=transcript] #visibility-button button');
					button?.click();
				}
			break;
			case 'chapters':
				if (ImprovedTube.storage.chapters == null) break;
				if (ImprovedTube.storage.chapters) document.querySelector('*[target-id*=chapters]')?.removeAttribute('visibility');
				else {
					/** @type {HTMLButtonElement | null} */
					const button = document.querySelector('*[target-id*=chapters] #visibility-button button');
					button?.click();
				}
			break;
			case 'commentsSidebar':
				if (ImprovedTube.storage.comments_sidebar ?? true) ImprovedTube.commentsSidebar();
				else {
					document.getElementById('below')?.append(document.getElementById('comments') ?? '');
					document.getElementById('secondary')?.append(document.getElementById('related') ?? '');
				}
			break;
			case 'forcedTheaterMode':
				if (
					!(ImprovedTube.storage.forced_theater_mode ?? true)
					&& ImprovedTube.elements.ytd_watch
					&& ImprovedTube.elements.player
				) {
					/** @type {HTMLButtonElement | null} */
					const button = ImprovedTube.elements.player.querySelector('button.ytp-size-button');
					if (button && (ImprovedTube.elements.ytd_watch.theater ?? false)) {
						ImprovedTube.elements.ytd_watch.theater = false;
						setTimeout(() => button.click(), 100);
					}
				}
			break;
			case 'playerScreenshotButton':
				if (!(ImprovedTube.storage.player_screenshot_button ?? true)) {
					ImprovedTube.elements.buttons['it-screenshot-button']?.remove();
					ImprovedTube.elements.buttons['it-screenshot-styles']?.remove();
				}
			break;
			case 'playerRepeatButton':
				if (!(ImprovedTube.storage.player_repeat_button ?? true)) {
					ImprovedTube.elements.buttons['it-repeat-button']?.remove();
					ImprovedTube.elements.buttons['it-repeat-styles']?.remove();
				}
			break;
			case 'playerPopupButton':
				if (!(ImprovedTube.storage.player_popup_button ?? true)) ImprovedTube.elements.buttons['it-popup-player-button']?.remove();
			break;
			case 'playerRotateButton':
				if (!(ImprovedTube.storage.player_rotate_button ?? true)) {
					ImprovedTube.elements.buttons['it-rotate-button']?.remove();
					ImprovedTube.elements.buttons['it-rotate-styles']?.remove();
				}
			break;
			case 'playerFitToWinButton':
				if (!(ImprovedTube.storage.player_fit_to_win_button ?? true)) {
					ImprovedTube.elements.buttons['it-fit-to-win-player-button']?.remove();
					document.documentElement.setAttribute('it-player-size', ImprovedTube.storage.player_size ?? 'do_not_change');
				}
			break;
			case 'playerHamburgerButton':
				if (!(ImprovedTube.storage.player_hamburger_button ?? true)) {
					document.querySelector('.custom-hamburger-menu')?.remove();
					/** @type {HTMLDivElement | null} */
					const rightControls = ImprovedTube.elements.ytd_player.querySelector('div.ytp-right-controls');
					if (rightControls == null) break;
					//~ Restoring the original padding
					rightControls.style.removeProperty('padding-right');
					rightControls.style.setProperty('display', 'flex');
				}
			break;
			case 'belowPlayerPip':
				if (ImprovedTube.storage.below_player_pip == null) break;
				if (ImprovedTube.storage.below_player_pip) {
					for (const itPlayerButton of document.querySelectorAll('.improvedtube-player-button')) itPlayerButton.remove();
					ImprovedTube.improvedtubeYoutubeButtonsUnderPlayer();
				} else document.querySelector('.improvedtube-player-button[data-tooltip="PiP"]')?.remove();
			break;
			case 'belowPlayerScreenshot':
				if (ImprovedTube.storage.below_player_screenshot == null) break;
				if (ImprovedTube.storage.below_player_screenshot) {
					for (const itPlayerButton of document.querySelectorAll('.improvedtube-player-button')) itPlayerButton.remove();
					ImprovedTube.improvedtubeYoutubeButtonsUnderPlayer();
				} else document.querySelector('.improvedtube-player-button[data-tooltip="Screenshot"]')?.remove();
			break;
			case 'belowPlayerLoop':
				if (ImprovedTube.storage.below_player_loop == null) break;
				if (ImprovedTube.storage.below_player_loop) {
					for (const itPlayerButton of document.querySelectorAll('.improvedtube-player-button')) itPlayerButton.remove();
					ImprovedTube.improvedtubeYoutubeButtonsUnderPlayer();
				} else document.querySelector('.improvedtube-player-button[data-tooltip="Loop"]')?.remove();
			break;
			case 'dayOfWeek':
				if (ImprovedTube.storage.day_of_week == null) break;
				if (ImprovedTube.storage.day_of_week) ImprovedTube.dayOfWeek();
				else document.querySelector('.ytd-day-of-week')?.remove();
			break;
			case 'playerRemainingDuration':
				if (ImprovedTube.storage.player_remaining_duration == null) break;
				if (ImprovedTube.storage.player_remaining_duration) ImprovedTube.playerRemainingDuration();
				else document.querySelector('.ytp-time-remaining-duration')?.remove();
			break;
		}

		if (camelizedKey === 'blacklistActivate') ImprovedTube.blacklist();
		else if (camelizedKey === 'playerForcedPlaybackSpeed') ImprovedTube.playerPlaybackSpeed();
		else if (typeof ImprovedTube[camelizedKey] === 'function') ImprovedTube[camelizedKey]();
	} else if ((message.focus ?? false) && ImprovedTube.elements.player) {
		ImprovedTube.focus = true;
		ImprovedTube.pageOnFocus();
	} else if ((message.blur ?? false) && ImprovedTube.elements.player) {
		ImprovedTube.focus = false;
		ImprovedTube.pageOnFocus();
		document.dispatchEvent(new CustomEvent('improvedtube-blur'));
	} else if ((message.pause ?? false) && ImprovedTube.elements.player) {
		ImprovedTube.played_before_blur = ImprovedTube.elements.player.getPlayerState() === 1;
		ImprovedTube.elements.player.pauseVideo();
	} else if (message.setVolume != null) ImprovedTube.elements.player?.setVolume(message.setVolume);
	else if (message.setPlaybackSpeed != null) ImprovedTube.elements.player?.setPlaybackRate(message.setPlaybackSpeed);
	else if (message.deleteCookies ?? false) ImprovedTube.deleteYoutubeCookies();
	else if (message.responseOptionsUrl != null) document.querySelector('iframe.it-button__iframe')?.setAttribute('src', message.responseOptionsUrl);
	//? why has this been commented out for so long; what was it for; can this be deleted?
	//// else if ((message.mixer != null) && ImprovedTube.elements.player) {
	//// 	document.documentElement.setAttribute('it-response', `{
	//// 		"mixer": true,
	//// 		"url": "${location.href.match(ImprovedTube.regex.video_id)?.[1]}",
	//// 		"volume": ${ImprovedTube.elements.player.getVolume()},
	//// 		"playbackRate": ${ImprovedTube.elements.player.getPlaybackRate()},
	//// 		"title": "${document.title}"
	//// 	}`);
	//// }
}, { passive: true });
