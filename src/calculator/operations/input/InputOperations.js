import InputOperation from "./InputOperation.js";

export class DigitInputOperation extends InputOperation {
	execute() {
		if (this.calculator.shouldClearValue) {
			this.calculator.value = "";
			this.calculator.shouldClearValue = false;
		}

		if (this.calculator.value.length < this.maxValueLength) {
			if (this.calculator.value === "0") {
				this.calculator.value = this.symbol;
			} else {
				this.calculator.value = this.calculator.value + this.symbol;
			}
		}
	}
}

export class DecimalInputOperation extends InputOperation {
	symbol = ".";

	execute() {
		if (this.calculator.value.length < (this.maxValueLength - 1) &&
			(this.calculator.value.indexOf(".") === -1 && !isNaN(this.calculator.number))) {
			this.calculator.value += ".";
		}
	}
}

export class SignInputOperation extends InputOperation {
	symbol = "±";
	
	execute() {
		if (this.calculator.value.length < this.maxValueLength && this.calculator.number) {
			this.calculator.number *= -1;
		}
	}
}