import OperationType from "./OperationType.js";
import InputOperationType from "./input/InputOperationType.js";
import MathOperationType from "./math/MathOperationType.js";

import * as operations from "./Operations.js";
import * as inputOperations from "./input/InputOperations.js";
import * as mathOperations from "./math/MathBinaryOperations.js";

export default class OperationFactory {
	static createOperationForCalculator(calculator, operationType) {
		switch (operationType) {
			case OperationType.allClear:
				return new operations.AllClearOperation(calculator);
			case OperationType.clear:
				return new operations.ClearOperation(calculator);
			case OperationType.delete:
				return new operations.DeleteOperation(calculator);
			case OperationType.equal:
				return new operations.EqualOperation(calculator);
		}
	}

	static createInputOperationForCalculator(calculator, inputOperationType, maxValueLength, symbol = undefined) {
		switch (inputOperationType) {
			case InputOperationType.digit:
				return new inputOperations.DigitInputOperation(calculator, maxValueLength, symbol);
			case InputOperationType.decimal:
				return new inputOperations.DecimalInputOperation(calculator, maxValueLength);
			case InputOperationType.sign:
				return new inputOperations.SignInputOperation(calculator, maxValueLength);
		}
	}

	static createMathOperationForCalculator(calculator, mathOperationType) {
		switch (mathOperationType) {
			case MathOperationType.add:
				return new mathOperations.AddMathOperation(calculator);
			case MathOperationType.subtract:
				return new mathOperations.SubtractMathOperation(calculator);
			case MathOperationType.multiply:
				return new mathOperations.MultiplyMathOperation(calculator);
			case MathOperationType.divide:
				return new mathOperations.DivideMathOperation(calculator);
		}
	}
}
