export interface IResult<T, D = string, M = {}> {
	value(): T;
	error(): D;
	isFailure(): boolean;
	isSuccess(): boolean;
	metaData(): M;
	toObject(): IResultObject<T, D, M>;
}

export interface IDomainID<T> {

	toShort(): IDomainID<T>;

	get value(): T;

	get isNew(): boolean;

	get createdAt(): Date;

	isShortID(): boolean;

	equal(id: IDomainID<T>): boolean;
	
	deepEqual(id: IDomainID<T>): boolean;

	cloneAsNew(): IDomainID<T>;

	clone(): IDomainID<T>;
}

export interface ITeratorConfig<T> {
	initialData?: Array<T>;
	returnCurrentOnReversion?: boolean;
	restartOnFinish?: boolean;
}

export interface IIterator<T> {
	hasNext(): boolean;

	hasPrev(): boolean;

	next(): T;

	prev(): T;

	first(): T;

	last(): T;

	isEmpty(): boolean;

	toFirst(): IIterator<T>;

	toLast(): IIterator<T>;

	toArray(): Array<T>;

	clear(): IIterator<T>;

	addToEnd(data: T): IIterator<T>;

	add(data: T): IIterator<T>;

	addToStart(data: T): IIterator<T>;

	removeLast(): IIterator<T>;

	removeFirst(): IIterator<T>;

	total(): number;
}

export type IResultOptions = 'fail' | 'success';

export interface ICommand<A, B> {
	execute(data: A): B;
}

export type IUseCase<T, D> = ICommand<T, Promise<D>>;

export interface IProxy<T, D> {
	canExecute:<A extends T>(data: A) => Promise<boolean> | boolean;
	beforeExecute?:<A extends T, B extends T>(data: A) => Promise<B>;
	execute: ICommand<T, D>;
	afterExecute?:<A extends D, B extends D>(data: A) => Promise<B>;
}

export interface GetterAndSetterSettings {
	deactivateGetters?: boolean;
	deactivateSetters?: boolean;
	className?: string;
}

export interface IResultObject<T, D, M> {
	isSuccess: boolean;
	isFailure: boolean;
	data: T | null;
	error: D | null;
	metaData: M;
}

export interface IResultHook<Y> {
	on(option: IResultOptions): Y | undefined;
}

export interface IResultExecute<X, Y> extends IResultHook<Y> {
	withData(data: X): IResultHook<Y>;
}
