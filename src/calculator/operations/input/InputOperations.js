import InputOperation from "./InputOperation.js";

export class DigitInputOperation extends InputOperation {
	execute() {
		if (this.calculator.shouldClearValue) {
			this.calculator.value = "";
			this.calculator.shouldClearValue = false;
		}

		if (this.calculator.value.length < this.maxValueLength) {
			this.calculator.number = Number(this.calculator.value + this.symbol);
		}
	}
}

export class DecimalInputOperation extends InputOperation {
	symbol = ".";

	execute() {
		if (this.calculator.value.length < (this.maxValueLength - 1) &&
			(this.calculator.value.indexOf(".") === -1 && this.calculator.number !== 0)) {
			this.calculator.value += ".";
		}
	}
}

export class SignInputOperation extends InputOperation {
	symbol = "±";
	
	execute() {
		if (this.calculator.value.length < this.maxValueLength && this.calculator.number !== 0) {
			this.calculator.number *= -1;
		}
	}
}