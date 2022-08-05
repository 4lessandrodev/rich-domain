import { IGettersAndSetters, IHistory, IHistoryProps, IParentName, IPublicHistory, ISettings, UID } from "../types";
import { Validator } from "../utils";
import History from "./history";
import ID from "./id";
// import ValueObject from "./value-object";

/**
 * @description defines getter and setter to all domain instances.
 */
export class GettersAndSetters<Props> implements IGettersAndSetters<Props> {
	private readonly _MetaHistory: IHistory<Props>;
	protected validator: Validator = Validator.create();
	protected static validator: Validator = Validator.create();
	private parentName: IParentName = 'ValueObject';

	protected config: ISettings = { disableGetters: false, disableSetters: false };

	constructor(protected props: Props, parentName: IParentName, config?: ISettings) {
		this.config.disableGetters = !!config?.disableGetters;
		this.config.disableSetters = !!config?.disableSetters;
		this._MetaHistory = new History({
			props: Object.assign({}, { ...this.props }),
			action: 'create',
		});
		this.parentName = parentName;
		GettersAndSetters.validator = Validator.create();
		this.validator = Validator.create();
	}

	/**
	 * @description Create a snapshot as update action.
	 * @returns void.
	 * @see change
	 * @see set
	 */
	private snapshotSet() {
		if (typeof this._MetaHistory !== 'undefined') {
			this._MetaHistory.snapshot({
				action: 'update',
				props: Object.assign({}, { ...this.props }),
				ocurredAt: new Date(),
				token: ID.createShort()
			});
		}
	}


	/**
	 * @description Validation used to `set` and `change` methods to validate value before set it.
	 * @param _key prop key type
	 * @param _value prop value type
	 * @returns true if value is valid and false if is invalid.
	 * 
	 * 
	 * @example
	 * interface Props { 
	 *		value: string;
	 *		age: number;
	 *	};
	 *	
	 *	class StringVo extends ValueObject<Props>{
	 *		private constructor(props: Props) { super(props) }
	 *	
	 *		validation<Key extends keyof Props>(key: Key, value: Props[Key]): boolean {
	 *
	 *			const options: IPropsValidation<Props> = {
	 *				value: (value: string) => value.length < 15,
	 *				age: (value: number) => value > 0
	 *			} 
	 *	
	 *			return options[key](value);
	 *		};
	 *	
	 *		public static create(props: Props): IResult<ValueObject<Props>, string> {
	 *			return Result.success(new StringVo(props));
	 *		}
	 *	}
	 */
	validation<Key extends keyof Props>(_key: Key, _value: Props[Key]): boolean { return true };

	/**
	 * 
	 * @param key the property key you want to get
	 * @returns the value of property
	 */
	get<Key extends keyof Props>(key: Key) {
		if (this.config.disableGetters) {
			console.log(`Trying to get key: "${String(key)}" but the getters are deactivated`);
			return null as unknown as Props[Key]
		};
		return this.props[key];
	}

