import * as https from 'https';
import * as cheerio from 'cheerio';

import { meta } from './main';

/**
 * Crawls a webpage and its links
 * @param url - URL target
 * @param depth - Depth to crawl away from the url
 */
export const crawl = async (url: URL, depth?: number): Promise<{ url: URL, source: string, links: Set<string> }> => {
	if (depth === undefined) depth = 0;

	const parsed: CheerioStatic = await getPage(url);
	const links: Set<string> = await scrapeLinks(parsed);
	const source = parsed('body').html() ?? 'source not found';

	return { url: url, source: source, links: links };
}

/**
 * Downloads then scrubs the source of the given url
 * @param url - URL target
 */
export const getPage = async (url: URL): Promise<CheerioStatic> => {
	return new Promise((resolve, reject) => {
		const get = https.get(url.href, (res: any) => {
			let chonk = '';
			res.setEncoding('utf8');
			res.on('data', (chunk: string) => {
				chonk += chunk;
			});
			res.on('end', () => {
				const parsed = cheerio.load(chonk);
				scrubAttributes(parsed('body')[0]);
				resolve(parsed);
			});
		})
		get.on('error', (e: Error) => {
			console.error(e.message);
			reject(e.message);
		});
	});
};

/**
 * Recursively removes all attributes that are not in meta.allowedAttributes[] from every tag in the element and its siblings and children.
 * @param node Root CheerioElement to be scrubbed
 */
const scrubAttributes = (node: CheerioElement) => {
	const regexNodeValue = /\s{2,}/gm;
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

/**
 * Returns all of the unique <a> links in the given node and its children
 * @param html
 */
const scrapeLinks = async (html: CheerioStatic): Promise<Set<string>> => {
	const links: Set<string> = new Set();
	html('a').each((index: number, element: CheerioElement) => {
		links.add(cheerio(element).attr('href') ?? '');
	});
	links.delete('');
	return links;
}
