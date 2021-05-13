export default class Helpers {
	/** @deprecated */
	static fillHexString (input: string): string {
		if (input.length == 1) {
			return `0${input}`;
		}
		
		return input;
	}
}