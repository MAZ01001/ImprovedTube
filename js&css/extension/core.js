///<reference path="../../ref.d.ts"/>
//@ts-check
'use strict';
//@ts-ignore
var chrome;
//@ts-ignore
var satus;
/*--------------------------------------------------------------
>>> CORE:
----------------------------------------------------------------
# Global variable
# Events
	# On
	# Trigger
# Inject
# Messages
	# Create element
	# Listener
	# Send
# Storage
	# Get
	# Listener
	# Load
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# GLOBAL VARIABLE
--------------------------------------------------------------*/

/**
 * @global
 * @see extension in `ref.d.ts`
 */
//@ts-ignore
var extension = extension ?? {
	domReady: false,
	events: {
		listeners: {}
	},
	features: {},
	functions: {},
	messages: {
		queue: []
	},
	ready: false,
	storage: {
		data: {}
	}
};


/*--------------------------------------------------------------
# EVENTS
--------------------------------------------------------------*/

/**
 * @see {@linkcode extension.events.on} in `ref.d.ts`
 * @param {string} type
 * @param {( (resolve: (value?: any) => void, reject: (reason?: any) => void) => Promise<any> ) | ( (data: any) => any )} listener
 * @param {{async?: boolean, prepend?: boolean}} [options]
 */
extension.events.on = function (type, listener, options) {
	'use strict';
	this.listeners[type] ??= [];

	if (options?.async === true) listener = (original => async () => new Promise(original))(listener);

	if (options?.prepend === true) this.listeners[type].unshift(listener);
	else this.listeners[type].push(listener);
};

/**
 * @see {@linkcode extension.events.trigger} in `ref.d.ts`
 * @param {string} type
 * @param {any} [data]
 */
extension.events.trigger = async function (type, data) {
	'use strict';
	for (const listener of this.listeners[type] ?? [])
		if (typeof listener === 'function') await listener(data);
};

/**
 * @see {@linkcode extension.inject} in `ref.d.ts`
 * @param {string[]} paths
 * @param {() => any} callback
 */
extension.inject = function (paths, callback) {
	'use strict';
	if (paths.length === 0) return callback?.(), undefined;

	const path = chrome.runtime.getURL(paths[0]);
	let element;

	if (path.endsWith('.css')) {
		element = document.createElement('link');

		element.rel = 'stylesheet';
		element.href = path;
	} else {
		element = document.createElement('script');

		element.src = path;
	}

	element.addEventListener('load', () => {
		paths.shift();

		this.inject(paths, callback);
	}, { passive: true, once: true });

	document.documentElement.appendChild(element);
};

/*--------------------------------------------------------------
# MESSAGES
--------------------------------------------------------------*/

extension.messages.create = function () {
	this.element ??= document.createElement('div');

	this.element.id = 'it-messages-from-extension';
	this.element.style.display = 'none';

	document.documentElement.appendChild(this.element);
};

extension.messages.listener = function () {
	'use strict';
	const fnc = () => {
		'use strict';
		this.queue.shift();
		if (this.queue.length > 0) {
			this.element?.replaceChildren(this.queue[0]);
			document.dispatchEvent(new CustomEvent('it-message-from-extension'));
		}
	};
	document.removeEventListener('it-message-from-extension--readed', fnc);
	document.addEventListener('it-message-from-extension--readed', fnc, { passive: true });
};

/**
 * @see {@linkcode extension.messages.send} in `ref.d.ts`
 * @param {string | Object} message
 */
extension.messages.send = function (message) {
	if (typeof message === 'object') message = JSON.stringify(message);
	this.queue.push(message);
	if (this.queue.length === 1) {
		this.element?.replaceChildren(message);
		document.dispatchEvent(new CustomEvent('it-message-from-extension'));
	}
};


/*--------------------------------------------------------------
# STORAGE
--------------------------------------------------------------*/

/**
 * @see {@linkcode extension.storage.get} in `ref.d.ts`
 * @param {string} key
 * @returns {any}
 */
extension.storage.get = function (key) {
	if (!key.includes('/')) return this.data[key];
	let target = this.data;
	for (const part of key.split('/')) {
		if (part !== '' && target.hasOwnProperty(part)) target = target[part];
		else return undefined;
	}
	return target;
};

extension.storage.listener = function () {
	chrome.storage.onChanged.addListener(changes => {
		for (const key in changes) {
			const value = changes[key].newValue,
				camelizedKey = satus.toCamelCase(key);

			this.data[key] = value;
			document.documentElement.setAttribute('it-' + satus.toDashCase(key), value);

			if (typeof extension.features[camelizedKey] === 'function') extension.features[camelizedKey](true);

			extension.events.trigger('storage-changed', { key, value });
			extension.messages.send({ action: 'storage-changed', camelizedKey, key, value });
		}
	});
};

/**
 * @see {@linkcode extension.storage.load} in `ref.d.ts`
 * @param {() => void} [callback]
 */
extension.storage.load = function (callback) {
	chrome.storage.local.get(null, items => {
		for (const key in items) {
			const value = items[key];

			this.data[key] = value;
			document.documentElement.setAttribute('it-' + satus.toDashCase(key), value);
		}

		extension.events.trigger('storage-loaded');
		extension.messages.send({ action: 'storage-loaded', storage: items });

		callback?.();
	});
};