	/**
	 * 
	 * @param key the property you want to set.
	 * @returns to function asking the value you want to set.
	 */
	set<Key extends keyof Props>(key: Key) {
		return {
			/**
			 * @description The value is only applied if pass on validation.
			 * @param value the value you want to apply.
			 * @param validation function to validate the value before apply. The value will be applied only if to pass on validation.
			 * @example 
			 * (value: PropValue) => boolean;
			 * @returns instance of this.
			 */
			to: (value: Props[Key], validation?: (value: Props[Key]) => boolean): GettersAndSetters<Props> => {
				const instance = Reflect.getPrototypeOf(this);
				if (this.config.disableSetters) {
					console.log(`Trying to set value: "${value}" for key: "${String(key)}" but, %c the setters are deactivated on ${instance?.constructor.name}`);
					return this
				};
				if (typeof validation === 'function') {
					if (!validation(value)) {
						console.log(`Trying to set value: "${value}" for key: "${String(key)}" but failed validation on ${instance?.constructor.name}`);
						return this
					};
				}

				const canUpdate = this.validation(key, value);
				if (!canUpdate) {
					console.log(`Trying to set value: "${value}" for key: "${String(key)}" but failed validation on ${instance?.constructor.name}`);
					return this;
				}
				
				if (key === 'id' && this.parentName === 'Entity') {
					if (this.validator.isString(value) || this.validator.isNumber(value)) {
						this['_id'] = ID.create(value);
						this['props']['id'] = this['_id'].value();
						if (this.parentName === 'Entity') {
							this['props'] = Object.assign({}, { ...this['props'] }, { updatedAt: new Date() });
						}
						this.snapshotSet();
						return this;
					}
					if (this.validator.isID(value)) {
						this['_id'] = value as unknown as ID<string>;
						this['props']['id'] = this['_id'].value();
						if (this.parentName === 'Entity') {
							this['props'] = Object.assign({}, { ...this['props'] }, { updatedAt: new Date() });
						}
						this.snapshotSet();
						return this;
					}
				}
				this.props[key] = value;
				if (this.parentName === 'Entity') {
					this['props'] = Object.assign({}, { ...this['props'] }, { updatedAt: new Date() });
				}
				this.snapshotSet();
				return this;
			}
		}
	}
	/**
	 * 
	 * @param key the property you want to set.
	 * @param value the value to apply to the key.
	 * @param validation function to validate the value before apply. The value will be applied only if to pass.
	 * @returns instance of own class.
	 */
	change<Key extends keyof Props>(key: Key, value: Props[Key], validation?: (value: Props[Key]) => boolean) {
		const instance = Reflect.getPrototypeOf(this);
		if (this.config.disableSetters) {
			console.log(`Trying to set value: "${value}" for key: "${String(key)}" but the setters are deactivated on ${instance?.constructor.name}`);
			return this
		};

		if (typeof validation === 'function') {
			if (!validation(value)) {
				console.log(`Trying to set value: "${value}" for key: "${String(key)}" but failed validation on ${instance?.constructor.name}`);
				return this
			};
		}
		const canUpdate = this.validation(key, value);
		if (!canUpdate) {
			console.log(`Trying to set value: "${value}" for key: "${String(key)}" but failed validation on ${instance?.constructor.name}`);
			return this;
		}
		if (key === 'id' && this.parentName === 'Entity') {
			if (this.validator.isString(value) || this.validator.isNumber(value)) {
				this['_id'] = ID.create(value);
				this['props']['id'] = this['_id'].value();
				if (this.parentName === 'Entity') {
					this['props'] = Object.assign({}, { ...this['props'] }, { updatedAt: new Date() });
				}
				this.snapshotSet();
				return this;
			}
			if (this.validator.isID(value)) {
				this['_id'] = value as unknown as ID<string>;
				this['props']['id'] = this['_id'].value();
				if (this.parentName === 'Entity') {
					this['props'] = Object.assign({}, { ...this['props'] }, { updatedAt: new Date() });
				}
				this.snapshotSet();
				return this;
			}
		}
		this.props[key] = value;
		if (this.parentName === 'Entity') {
			this['props'] = Object.assign({}, { ...this['props'] }, { updatedAt: new Date() });
		}
		this.snapshotSet();
		return this;
	}

	/**
	 * @description Manage props state as history.
	 * @returns IPublicHistory<Props>
	 */
	history(): IPublicHistory<Props> {
		return {
			/**
			 * @description Get previous props state and apply to instance.
			 * @param token a 16bytes value to identify the target state on history.
			 * @returns previous state found.
			 */
			back: (token?: UID<string>): IHistoryProps<Props> => {
				const prevState = this._MetaHistory.back(token);
				this.props = prevState ? prevState.props : this.props;
				return prevState;
			},

			/**
			 * @description Get next props state and apply to instance.
			 * @param token a 16bytes value to identify the target state on history.
			 * @returns next state found.
			 */
			forward: (token?: UID<string>): IHistoryProps<Props> => {
				const nextState = this._MetaHistory.forward(token);
				this.props = nextState ? nextState.props : this.props;
				return nextState;
			},

			/**
			 * @description Create a new snapshot from current state.
			 * @param token a 16bytes key to identify the state on history.
			 * @returns 
			 */
			snapshot: (token?: UID<string>): IHistoryProps<Props> => {
				return this._MetaHistory.snapshot({
					action: 'update',
					props: Object.assign({}, { ...this.props }),
					ocurredAt: new Date(),
					token,
				});
			},

			/**
			 * @description Get all props on state as history.
			 * @returns a list of props on state.
			 */
			list: (): IHistoryProps<Props>[] => {
				return this._MetaHistory.list()
			},

			/**
			 * @description Get total of props on state as history.
			 * @returns total of props on state.
			 */
			count: (): number => {
				return this._MetaHistory.count()
			},
		}
	}
}

export default GettersAndSetters;
