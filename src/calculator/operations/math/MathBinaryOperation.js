import MathOperation from "./MathOperation.js";

export default class MathBinaryOperation extends MathOperation {
	leftOperand = NaN;
	rightOperand = NaN;

	constructor(calculator, leftOperand = NaN, rightOperand = NaN, symbol = undefined) {
		super(calculator, symbol);

		this.leftOperand = leftOperand;
		this.rightOperand = rightOperand;
	}
}
