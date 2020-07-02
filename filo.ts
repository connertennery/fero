const fs = require('fs');
const url = require('url');

import { meta } from './main';
import { trimChar } from './util'

const createDirectory = async (dir: string) => {
	try {
		console.log(`mkdir: ${dir}`);
		const options = { recursive: true };
		await fs.mkdir(dir, options, (err: Error) => {
			if (err) throw err;
		});
	}
	catch (err) {
		console.error(err);
	}
}

const writeFile = async (filePath: string, content: string) => {
	console.log(`wf: ${filePath}`);
	fs.writeFile(filePath, content);
}

const createPaths = async (url: URL) => {
	const base = url.pathname !== '/' ? trimChar(url.pathname, '/') : 'root';
	const dir = `${meta.baseDir}\/${url.hostname}\/${base}`;
	const file = `${dir}\/${url.pathname.substring(url.pathname.lastIndexOf('\/') + 1)}.md`
	return { base, dir, file }
}

export const createPage = async (url: URL, content: string) => {
	const paths = await createPaths(url);
	await createDirectory(paths.dir);
	writeFile(paths.file, content)
}
