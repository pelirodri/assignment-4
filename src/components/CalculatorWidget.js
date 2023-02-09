import CalculatorDisplay from "./CalculatorDisplay.js";
import CalculatorButton from "./CalculatorButton.js";

import Calculator from "../calculator/Calculator.js";

import OperationFactory from "../calculator/operations/OperationFactory.js";

import OperationType from "../calculator/operations/OperationType.js";
import InputOperationType from "../calculator/operations/input/InputOperationType.js"
import MathOperationType from "../calculator/operations/math/MathOperationType.js";

customElements.define("calculator-display", CalculatorDisplay, { extends: "input" });
customElements.define("calculator-button", CalculatorButton, { extends: "button" });

export default class CalculatorWidget extends HTMLElement {
	static #scaleAttributeName = "scale";
	static #isMutedAttributeName = "muted";

	static #buttonRadius = 50;
	static #maxValueLength = 12;

	static #lightYellowColor = "#ffff1a";
	static #lightBlueColor = "#1a1aff";
	static #lightRedColor = "#ff1a1a";

	static #darkYellowColor = "#e6e600";
	static #darkBlueColor = "#0000e6";
	static #darkRedColor = "#e60000";

	#calculator = null;
	#calculatorDisplay = null;

	#calculatorWrapper = null;
	#secondaryButtonsWrapper = null;
	#inputButtonsWrapper = null;
	#primaryButtonsWrapper = null;

	#scale = 1;
	#isMuted = false;

	#activeButton = null;
	#darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

	get #secondaryOperations() {
		return [
			OperationFactory.createOperationForCalculator(this.#calculator, OperationType.allClear),
			OperationFactory.createOperationForCalculator(this.#calculator, OperationType.clear),
			OperationFactory.createOperationForCalculator(this.#calculator, OperationType.delete)
		];
	}

	get #inputOperations() {
		return [
			...this.#createDigitInputOperationsFromSymbols(["7", "8", "9", "4", "5", "6", "1", "2", "3", "0"]),
			OperationFactory.createInputOperationForCalculator(
				this.#calculator,
				InputOperationType.decimal,
				CalculatorWidget.#maxValueLength
			),
			OperationFactory.createInputOperationForCalculator(
				this.#calculator,
				InputOperationType.sign,
				CalculatorWidget.#maxValueLength
			)
		];
	}

	get #primaryOperations() {
		return [
			OperationFactory.createMathOperationForCalculator(this.#calculator, MathOperationType.divide),
			OperationFactory.createMathOperationForCalculator(this.#calculator, MathOperationType.multiply),
			OperationFactory.createMathOperationForCalculator(this.#calculator, MathOperationType.subtract),
			OperationFactory.createMathOperationForCalculator(this.#calculator, MathOperationType.add),
			OperationFactory.createOperationForCalculator(this.#calculator, OperationType.equal)
		];
	}

	get #buttonGap() {
		return (CalculatorWidget.#buttonRadius * this.#scale) / 10;
	}

	constructor() {
		super();

		this.#calculatorDisplay = this.#createCalculatorDisplay();

		this.#calculator = this.#createCalculatorWithDisplayAndMaxLength(
			this.#calculatorDisplay,
			CalculatorWidget.#maxValueLength
		);

		this.attachShadow({ mode: "open" });

		this.#initAttributeProperties();
		this.#appendElements();
		this.#setUpEvents();
	}

	connectedCallback() {
		this.#styleCalculatorWrapper();
		this.#styleSecondaryButtonsWrapper();
		this.#styleInputButtonsWrapper();
		this.#stylePrimaryButtonsWrapper();
		this.#styleCalculatorDisplay();

		this.#updateColors();
	}

	#createCalculatorDisplay() {
		return new CalculatorDisplay();
	}

	#createCalculatorWithDisplayAndMaxLength(calculatorDisplay, maxValueLength) {
		return new Calculator(maxValueLength, calculatorValue => calculatorDisplay.value = calculatorValue);
	}

	#initAttributeProperties() {
		this.#scale = this.getAttribute(CalculatorWidget.#scaleAttributeName) ?? this.#scale;
		this.#isMuted = this.getAttribute(CalculatorWidget.#isMutedAttributeName) ?? this.#isMuted;
	}

	#activeOperationDidUpdate() {
		if (this.#activeButton) {
			this.#activeButton.isActive = false;
		}

		if (this.#calculator.activeOperation) {
			const allButtons = [
				...this.#secondaryButtonsWrapper.children,
				...this.#inputButtonsWrapper.children,
				...this.#primaryButtonsWrapper.children
			];

			const activeButton = allButtons.find(button => button.operation === this.#calculator.activeOperation)

			activeButton.isActive = true;
			this.#activeButton = activeButton;
		}
	}

	#appendElements() {
		this.#calculatorWrapper = this.shadowRoot.appendChild(document.createElement("div"));
		this.#calculatorWrapper.appendChild(this.#calculatorDisplay);

		this.#appendButtons();
	}

