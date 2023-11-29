//~ Documentation of all JS globals in this project
//? see JSDocs: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
//? d.ts files: https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html
//? ts testing: https://www.typescriptlang.org/play

/**
 * Global variable available anywhere except `/js&css/web-accessible`\
 * [Chrome-API for extensions](https://developer.chrome.com/docs/extensions/reference/)
 */
declare var chrome: {
	// TODO add used values and methods for intellisense (auto completion)
	storage: {
		onChanged: {
			addListener(callback: (changes: {}, areaName: string) => void):void;
		};
		local: {
			get<T extends string>(keys?: T, callback?: (items: Record<T, any>) => void): Promise<{}>;
			get(keys?: string | string[] | {} | null, callback?: (items: {}) => void): Promise<{}>;
			set(items: {}, callback?: () => void): Promise<void>;
			remove(keys: string | string[], callback?: () => void): Promise<void>;
		};
	};
	runtime: {
		getURL(url: string): string;
		sendMessage(message: any, options?: { includeTlsChannelId?: boolean; }, callback?: (response: any) => void): Promise<any>;
		sendMessage(extensionId: string, message: any, options?: { includeTlsChannelId?: boolean; }, callback?: (response: any) => void): Promise<any>;
	};
};

/**
 * Global variable available in `/js&cs/extension` and `/menu`\
 * Last updated //TODO
 */
declare var satus: {
	/** TODO */
	components: {};
	/** TODO */
	events: {
		/** TODO */
		data: {};
	}
	/** TODO */
	locale: {
		/** TODO */
		data: {};
	};
	/** TODO */
	storage: {
		/** TODO */
		data: {};
		/** TODO */
		type: 'extension';
	};
	/**
	 * converts a string from snake_case or dash-case to camelCase
	 *
	 * leading and trailing `'_'` and `'-'` are removed
	 * @returns {string} the converted string
	 */
	toCamelCase(str: string): string;
	/**
	 * converts a string from camelCase or dash-case to snake_case
	 *
	 * leading and trailing `'-'` are removed and upper case letters converted to lower case
	 * @returns {string} the converted string
	 */
	toSnakeCase(str: string): string;
	/**
	 * converts a string from camelCase or snake_case to dash-case
	 *
	 * leading and trailing `'_'` are removed and upper case letters converted to lower case
	 * @returns {string} the converted string
	 */
	toDashCase(str: string): string;
	/**
	 * Sorts {@linkcode array} by numerical value\
	 * Mutates the array and returns a reference to the same array
	 * @param asc - if `true` uses ascending order (default) and when `false` descending order
	 */
	sort(array: number[], asc?: boolean): number[];
	/**
	 * Sorts {@linkcode array} by locale alphanumerical value (via {@linkcode String.prototype.localeCompare})\
	 * Mutates the array and returns a reference to the same array
	 * @param asc - if `true` uses ascending order (default) and when `false` descending order
	 */
	sort(array: string[], asc?: boolean): string[];
	/**
	 * Sorts {@linkcode array} for {@linkcode property} by numerical or locale alphanumerical (via {@linkcode String.prototype.localeCompare}) value\
	 * Mutates the array and returns a reference to the same array
	 * @param asc - if `true` uses ascending order (default) and when `false` descending order
	 */
	sort<T extends number | string, P extends string | number | symbol>(array: (Record<any,any> & {[K in P]: T;})[], asc: boolean | undefined, property: P): (Record<any,any> & {[K in P]: T;})[];
	/**
	 * Copy every key value pair from {@linkcode data} to the dataset of {@linkcode element}\
	 * If any value of {@linkcode data} is a function it gets called and the result is used instead
	 */
	data(element: HTMLElement, data: {[K in string]: string | (() => string)}): void;
	/**
	 * Checks if {@linkcode t} is set (not `null` or `undefined`)
	 * @deprecated use `x == null` and optional chaining `x?.property ?? default` / `x.fnc?.()` / `x.arr?.[50]` instead
	 */
	isset(t: any): boolean;
	/**
	 * Checks if {@linkcode t} is a function
	 * @deprecated use `typeof t === 'function'` instead
	 */
	isFunction(t: any): boolean;
	/**
	 * Checks if {@linkcode t} is a string
	 * @deprecated use `typeof t === 'string'` instead
	 */
	isString(t: any): boolean;
	/**
	 * Checks if {@linkcode t} is a boolean
	 * @deprecated use `typeof t === 'boolean'` instead
	 */
	isBoolean(t: any): boolean;
	/**
	 * Checks if {@linkcode t} is a number and not `NaN`
	 * @deprecated use `typeof t === 'number' && !Number.isNaN(t)` instead
	 */
	isNumber(t: any): boolean;
	/**
	 * Checks if {@linkcode t} is an array
	 * @deprecated use `Array.isArray(t)` instead
	 */
	isArray(t: any): boolean;
	/**
	 * Checks if {@linkcode t} is a nodeList
	 * @deprecated use `t instanceof NodeList` instead
	 */
	isNodeList(t: any): boolean;
	/**
	 * Checks if {@linkcode t} is an object and not `null`
	 * @deprecated use `t instanceof Object && t != null` instead
	 */
	isObject(t: any): boolean;
	/**
	 * Checks if {@linkcode t} is an element or a document
	 * @deprecated use `t instanceof Element || t instanceof Document` instead
	 */
	isElement(t: any): boolean;
	/**
	 * Logs {@linkcode args} to console
	 * @deprecated use `console.log(args)` instead
	 */
	log(...args: any): void;
	/**
	 * Appends {@linkcode child} to {@linkcode parent} (or {@linkcode HTMLBodyElement}) and returns a reference to it
	 * @deprecated use `(parent ?? document.body).appendChild(child)` or even better `container.append('string', child)` instead
	 */
	append(child: Node | Element, parent?: ParentNode | Element): Node | Element;
	// TODO ...
};

