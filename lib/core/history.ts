import { IHistory, IHistoryProps, IIterator, UID } from "../types";
import ID from "./id";
import Iterator from "./iterator";


/**
 * @description Manage state props as history.
 */
 export class History<Props> implements IHistory<Props> {
	private readonly iterator: IIterator<IHistoryProps<Props>>;

	constructor(props?: IHistoryProps<Props>) {
		let _props = props ? Object.assign({}, { ...props }, { action: 'create' }): undefined;
		_props = _props ? Object.assign({}, { ..._props }, { token: ID<string>.short() }): undefined;
		_props = _props ? Object.assign({}, { ..._props }, { ocurredAt: new Date() }): undefined;

		this.iterator = Iterator.create({
			initialData: _props ? [_props]: [],
			restartOnFinish: false,
			returnCurrentOnReversion: true
		});
	}

	/**
	 * 
	 * @param token ID as token.
	 * @returns true if token already exists for some prop state on history and false if not.
	 */
	private tokenAlreadyExists(token: UID<string>): boolean {
		const iterate = this.iterator.clone();
		iterate.toLast();
		while (iterate.hasPrev()) {
			const prev = iterate.prev();
			if (token.equal(prev.token!)) return true;
		}
		return false;
	}

	/**
	 * @description Get all props on state as history.
	 * @returns a list of props on state.
	 */
	list(): IHistoryProps<Props>[] {
		return this.iterator.toArray();
	}
	/**
	 * @description Create a new snapshot from current state.
	 * @param props as object to be pushed into history.
	 * @returns props pushed.
	 */
	snapshot(props: IHistoryProps<Props>): IHistoryProps<Props> {
		const token = props.token?.toShort() ?? ID<string>.short();
		const tokenAlreadyExists = (this.tokenAlreadyExists(token));
		props.token = tokenAlreadyExists ? ID<string>.short() : token;
		const ocurredAt = props.ocurredAt ?? new Date();
		props.ocurredAt = ocurredAt;
		this.iterator.add(props);
		this.iterator.toLast();
		return props;
	}
	/**
	 * @description Get previous props state and apply to instance.
	 * @param token a 16bytes value to identify the target state on history.
	 * @returns previous state found or null if not found.
	 */
	back(token?: ID<string>): IHistoryProps<Props> {
		this.iterator.prev();
		
		if (token) {
			this.iterator.toLast();
			while (this.iterator.hasPrev()) {
				const prev = this.iterator.prev();
				if (prev.token?.equal(token)) return prev;
			}
		}

		if (this.iterator.hasPrev()) return this.iterator.prev();

		this.iterator.toFirst();
		return this.iterator.first();
	}

	/**
	 * @description Get next props state and apply to instance.
	 * @param token a 16bytes value to identify the target state on history.
	 * @returns next state found or null if not found.
	 */
	forward(token?: ID<string>): IHistoryProps<Props> {
		this.iterator.next();

		if (token) {
			this.iterator.toFirst();
			while (this.iterator.hasNext()) {
				const next = this.iterator.next();
				if (next.token?.equal(token)) return next;
			}
		}
		
		if (this.iterator.hasNext()) return this.iterator.next();

		this.iterator.toLast();
		return this.iterator.last();
	}

	/**
	 * @description Get total of props on state as history.
	 * @returns total of props on state.
	 */
	count(): number {
		return this.iterator.total();
	}

 }
export default History;