	#appendButtons() {
		this.#secondaryButtonsWrapper = this.#calculatorWrapper.appendChild(
			this.#wrapButtonsFromOperations(
				this.#secondaryOperations,
				CalculatorWidget.#darkYellowColor,
				CalculatorWidget.#lightYellowColor
			)
		);

		this.#inputButtonsWrapper = this.#calculatorWrapper.appendChild(
			this.#wrapButtonsFromOperations(
				this.#inputOperations,
				CalculatorWidget.#darkBlueColor,
				CalculatorWidget.#lightBlueColor
			)
		);

		this.#primaryButtonsWrapper = this.#calculatorWrapper.appendChild(
			this.#wrapButtonsFromOperations(
				this.#primaryOperations,
				CalculatorWidget.#darkRedColor,
				CalculatorWidget.#lightRedColor
			)
		);
	}

	#setUpEvents() {
		this.#calculator.activeOperationDidUpdate = () => {
			this.#activeOperationDidUpdate();
		};

		this.#darkModeMediaQuery.onchange = () => {
			this.#updateColors();
		};
	}

	#styleCalculatorWrapper() {
		this.#calculatorWrapper.style.display = "grid";
		this.#calculatorWrapper.style.gridTemplateRows = `${45 * this.#scale}px auto auto`;
		this.#calculatorWrapper.style.justifyContent = "end";
		this.#calculatorWrapper.style.gap = `${this.#buttonGap}px`;		
		this.#calculatorWrapper.style.border = "3px solid";
		this.#calculatorWrapper.style.borderRadius = "25px";
		this.#calculatorWrapper.style.padding = `${this.#buttonGap * 1.5}px`;
		this.#calculatorWrapper.style.paddingLeft = `${this.#buttonGap * 2.25}px`;
	}

	#styleCalculatorDisplay() {
		this.#calculatorDisplay.style.gridArea = "1 / 1 / 2 / 4";
		this.#calculatorDisplay.style.width = getComputedStyle(this.#calculatorDisplay).width;
		this.#calculatorDisplay.style.fontSize = `${1.75 * this.#scale}rem`;
		this.#calculatorDisplay.style.marginBottom = `${this.#buttonGap * 2}px`;
	}

	#styleSecondaryButtonsWrapper() {
		this.#secondaryButtonsWrapper.style.gridArea = "2 / 1 / 3 / 2";
		this.#secondaryButtonsWrapper.style.display = "grid";
		this.#secondaryButtonsWrapper.style.gridTemplateColumns = "repeat(3, 1fr)";
		this.#secondaryButtonsWrapper.style.columnGap = `${this.#buttonGap}px`;
	}

	#styleInputButtonsWrapper() {
		this.#inputButtonsWrapper.style.gridArea = "3 / 1 / 4 / 2";
		this.#inputButtonsWrapper.style.display = "grid";
		this.#inputButtonsWrapper.style.gap = `${this.#buttonGap}px`;

		this.#inputButtonsWrapper.style.gridTemplateColumns = `
			repeat(3, ${CalculatorWidget.#buttonRadius * this.#scale}px)
		`;
	}

	#stylePrimaryButtonsWrapper() {
		this.#primaryButtonsWrapper.style.gridArea = "2 / 2 / 4 / 3";
		this.#primaryButtonsWrapper.style.display = "flex";
		this.#primaryButtonsWrapper.style.flexDirection = "column";
		this.#primaryButtonsWrapper.style.rowGap = `${this.#buttonGap}px`;
	}

	#updateColors() {
		this.#calculatorWrapper.style.borderColor = this.#darkModeMediaQuery.matches ? "#fff" : "#000";
	}

	#wrapButtonsFromOperations(operations, color = undefined, darkModeColor = undefined) {
		const buttonsWrapper = document.createElement("div");

		for (const operation of operations) {
			buttonsWrapper.appendChild(this.#createButtonWithOperation(operation, color, darkModeColor));
		}

		return buttonsWrapper;
	}

	#createButtonWithOperation(operation, color = undefined, darkModeColor = undefined) {
		const calculatorButton = new CalculatorButton(operation, CalculatorWidget.#buttonRadius);

		calculatorButton.setAttribute("scale", this.#scale);

		if (CSS.supports("color", color)) {
			calculatorButton.setAttribute("color", color);
		}

		if (CSS.supports("color", darkModeColor)) {
			calculatorButton.setAttribute("dark-mode-color", darkModeColor);
		}

		if (!this.#isMuted) {
			calculatorButton.prepareForSoundPlayback();
		}

		calculatorButton.onclick = () => {
			this.#buttonWasPressed(calculatorButton);
		};

		return calculatorButton;
	}

	#buttonWasPressed(button) {
		if (!this.#isMuted) {
			button.playSound();
		}
		
		this.#calculator.executeOperation(button.operation);
	}

	#createDigitInputOperationsFromSymbols(symbols) {
		return symbols.map(symbol =>
			OperationFactory.createInputOperationForCalculator(
				this.#calculator,
				InputOperationType.digit,
				CalculatorWidget.#maxValueLength,
				symbol
			)
		);
	}
}
