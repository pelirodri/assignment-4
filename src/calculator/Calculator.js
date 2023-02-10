import MathBinaryOperation from "./operations/math/MathBinaryOperation.js";
import Stack from "../util/Stack.js";

export default class Calculator {
	static FloatingPointPrecision = 4;

	shouldClearValue = false;
	pendingOperations = new Stack();
	activeOperationDidUpdate = () => {};

	#value = "";
	#maxValueLength = NaN;
	#_activeOperation = null;
	#lastActiveOperation = null;
	#lastExecutedBinaryOperation = null;

	#setDisplayValue = () => {};

	get value() {
		return this.#value;
	}

	set value(newValue) {
		if (this.#value !== newValue) {
			this.#value = newValue;
			this.#setDisplayValue(newValue);
		}
	}

	get number() {
		return Number(this.value.replace("−", "-"));
	}

	set number(newNumber) {
		if (isNaN(newNumber)) {
			this.value = "¯\\_(ツ)_/¯";
			return;
		}

		let newValue = String(newNumber.roundToPrecision(Calculator.FloatingPointPrecision));

		if (newValue.length > this.#maxValueLength) {
			newValue = newNumber.toLocaleString("en-US", { notation: "scientific" });
			this.shouldClearValue = true;
		}

		this.value = newValue.replace("-", "−");
	}

	get activeOperation() {
		return this.#_activeOperation;
	}

	set #activeOperation(newActiveOperation) {
		if (this.activeOperation !== newActiveOperation) {
			this.#_activeOperation = newActiveOperation;
			this.activeOperationDidUpdate();
		}
	}

	constructor(maxValueLength, setDisplayValue) {
		this.#maxValueLength = maxValueLength;
		this.#setDisplayValue = setDisplayValue;

		this.number = 0;
	}

	executeOperation(operation) {
		if (operation instanceof MathBinaryOperation) {
			this.#handleBinaryOperation(operation);
		} else {
			this.#activeOperation = null;
			operation.execute();
		}
	}

	restoreActiveOperation() {
		this.#activeOperation = this.#lastActiveOperation;
	}

	resetActiveOperation() {
		this.#activeOperation = this.#lastActiveOperation = null;
	}

	#handleBinaryOperation(operation) {
		if (!this.pendingOperations.isEmpty() && this.pendingOperations.peek() === this.activeOperation) {
			this.#cancelActiveOperation();
		}

		if (!this.pendingOperations.isEmpty() && this.pendingOperations.peek().precedence >= operation.precedence) {
			this.#executeLastPendingOperation();
		}

		this.#lastActiveOperation = this.activeOperation ?? operation;
		this.#activeOperation = operation;

		operation.leftOperand = this.number;

		this.shouldClearValue = true;
		this.pendingOperations.push(operation);
	}

	#cancelActiveOperation() {
		this.pendingOperations.pop();

		if (this.#lastExecutedBinaryOperation) {
			this.pendingOperations.push(this.#lastExecutedBinaryOperation);

			this.#lastExecutedBinaryOperation.undo();
			this.#lastExecutedBinaryOperation = null;
		}
	}

	#executeLastPendingOperation() {
		const pendingOperation = this.pendingOperations.pop();

		pendingOperation.saveBackup();
		pendingOperation.rightOperand = this.number;
		pendingOperation.execute();

		this.#lastExecutedBinaryOperation = pendingOperation;
	}
}

Number.prototype.roundToPrecision = function(precision) {
	const exponentiatedPrecision = Math.pow(10, precision);
	return Math.round((this + Number.EPSILON) * exponentiatedPrecision) / exponentiatedPrecision;
};
