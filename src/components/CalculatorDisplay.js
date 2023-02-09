export default class CalculatorDisplay extends HTMLInputElement {
	#darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

	constructor() {
		super();

		this.#darkModeMediaQuery.onchange = () => {
			this.#updateColors();
		};
	}

	connectedCallback() {
		this.#setUpInput();
	}

	#setUpInput() {
		this.#setUpStyle();
		this.setAttribute("readonly", true);
	}

	#setUpStyle() {
		this.style.borderRadius = "50px";
		this.style.border = "2px solid";
		this.style.padding = "10px";

		this.#updateColors();
	}

	#updateColors() {
		this.style.borderColor = this.#darkModeMediaQuery.matches ? "#fff" : "#000";
		this.style.background = this.#darkModeMediaQuery.matches ? "#000" : "#fff";
		this.style.color = this.#darkModeMediaQuery.matches ? "#fff" : "#000";
	}
}
