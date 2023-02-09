import Calculator from "../Calculator.js";

export default class Operation {
	calculator = null;
	symbol = "";

	constructor(calculator, symbol = undefined) {
		if (!(calculator instanceof Calculator)) {
			throw new Error("Unexpected type of `calculator`");
		}

		this.calculator = calculator;

		if (symbol) {
			this.symbol = symbol;
		}
	}

	execute() {
		throw new Error("This method needs to be implemented in subclasses");
	}
}
