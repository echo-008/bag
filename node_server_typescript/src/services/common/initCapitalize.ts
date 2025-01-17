export const initCapitalize = (text: string): string => {
	try {
		return text.replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase());
	} catch (err) {
		throw err;
	}
};
