// const https = require('https');
// const cheerio = require('cheerio');
import * as https from 'https';
import * as cheerio from 'cheerio';

import { meta } from './main';


export const getPage = (url: URL) => {
	let get = https.get(url.href, (res: any) => {
		let chonk: string = '';
		res.setEncoding('utf8');
		res.on('data', (chunk: string) => {
			chonk += chunk;
		});
		res.on('end', () => {
			const parsed = cheerio.load(chonk);
			scrubAttributes(parsed('body')[0]);
		});
	})
	get.on('error', (e: any) => {
		console.error(e);
	});

};




const regexNodeValue = /\s{2,}/gm;
const scrubAttributes = (node: CheerioElement) => {
	if (typeof node.nodeValue === 'string') {
		node.nodeValue = node.nodeValue.trim();
		node.nodeValue = node.nodeValue.replace(regexNodeValue, '');
		console.log(node.nodeValue);
	}

	if (node.attribs) {
		let keys = Object.keys(node.attribs);
		for (let key of keys) {
			if (!meta.allowedAttribs.includes(key))
				delete node.attribs[key];
		}
	}

	if (node.next && node.next.children)
		scrubAttributes(node.next);

	let children = node.children;
	for (let i = 0; i < children.length; i++) {
		let child = children[i];

		if (child.name === 'script') {
			children.splice(i, 1);
			i--;
		}

		if (child.children && child.children.length > 0)
			scrubAttributes(child);
		else if (typeof child.nodeValue === 'string')
			child.nodeValue = child.nodeValue.replace(regexNodeValue, ' ');
	}
}
