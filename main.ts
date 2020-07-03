
const nurl = require('url');
const fs = require('fs');
////////////////////////////////////////////////////////////////
import { createPage } from './filo';

export const meta = {
	baseDir: 'sites',
	url: new URL('https://www.pcgamer.com/space-odyssey-our-first-big-look-at-kerbal-space-program-2/'),
	allowedAttribs: ['href']
}

// createPage(meta.url, parsed('body').html());