/**
 * Global variable available in `/menu`\
 * Last updated //TODO
 */
declare var menu: {
	/** TODO */
	skeleton: {}
	// TODO ...
};

/**
 * Global variable available in `/js&cs/extension`\
 * Last updated //TODO
 */
declare var extension: {
	/** TODO */
	domReady: boolean;
	/** internal event handling //TODO */
	events: {
		/** a list of listeners where each _type_ can have multiple listeners: `{ 'type': ( (data?: any) => any | Promise<any> )[], ... }` */
		listeners: {};
		/**
		 * adds the {@linkcode listener} to the (end of the) current list of functions for {@linkcode type} in {@linkcode listeners}
		 *
		 * available {@linkcode options}:
		 * - `async` = `true` ({@linkcode listener} is a promise)
		 * - `prepend`: when set to `true`, it will add the {@linkcode listener} to the beginning of the current list of functions for {@linkcode type} in {@linkcode listeners}
		 */
		on(
			type: string,
			listener: (resolve: (value?: any) => void, reject: (reason?: any) => void) => Promise<any>,
			options: {
				async: true;
				prepend?: boolean;
			}
		): void;
		/**
		 * adds the {@linkcode listener} to the (end of the) current list of functions for {@linkcode type} in {@linkcode listeners}
		 *
		 * available {@linkcode options}:
		 * - `async` = `false` (or not given; no change in behaviour)
		 * - `prepend`: when set to `true`, it will add the {@linkcode listener} to the beginning of the current list of functions for {@linkcode type} in {@linkcode listeners}
		 */
		on(
			type: string,
			listener:  (data: any) => any,
			options?: {
				async?: false;
				prepend?: boolean;
			}
		): void;
		/**
		 * calls all functions stored in {@linkcode listeners} for {@linkcode type} (if any) with {@linkcode data}
		 * @async (waits for each listener to finish)
		 */
		trigger(type: string, data?: any): Promise<void>;
	}
	/** TODO */
	features: {
		/** If `only_one_player_instance_playing` in {@linkcode extension.storage} is enabled pauses all video elements in the DOM */
		onlyOnePlayerInstancePlaying(): void;
		/** TODO */
		addScrollToTop: ((event?: Event) => void) & {
			/** If exists, a button with ID `it-scroll-to-top`, when clicked scrolls to the top of the page */
			button?: HTMLDivElement;
		};
	};
	/** TODO */
	functions: {
		/**
		 * TODO
		 * @param url - 
		 * @param parameter - 
		 */
		getUrlParameter(url: string, parameter: string): string;
	};
	/** Messaging between the extension and youtube */
	messages: {
		/** text/JSON to send to youtube */
		queue: string[];
		/**
		 * The (hidden) element for sending strings/JSON from the extension to youtube (the injected code on the page)\
		 * Element has ID `it-messages-from-extension`
		 */
		element?: HTMLDivElement;
		/** Creates a (hidden) DIV element with ID `it-messages-from-extension` (if it doesn't exist), appends it to HTML root and saves it in {@linkcode extension.messages.element} */
		create(): void;
		/**
		 * Adds an event listener for `it-message-from-extension--readed` to the document\
		 * When event occurs, removes the first entry from {@linkcode extension.messages.queue}\
		 * Then, when {@linkcode extension.messages.queue} is not empty, populate {@linkcode extension.messages.element} with the (currently) first entry and dispatch event `it-message-from-extension`
		 */
		listener(): void;
		/**
		 * If {@linkcode message} is an object it uses {@linkcode JSON.stringify} to convert it to a string\
		 * Then, Adds {@linkcode message} to the end of {@linkcode extension.messages.queue}\
		 * And If {@linkcode extension.messages.queue} has exactly one element, populates {@linkcode extension.messages.element} with {@linkcode message} and dispatch event `it-message-from-extension`
		 */
		send(message: string | Object): void;
	};
	/** TODO */
	ready: boolean;
	/** TODO */
	storage: {
		data: {
			analyzer_activation?: boolean;
			// TODO {... 'date string': { '00:00': { 'message name': number } } }
			analyzer?: {};
			blacklist?: {
				// TODO {... 'channel ID': { title: any, preview: any } }
				channels?: {};
				// TODO {... 'video ID': { title: any } }
				videos?: {};
			};
			// TODO {... 'video ID': { title: any } }
			watched?: {};
		};
		/**
		 * Get a value from {@linkcode extension.storage.data} or `undefined` if it doesn't exist (can be a path (property chain) with `/` as seperator)
		 * @deprecated {@linkcode extension.storage.data} should be accessed directly
		 * @example
		 * extension.storage.get('blacklist/channels');
		 * // same as
		 * extension.storage.data.blacklist?.channels;
		 */
		get(key: string): any;
		/**
		 * Adds a listener to {@linkcode chrome.storage.onChanged}\
		 * which does, for each change (key and new value of change):\
		 * Updates {@linkcode extension.storage.data} and the HTML root to the new value\
		 * If a function with same name as the key (converted to camel case) exists in {@linkcode extension.features} it gets called with `true`\
		 * Calls {@linkcode extension.events.trigger} and {@linkcode extension.messages.send} with action `storage-changed` and the key and value pair
		 */
		listener(): void;
		/**
		 * Loads all entries in {@linkcode chrome.storage.local} to {@linkcode extension.storage.data} and HTML root,
		 * calls {@linkcode extension.events.trigger} and {@linkcode extension.messages.send} with action `storage-loaded` and the original items,
		 * and if {@linkcode callback} is set calls it after everything is loaded
		 */
		load(callback?: () => void): void;
	};
	/**
	 * appends multiple JS and CSS files to {@linkcode document.documentElement}\
	 * gets the URLs from {@linkcode paths} via `chrome.runtime.getURL(path: string): string`\
	 * uses recursion to iterate all {@linkcode paths} in successive order (waits for each file to finish loading)
	 * @param callback - a function called after all {@linkcode paths} are injected and loaded
	 */
	inject(paths: string[], callback: () => any): void;
	// TODO ...
}

