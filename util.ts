export const trimChar = (str: string, char: string) => {
	let regex = new RegExp(`${char}+`);
	str = str.replace(regex, '');
	regex = new RegExp(`${char}+$`);
	str = str.replace(regex, '');
	return str;
};
