import * as fs from 'fs'

import { meta } from './main';
import { MakeDirectoryOptions } from 'fs';

const createDirectory = async (dir: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		const options: MakeDirectoryOptions = {
			recursive: true,
		};
		fs.mkdir(dir, options, (err: any) => {
			if (err) reject();
			resolve();
		});
	})
}

const writeFile = async (filePath: string, content: string) => {
	fs.writeFile(filePath, content, (err: any) => {
		if (err) throw err;
	});
}

const createPaths = async (url: URL): Promise<{ base: string, dir: string, file: string }> => {
	//TODO Minor cleanup
	const base = url.href.substring(url.protocol.length + 2, url.href.lastIndexOf('/')) //
	const dir = `${meta.baseDir}\/${base}`
	const file = `${dir}\/${url.href.substring(url.href.lastIndexOf('/') + 1)}.md`

	return { base, dir, file }
}

export const createPage = async (url: URL, content: string) => {
	const paths = await createPaths(url);
	createDirectory(paths.dir).then(() => writeFile(paths.file, content));
}
