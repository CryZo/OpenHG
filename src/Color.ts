export default class Color {
	Red: number;
	Green: number;
	Blue: number;

	constructor() {

	}

	Lighten(amount: number) {
		this.Red += amount;
		this.Green += amount;
		this.Blue += amount;

		this.FixColor();
	}

	Darken(amount: number) {
		this.Red -= amount;
		this.Green -= amount;
		this.Blue -= amount;

		this.FixColor();
	}

	FixColor() {
		if (this.Red > 255) this.Red = 255;
		if (this.Green > 255) this.Green = 255;
		if (this.Blue > 255) this.Blue = 255;

		if (this.Red < 0) this.Red = 0;
		if (this.Green < 0) this.Green = 0;
		if (this.Blue < 0) this.Blue = 0;
	}

	SetHexColor(Color: string): void {
		if (Color.substr(0, 1) == '#') {
			Color = Color.substr(1, 6);
		}

		this.Red = parseInt(Color.substr(0, 2), 16)
		this.Green = parseInt(Color.substr(2, 2), 16)
		this.Blue = parseInt(Color.substr(4, 2), 16)
	}
	GetHexColor(): string {
		const fillHexString = (input: string): string => {
			if (input.length == 1) {
				return `0${input}`;
			}
			
			return input;
		}

		let out: string = '';

		out += fillHexString(this.Red.toString(16));
		out += fillHexString(this.Green.toString(16));
		out += fillHexString(this.Blue.toString(16));

		return out;
	}

	SetColors(Red: number, Green: number, Blue: number): void {
		this.Red = Red;
		this.Green = Green;
		this.Blue = Blue;
	}

	SetIntegerColor(Col: number) : void{
		let tmp: string = '000000' + Col.toString(16)
		tmp = tmp.substr(-6);
		this.SetHexColor(tmp);
	}

	static GetBlack(): Color {
		let col = new Color();
		col.SetColors(0, 0, 0);
		return col;
	}
	static GetWhite(): Color {
		let col = new Color();
		col.SetColors(255, 255, 255);
		return col;
	}

	static Parse(color: string): Color {
		let col = new Color();
		col.SetHexColor(color);
		return col;
	}
}