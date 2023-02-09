import Operation from "./Operation.js";
import MathBinaryOperation from "./math/MathBinaryOperation.js";

export class AllClearOperation extends Operation {
	symbol = "AC";

	execute() {
		this.calculator.number = 0;

		this.calculator.pendingOperations.clear();
		this.calculator.resetActiveOperation();
	}
}

export class ClearOperation extends Operation {
	symbol = "C";

	execute() {
		this.calculator.number = 0;
		this.calculator.restoreActiveOperation();
	}
}

export class DeleteOperation extends Operation {
	symbol = "⌫";

	execute() {
		if (this.calculator.number !== 0) {
			this.calculator.number = Number(this.calculator.value.slice(0, -1).replace("−", "-")) || 0;

			if (this.calculator.number === 0) {
				this.calculator.restoreActiveOperation();
			}
		}
	}
}

export class EqualOperation extends Operation {
	symbol = "=";

	execute() {
		while (!this.calculator.pendingOperations.isEmpty()) {
			const operation = this.calculator.pendingOperations.pop();

			if (operation instanceof MathBinaryOperation) {
				operation.rightOperand = this.calculator.number;
			}

			operation.execute();
		}

		this.calculator.resetActiveOperation();
	}
}
