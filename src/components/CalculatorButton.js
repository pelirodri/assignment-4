export default class CalculatorButton extends HTMLButtonElement {
	static #scaleAttributeName = "scale";
	static #borderColorAttributeName = "color";
	static #darkModeBorderColorAttributeName = "dark-mode-color";

	static #ButtonClickFilePath = "src/assets/button-click.wav";

	operation = null;

	#scale = 1;
	#borderColor = "#000";
	#darkModeBorderColor = "#fff";

	#radius = 50;
	#isActive = false;
	#darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");	
	#audioContext = null;
	#audioBuffer = null;

	set isActive(newIsActive) {
		if (this.#isActive !== newIsActive) {
			this.#isActive = newIsActive;
			this.#isActive ? this.#highlight() : this.#stopHighlighting();
		}	
	}

	constructor(operation, radius = undefined) {
		super();

		this.operation = operation;
		this.#radius = radius ?? this.#radius;

		this.textContent = this.operation.symbol;

		this.#setUpEvents();
	}

	connectedCallback() {
		this.#initAttributeProperties();
		this.#setUpStyle();
	}

	playSound() {
		if (this.#audioContext && this.#audioBuffer) {
			const bufferSource = this.#audioContext.createBufferSource();

			bufferSource.buffer = this.#audioBuffer;

			bufferSource.connect(this.#audioContext.destination);
			bufferSource.start();
		}
	}

	async prepareForSoundPlayback() {
		this.#audioContext = new AudioContext();
		this.#audioContext.resume();

		const wavFile = await fetch(CalculatorButton.#ButtonClickFilePath);
		this.#audioBuffer = await this.#audioContext.decodeAudioData(await wavFile.arrayBuffer());
	}

	#initAttributeProperties() {
		this.#scale = this.getAttribute(CalculatorButton.#scaleAttributeName) ?? this.#scale;
		this.#borderColor = this.getAttribute(CalculatorButton.#borderColorAttributeName) ?? this.#borderColor;

		this.#darkModeBorderColor = this.getAttribute(CalculatorButton.#darkModeBorderColorAttributeName) ??
			this.#darkModeBorderColor;
	}

	#setUpStyle() {
		this.style.width = this.style.height = `${this.#radius * this.#scale}px`;
		this.style.background = "transparent";
		this.style.border = "2px solid";
		this.style.borderRadius = "50%";
		this.style.cursor = "pointer";
		this.style.fontSize = `${1.5 * this.#scale}rem`;

		this.#updateColors();
	}

	#setUpEvents() {
		this.onmouseenter = this.ontouchstart = this.#handleMouseEnter;
		this.onmouseleave = this.ontouchend = this.#handleMouseLeave;

		this.onmousedown = this.ontouchstart = this.#scaleUp;
		this.onmouseup = this.ontouchend = this.#scaleBackDown;

		this.#darkModeMediaQuery.onchange = () => {
			this.#updateColors();
		};
	}

	#updateColors() {
		this.style.borderColor = this.#darkModeMediaQuery.matches ? this.#darkModeBorderColor : this.#borderColor;
		this.style.color = this.#darkModeMediaQuery.matches ? "#fff" : "#000";
	}

	#handleMouseEnter() {
		if (!this.#isActive) {
			this.#highlight();
		}
	}

	#handleMouseLeave() {
		if (!this.#isActive) {
			this.#stopHighlighting();
		}
	}

	#scaleUp() {
		this.style.transform = "scale(1.1, 1.1)";
	}

	#scaleBackDown() {
		this.style.transform = "scale(1, 1)";
	}

	#highlight() {
		this.style.color = this.#darkModeMediaQuery.matches ? "#000" : "#fff";
		this.style.background = this.#darkModeMediaQuery.matches ? this.#darkModeBorderColor : this.#borderColor;
	}

	#stopHighlighting() {
		this.style.color = this.#darkModeMediaQuery.matches ? "#fff" : "#000";
		this.style.background = "transparent";
	}
}
