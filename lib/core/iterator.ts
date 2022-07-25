import { IIterator, ITeratorConfig } from "../types";

/**
 * @description Iterator allows sequential traversal through a complex data structure without exposing its internal details.
 * Make any array an iterator using this class.
 */
 export class Iterator<T> implements IIterator<T> {
	private currentIndex: number;
	private readonly items: Array<T>;
	private lastCommand: 'next' | 'prev' | 'none';
	private readonly returnCurrentOnReversion: boolean;
	private readonly restartOnFinish: boolean;

	private constructor(config?: ITeratorConfig<T>) {
		this.currentIndex = -1;
		this.items = config?.initialData ?? [];
		this.lastCommand = 'none';
		this.returnCurrentOnReversion = !!config?.returnCurrentOnReversion;
		this.restartOnFinish = !!config?.restartOnFinish;
	}

	/**
	 * initialData?: Array<T>;
    returnCurrentOnReversion?: boolean;
    restartOnFinish?: boolean;
	 */

	/**
	 * 
	 * @param config Iterator setup as object.
	 * @param config.initialData the initial state as Array<T> to turn iterable.
	 * @param config.returnCurrentOnReversion this setting allows you to return the current element when you are iterating in one direction and decide to change the iteration to the other direction.
	 * @param config.restartOnFinish this configuration turns the iteration into an infinite loop, as when reaching the last element, the iteration starts over from the first element.
	 * @returns instance of Iterator.
	 */
	public static create<U>(config?: ITeratorConfig<U>): Iterator<U> {
		return new Iterator<U>(config);
	}

	/**
	 * @description Remove one item if found
	 * @param item to be removed
	 */
	removeItem(item: T) : void {
		const index = this.items.findIndex((value) => JSON.stringify(item) === JSON.stringify(value));
		if (index !== -1) {
			this.items.splice(index, 1);
			if (index >= this.currentIndex) this.prev();
		}
	}

	/**
	 * @description This method check if has some elements after current position.
	 * @returns boolean `true` if has next element and `false` if not.
	 */
	hasNext(): boolean {
		if (this.isEmpty()) return false;
		return (this.currentIndex + 1) < this.items.length;
	}
	/**
	 * @description This method check if has some elements before current position.
	 * @returns boolean `true` if has next element and `false` if not.
	 */
	hasPrev(): boolean {
		if (this.isEmpty()) return false;
		return (this.currentIndex - 1) >= 0;
	}
	/**
	 * @description This method check if current data state is empty.
	 * @returns boolean `true` if is empty and `false` if not.
	 */
	isEmpty(): boolean {
		return this.total() === 0;
	}

	/**
	 * @description This method get the element on current position. Alway start on first element.
	 * @returns element on current position and update cursor to the next element.
	 * 
	 * @access if param `config.restartOnFinish` is set to `true` and cursor is on last element the next one will be the first element on state, case value is set to `false` the next element will be `null`.
	 */
	next(): T {
		if (this.hasNext()) {
			if (this.lastCommand === 'prev' && this.currentIndex === 0) {
				this.lastCommand = 'next';
				return this.items[this.currentIndex];
			}
			const next = (this.currentIndex + 1);
			this.currentIndex = next;
			this.lastCommand = this.returnCurrentOnReversion ? 'next' : 'none';
			return this.items[next];
		};
		if (!this.restartOnFinish) return null as unknown as T;
		this.toFirst();
		return this.first();
	}
	/**
	 * @description This method get the element on current position. Alway start on first element.
	 * @returns element on current position and update cursor to the previous element.
	 * 
	 * @access if param `config.restartOnFinish` is set to `true` and cursor is on first element the previous one will be the last element on state, case value is set to `false` the previous element will be `null`.
	 */
	prev(): T {
		if (this.hasPrev()) {
			if (this.lastCommand === 'next' && this.currentIndex === this.total() - 1) {
				this.lastCommand = 'prev';
				return this.items[this.currentIndex];
			}
			const prev = (this.currentIndex - 1);
			this.currentIndex = prev;
			this.lastCommand = this.returnCurrentOnReversion ? 'prev' : 'none';
			return this.items[prev];
		};
		if (!this.restartOnFinish) return null as unknown as T;
		this.toLast();
		return this.last();
	}

	/**
	 * @description Get element.
	 * @returns the first element on state.
	 */
	first(): T {
		return this.items.at(0) as T;
	}

	/**
	 * @description Get element.
	 * @returns the last element on state.
	 */
	last(): T {
		return this.items.at(-1) as T;
	}

	/**
	 * @description Update cursor to the first element on state.
	 * @returns instance of iterator.
	 */
	toFirst(): Iterator<T> {
		if (this.currentIndex === 0 || this.currentIndex === -1) {
			this.currentIndex = -1;
			return this;
		}
		this.currentIndex = 0;
		return this;
	}

	/**
	 * @description Update cursor to the last element on state.
	 * @returns instance of iterator.
	 */
	toLast(): Iterator<T> {
		if (this.currentIndex === this.total() - 1 || this.currentIndex === -1) {
			this.currentIndex = this.total();
			return this;
		}
		this.currentIndex = this.total() - 1;
		return this;
	}

	/**
	 * @description Delete state. Remove all elements on state 
	 * @returns instance of iterator.
	 */
	clear(): Iterator<T> {
		this.items.splice(0, this.total())
		this.currentIndex = -1;
		return this;
	}

	/**
	 * @description Add new element to state after last position.
	 * @param data as element.
	 * @returns instance of iterator.
	 */
	addToEnd(data: T): Iterator<T> {
		this.items.push(data);
		return this;
	}

	/**
	 * @description Add new element to state after last position.
	 * @param data as element.
	 * @returns instance of iterator.
	 */
	add(data: T): Iterator<T> {
		return this.addToEnd(data);
	}

	/**
	 * @description Add new element to state before first position.
	 * @param data as element.
	 * @returns instance of iterator.
	 */
	addToStart(data: T): Iterator<T> {
		this.currentIndex = -1;
		this.items.unshift(data);
		return this;
	}

	/**
	 * @description Remove the last element from state.
	 * @returns instance of iterator.
	 */
	removeLast(): Iterator<T> {
		if (this.currentIndex >= this.total()) this.currentIndex -= 1;
		this.items.pop();
		return this;
	}

	/**
	 * @description remove the first element from state.
	 * @returns instance of iterator.
	 */
	removeFirst(): Iterator<T> {
		if (this.currentIndex > 0) this.currentIndex -= 1;
		this.items.shift();
		return this;
	}

	/**
	 * @description Create a new instance of Iterator and keep current state.
	 * @returns a new instance of Iterator with state.
	 */
	clone(): IIterator<T> {
		return Iterator.create({
			initialData: this.toArray(),
			restartOnFinish: this.restartOnFinish,
			returnCurrentOnReversion: this.returnCurrentOnReversion
		})
	}
	/**
	 * @description Get elements on state as array.
	 * @returns array of items on state.
	 */
	toArray(): Array<T> {
		return [...this.items];
	}

	/**
	 * @description Count total of items on state.
	 * @returns total of items on state.
	 */
	total(): number {
		return this.items.length;
	}
 }

export default Iterator;