/**
 * Global variable available in `/js&cs/web-accessible` (and on youtube in dev-console)\
 * Last updated //TODO
 */
declare var ImprovedTube: {
	/** Messaging between youtube and the extension */
	messages: {
		/** text/JSON to send to the extension */
		queue: string[];
		/**
		 * The (hidden) element for sending strings/JSON from youtube (the injected code on the page) to the extension\
		 * Element has ID `it-messages-from-youtube`
		 */
		element?: HTMLDivElement;
		/** Creates a (hidden) DIV element with ID `it-messages-from-youtube` (if it doesn't exist), appends it to HTML root and saves it in {@linkcode ImprovedTube.messages.element} */
		create(): void;
		/**
		 * Adds an event listener for `it-message-from-youtube--readed` to the document\
		 * When event occurs, removes the first entry from {@linkcode ImprovedTube.messages.queue}\
		 * Then, when {@linkcode ImprovedTube.messages.queue} is not empty, populate {@linkcode ImprovedTube.messages.element} with the (currently) first entry and dispatch event `it-message-from-youtube`
		 */
		listener(): void;
		/**
		 * If {@linkcode message} is an object it uses {@linkcode JSON.stringify} to convert it to a string\
		 * Then, Adds {@linkcode message} to the end of {@linkcode ImprovedTube.messages.queue}\
		 * And If {@linkcode ImprovedTube.messages.queue} has exactly one element, populates {@linkcode ImprovedTube.messages.element} with {@linkcode message} and dispatch event `it-message-from-youtube`
		 */
		send(message: string | Object): void;
	};
	/** Settings switches */
	storage: {
		block_vp9?: boolean;
		block_h264?: boolean;
		block_av1?: boolean;
		player_60fps?: boolean;
		description?: string;
		transcript?: boolean;
		comments_sidebar?: boolean;
		forced_theater_mode?: boolean;
		player_fit_to_win_button?: boolean;
		player_screenshot_button?: boolean;
		player_repeat_button?: boolean;
		player_popup_button?: boolean;
		player_rotate_button?: boolean;
		/** `full_window` / `fit_to_window` / `max_width` / `do_not_change` (default) / `custom` */
		player_size?: string;
		player_hamburger_button?: boolean;
		below_player_pip?: boolean;
		below_player_screenshot?: boolean;
		below_player_loop?: boolean;
		day_of_week?: boolean;
		player_remaining_duration?: boolean;
		chapters?: boolean;
		channel_default_tab?: string;
		// TODO more? add descriptions?
	};
	/** TODO */
	elements: {
		buttons: {};
		masthead: {};
		app_drawer: {};
		playlist: {};
		livechat: {};
		related: {};
		comments: {};
		collapse_of_subscription_sections: never[];
		mark_watched_videos: never[];
		blacklist_buttons: never[];
		// TODO ↑
		/**
		 * The `<div class="html5-video-player" id="movie_player" aria-label="YouTube Video Player"></div>` in DOM\
		 * Object properties are not injected by ImprovedTube
		 */
		player?: HTMLDivElement & {
			getPlayerState(): number;
			pauseVideo(): void;
			stopVideo(): void;
			getVolume(): number;
			setVolume(volume: number): void;
			getPlaybackRate(): number;
			setPlaybackRate(speed: number): void;
			getCurrentTime(): number
			getDuration(): number;
			seekTo(seconds: number): void;
			getOption(arg_0: 'captions', arg_1: 'tracklist', arg_2: { includeAsr: true; }): { vss_id: string }[];
			setOption(arg_0: 'captions', arg_1: 'track', arg_2: { vss_id: string; }): void;
			toggleFullscreen(): void;
			getAvailableQualityLevels(): string[];
			setPlaybackQualityRange(quality: string): void;
			setPlaybackQuality(quality: string): void;
			hideControls(): void;
			showControls(): void;
			setLoop(state: boolean): void;
			nextVideo(): void;
			previousVideo(): void;
			seekBy(seconds: number): void;
			toggleSubtitlesOn(): void;
			toggleSubtitles(): void;
			getSubtitlesUserSettings(): {
				background: string;
				backgroundOpacity: number;
				charEdgeStyle: number;
				color: string;
				fontFamily: number;
				fontSizeIncrement: number;
				fontStyle: number;
				textOpacity: number;
				windowColor: string;
				windowOpacity: number;
			};
			updateSubtitlesUserSettings(
				config: {
					background?: string;
					backgroundOpacity?: number;
					charEdgeStyle?: number;
					color?: string;
					fontFamily?: number;
					fontSizeIncrement?: number;
					fontStyle?: number;
					textOpacity?: number;
					windowColor?: string;
					windowOpacity?: number;
				}
			): void;
			isMuted(): boolean;
			isVideoInfoVisible(): boolean;
			hideVideoInfo(): void;
			showVideoInfo(): void;
			//~ and many more
		};
		/**
		 * The `<ytd-player id="ytd-player" context="WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH" class="ytd-watch-flexy"></ytd-player>` in DOM\
		 * Object properties are not injected by ImprovedTube
		 */
		ytd_player: HTMLElement & {
			updatePlayerComponents(
				arg_0: null,
				autoplay: {
					modifiedSets: {}[];
					sets: {
						mode: string;
						autoplayVideo: {};
						nextButtonVideo: {};
						previousButtonVideo?: {}
					}[];
					trackingParams: string;
				},
				arg_2: null,
				playlist: {
					contents: {}[];
					continuations: {}[];
					currentIndex: number;
					endPoint: {};
					localCurrentIndex: number;
					playlistId: string;
					playlistShareUrl: string;
					title: string;
					totalVideos: number;
					//~ and some more
				}
			): void;
			updatePlayerPlaylist_(playlist: {}): void;
			//~ and some more
		};
		/**
		 * The `<ytd-watch-flexy></ytd-watch-flexy>` in DOM\
		 * Object properties are not injected by ImprovedTube (exceptions)
		 */
		ytd_watch: HTMLElement & {
			data: {
				contents: {
					twoColumnWatchNextResults: {
						autoplay: {
							autoplay: {
								modifiedSets: {}[];
								sets: {
									mode: string;
									autoplayVideo: {};
									nextButtonVideo: {};
									previousButtonVideo?: {}
								}[];
								trackingParams: string;
							};
						};
						playlist: {
							playlist: {
								contents: {}[];
								continuations: {}[];
								currentIndex: number;
								endPoint: {};
								localCurrentIndex: number;
								playlistId: string;
								playlistShareUrl: string;
								title: string;
								totalVideos: number;
								//~ and some more
							};
						};
						results: { results: {}; };
						secondaryResults: { secondaryResults: {}; };
					};
				};
				//~ and some more
			};
			/** _does not exist on element per default_ */
			theater?: boolean;
			//~ and many more
		};
	};
	/** [Readonly] Regular expressions for pattern matching */
	regex: Readonly<{
		/** @readonly `/\/(@|c\/@?|channel\/|user\/)(?<name>[^/]+)/` */
		channel: RegExp;
		/** @readonly `/\/@|((channel|user|c)\/)[^/]+(\/featured)?\/?$/` */
		channel_home_page: RegExp;
		/** @readonly `/\/(featured)?\/?$/` */
		channel_home_page_postfix: RegExp;
		/** @readonly `/(default\.jpg|mqdefault\.jpg|hqdefault\.jpg|hq720\.jpg|sddefault\.jpg|maxresdefault\.jpg)+/` */
		thumbnail_quality: RegExp;
		/** @readonly `/[?&]v=([^&]+)/` */
		video_id: RegExp;
		/** @readonly `/[?&](?:t|start)=([^&]+)/` */
		video_time: RegExp;
		/** @readonly `/[?&]list=([^&]+)/` */
		playlist_id: RegExp;
		/** @readonly `/https:\/\/www.youtube.com\/@|((channel|user|c)\/)` */
		channel_link: RegExp;
	}>;
	// TODO ↓
	video_src: boolean;
	initialVideoUpdateDone: boolean;
	latestVideoDuration: number;
	video_url: string;
	focus: boolean;
	played_before_blur: boolean;
	played_time: number;
	ignore_autoplay_off: boolean;
	mini_player__mode: boolean;
	mini_player__move: boolean;
	mini_player__cursor: string;
	mini_player__x: number;
	mini_player__y: number;
	mini_player__max_x: number;
	mini_player__max_y: number;
	mini_player__original_width: number;
	mini_player__original_height: number;
	mini_player__width: number;
	mini_player__height: number;
	miniPlayer_mouseDown_x: number;
	miniPlayer_mouseDown_y: number;
	mini_player__player_offset_x: number;
	mini_player__player_offset_y: number;
	miniPlayer_resize_offset: number;
	playlistReversed: boolean;
	status_timer: boolean;
	defaultApiKey: string;
	/** TODO */
	init(): void;
	/** TODO */
	createPlayerButton(config: {
		id?: string;
		child?: HTMLOrSVGElement;
		opacity?: number;
		position: string;
		onclick?: (event: MouseEvent) => void;
		title?: string;
	}): void;
	improvedtubeYoutubeButtonsUnderPlayer(): void;
	dayOfWeek(): void;
	playerRemainingDuration(): void;
	blacklist(): void;
	playerPlaybackSpeed(): void;
	pageOnFocus(): void;
	deleteYoutubeCookies(): void;
	commentsSidebar(): void;
	myColors(): void;
	setTheme(): void;
	// TODO ↑
	/**
	 * Called by a mutation observer after any node got added or removed from DOM (HTML root and below)\
	 * Calls {@linkcode ImprovedTube.ytElementsHandler} for {@linkcode node} and every child node (if any) that is not one of the following
	 * - `SCRIPT`
	 * - `iron-iconset-svg`
	 * - `svg`
	 * - `SPAN`
	 * - `#text`
	 * - `#comment`
	 * - `yt-icon-shape`
	 * - `DOM-IF`
	 * - `DOM-REPEAT`
	 * @param removed - set to `true` if the {@linkcode node} was removed otherwise treated as added (default)
	 */
	childHandler(node: Node | ChildNode | HTMLElement, removed?: boolean): void;
	/**
	 * Main place to insert custom HTML elements to the page\
	 * Gets called by {@linkcode ImprovedTube.childHandler} for every node (and child nodes) that was added to the DOM (HTML root and below)
	 */
	ytElementsHandler(node: Node | ChildNode | HTMLElement): void;
	/**
	 * Changes each link matching {@linkcode ImprovedTube.regex.channel_home_page} to point (on that channel) to {@linkcode ImprovedTube.storage.channel_default_tab}\
	 * And adds a click event listener to the {@linkcode linkElement} that stops further event propagation\
	 * _Called by mutation observer for any href attribute changes_
	 */
	channelDefaultTab(linkElement: HTMLAnchorElement): void;
	/**
	 * Creates fit-to-window toggle button (ID `it-fit-to-win-player-button`), when {@linkcode ImprovedTube.storage.player_fit_to_win_button} is set to `true`, and currently on a video page (`/watch`) via {@linkcode ImprovedTube.createPlayerButton}\
	 * When clicked toggles `it-player-size` on the HTML root to `fit_to_window` or `do_not_change` according to {@linkcode ImprovedTube.storage.player_size} and dispatches event `resize` on {@linkcode window}
	 */
	playerFitToWinButton(): void;
	/** @deprecated has no implementation */
	whenPaused?: () => void;
	// TODO ...
};

// FAV [strict-mode for every function] search /(function ?\([^)]*\) ?\{|\([^)]*\) ?=> ?\{)(\r?\n?[ \t]*)(\S)(?!use strict)/gi reaplace "$1$2'use strict';$2$3"
