import Operation from "../Operation.js";

export default class MathOperation extends Operation {
	precedence = OperationPrecedence.low;

	#backupValue = "";

	undo() {
		if (this.#backupValue.length > 0) {
			this.calculator.value = this.#backupValue;
			this.#backupValue = "";
		}
	}

	saveBackup() {
		this.#backupValue = this.calculator.value;
	}
}

// enum emulation, since we're not allowed to use TypeScript:(
export class OperationPrecedence {
	static low = 0;
	static high = 1;
};
