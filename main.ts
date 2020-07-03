import { getPage } from './duck'
import { createPage } from './filo';
import { trimChar } from './util';

export const meta = {
	baseDir: 'sites',
	url: new URL('https://www.pcgamer.com/space-odyssey-our-first-big-look-at-kerbal-space-program-2/'),
	allowedAttribs: ['href']
}

//Sample urls
const urls: string[] = [
	'https://www.polygon.com/2020/7/2/21310396/last-of-us-2-accessibility-vision-difficulty-gameplay-opinions',
	'https://www.polygon.com/2020/7/2/21311791/warrior-nun-review-netflix-fantasy-series-ben-dunn-comic',
	'https://www.polygon.com/2020/7/2/21308672/best-movies-2020-streaming-netflix-hulu-amazon',
	'https://www.polygon.com/2020/7/2/21310617/animal-crossing-new-horizons-abanoned-island-summer-update',
]


urls.forEach(url => {
	let curl = new URL(trimChar(url, '/'));
	getPage(curl).then((capture: { url: URL, source: string }) => {
		createPage(capture.url, capture.source);
	});
});
