export default class Helpers {
	static fillHexString (input: string): string {
		if (input.length == 1) {
			return `0${input}`;
		}
		
		return input;
	}
}