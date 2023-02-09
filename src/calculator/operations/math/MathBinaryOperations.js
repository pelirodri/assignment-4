import MathOperation from "./MathOperation.js";
import MathBinaryOperation from "./MathBinaryOperation.js";

import { OperationPrecedence } from "./MathOperation.js";

export class AddMathOperation extends MathBinaryOperation {
	symbol = "+";
	
	execute() {
		this.calculator.number = this.leftOperand + this.rightOperand;
	}
}

export class SubtractMathOperation extends MathBinaryOperation {
	symbol = "−";
	
	execute() {
		this.calculator.number = this.leftOperand - this.rightOperand;
	}
}

export class MultiplyMathOperation extends MathBinaryOperation {
	symbol = "×";
	precedence = OperationPrecedence.high;
	
	execute() {
		this.calculator.number = this.leftOperand * this.rightOperand;
	}
}

export class DivideMathOperation extends MathBinaryOperation {
	symbol = "÷";
	precedence = OperationPrecedence.high;
	
	execute() {
		if (this.rightOperand === 0) {
			this.calculator.value = "Undefined";
			this.calculator.shouldClearValue = true;
		} else {
			this.calculator.number = this.leftOperand / this.rightOperand;
		}		
	}
}
