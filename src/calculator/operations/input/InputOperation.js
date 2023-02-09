import Operation from "../Operation.js";

export default class InputOperation extends Operation {
	maxValueLength = NaN;

	constructor(calculator, maxValueLength, symbol = undefined) {
		super(calculator, symbol);
		this.maxValueLength = maxValueLength;
	}
}
