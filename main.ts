const https = require('https');
const nurl = require('url');
const fs = require('fs');
const cheerio = require('cheerio');
////////////////////////////////////////////////////////////////
import { createPage } from './filo';

const timings = { tStart: 0, tEnd: 0, pStart: 0, pEnd: 0 };
timings.tStart = Date.now();

export const meta = {
	baseDir: 'sites',
	url: new URL('https://www.pcgamer.com/space-odyssey-our-first-big-look-at-kerbal-space-program-2/'),
	allowedAttribs: ['href']
}

const get = https.get(meta.url.href, (res: any) => {
	let chonk: string = '';
	res.setEncoding('utf8');
	res.on('data', (chunk: string) => {
		chonk += chunk;
	});
	res.on('end', () => {
		const parsed = cheerio.load(chonk, { normalizeWhiteSpace: true });

		timings.pStart = Date.now();
		scrubAttributes(parsed('body')[0]);
		timings.pEnd = Date.now();

		createPage(meta.url, parsed('body').html());

		timings.tEnd = Date.now();

		console.log(`Total time: ${timings.tEnd - timings.tStart}`)
		console.log(`Processing time: ${timings.pEnd - timings.pStart}`)
	});
});

get.on('error', (e: any) => {
	console.error(e);
});



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


