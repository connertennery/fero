import * as url from 'url';
import * as fs from 'fs'

import { meta } from './main';
import { trimChar } from './util'
import { MakeDirectoryOptions } from 'fs';

const createDirectory = async (dir: fs.PathLike) => {
	try {
		console.log(`mkdir: ${dir}`);
		const options: MakeDirectoryOptions = {
			recursive: true,
		};
		fs.mkdir(dir, options, (err: any) => {
			if (err) throw err;
		});
	}
	catch (err) {
		console.error(err);
	}
}

const writeFile = async (filePath: string, content: string) => {
	console.log(`wf: ${filePath}`);
	fs.writeFile(filePath, content, (err: any) => {
		if (err) throw err;
	});
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
