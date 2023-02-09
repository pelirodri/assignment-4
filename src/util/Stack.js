export default class Stack {
	#elements = [];

	get size() {
		return this.#elements.length;
	}

	push(element) {
		this.#elements.push(element);
	}

	pop() {
		return this.#elements.pop();
	}

	peek() {
		return this.#elements[this.#elements.length - 1];
	}

	isEmpty() {
		return this.#elements.length === 0;
	}

	clear() {
		this.#elements = [];
	}
}
