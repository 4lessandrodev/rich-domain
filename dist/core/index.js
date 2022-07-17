"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.History = exports.AutoMapper = exports.ValueObject = exports.Aggregate = exports.Entity = exports.ID = exports.GettersAndSetters = exports.Result = exports.Iterator = void 0;
const crypto_1 = require("crypto");
const check_types_1 = require("../utils/check-types");
/**
 * @description Iterator allows sequential traversal through a complex data structure without exposing its internal details.
 * Make any array an iterator using this class.
 */
class Iterator {
    constructor(config) {
        var _a, _b, _c;
        this.currentIndex = -1;
        this.items = (_a = config === null || config === void 0 ? void 0 : config.initialData) !== null && _a !== void 0 ? _a : [];
        this.lastCommand = 'none';
        this.returnCurrentOnReversion = (_b = !!(config === null || config === void 0 ? void 0 : config.returnCurrentOnReversion)) !== null && _b !== void 0 ? _b : false;
        this.restartOnFinish = (_c = !!(config === null || config === void 0 ? void 0 : config.restartOnFinish)) !== null && _c !== void 0 ? _c : false;
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
    static create(config) {
        return new Iterator(config);
    }
    /**
     * @description This method check if has some elements after current position.
     * @returns boolean `true` if has next element and `false` if not.
     */
    hasNext() {
        if (this.isEmpty())
            return false;
        return (this.currentIndex + 1) < this.items.length;
    }
    /**
     * @description This method check if has some elements before current position.
     * @returns boolean `true` if has next element and `false` if not.
     */
    hasPrev() {
        if (this.isEmpty())
            return false;
        return (this.currentIndex - 1) >= 0;
    }
    /**
     * @description This method check if current data state is empty.
     * @returns boolean `true` if is empty and `false` if not.
     */
    isEmpty() {
        return this.total() === 0;
    }
    /**
     * @description This method get the element on current position. Alway start on first element.
     * @returns element on current position and update cursor to the next element.
     *
     * @access if param `config.restartOnFinish` is set to `true` and cursor is on last element the next one will be the first element on state, case value is set to `false` the next element will be `null`.
     */
    next() {
        if (this.hasNext()) {
            if (this.lastCommand === 'prev' && this.currentIndex === 0) {
                this.lastCommand = 'next';
                return this.items[this.currentIndex];
            }
            const next = (this.currentIndex + 1);
            this.currentIndex = next;
            this.lastCommand = this.returnCurrentOnReversion ? 'next' : 'none';
            return this.items[next];
        }
        ;
        if (!this.restartOnFinish)
            return null;
        this.toFirst();
        return this.first();
    }
    /**
     * @description This method get the element on current position. Alway start on first element.
     * @returns element on current position and update cursor to the previous element.
     *
     * @access if param `config.restartOnFinish` is set to `true` and cursor is on first element the previous one will be the last element on state, case value is set to `false` the previous element will be `null`.
     */
    prev() {
        if (this.hasPrev()) {
            if (this.lastCommand === 'next' && this.currentIndex === this.total() - 1) {
                this.lastCommand = 'prev';
                return this.items[this.currentIndex];
            }
            const prev = (this.currentIndex - 1);
            this.currentIndex = prev;
            this.lastCommand = this.returnCurrentOnReversion ? 'prev' : 'none';
            return this.items[prev];
        }
        ;
        if (!this.restartOnFinish)
            return null;
        this.toLast();
        return this.last();
    }
    /**
     * @description Get element.
     * @returns the first element on state.
     */
    first() {
        return this.items.at(0);
    }
    /**
     * @description Get element.
     * @returns the last element on state.
     */
    last() {
        return this.items.at(-1);
    }
    /**
     * @description Update cursor to the first element on state.
     * @returns instance of iterator.
     */
    toFirst() {
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
    toLast() {
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
    clear() {
        this.items.splice(0, this.total());
        this.currentIndex = -1;
        return this;
    }
    /**
     * @description Add new element to state after last position.
     * @param data as element.
     * @returns instance of iterator.
     */
    addToEnd(data) {
        this.items.push(data);
        return this;
    }
    /**
     * @description Add new element to state after last position.
     * @param data as element.
     * @returns instance of iterator.
     */
    add(data) {
        return this.addToEnd(data);
    }
    /**
     * @description Add new element to state before first position.
     * @param data as element.
     * @returns instance of iterator.
     */
    addToStart(data) {
        this.currentIndex = -1;
        this.items.unshift(data);
        return this;
    }
    /**
     * @description Remove the last element from state.
     * @returns instance of iterator.
     */
    removeLast() {
        if (this.currentIndex >= this.total())
            this.currentIndex -= 1;
        this.items.pop();
        return this;
    }
    /**
     * @description remove the first element from state.
     * @returns instance of iterator.
     */
    removeFirst() {
        if (this.currentIndex > 0)
            this.currentIndex -= 1;
        this.items.shift();
        return this;
    }
    /**
     * @description Create a new instance of Iterator and keep current state.
     * @returns a new instance of Iterator with state.
     */
    clone() {
        return Iterator.create({
            initialData: this.toArray(),
            restartOnFinish: this.restartOnFinish,
            returnCurrentOnReversion: this.returnCurrentOnReversion
        });
    }
    /**
     * @description Get elements on state as array.
     * @returns array of items on state.
     */
    toArray() {
        return this.items;
    }
    /**
     * @description Count total of items on state.
     * @returns total of items on state.
     */
    total() {
        return this.items.length;
    }
}
exports.Iterator = Iterator;
/**
 * @summary The result is used to returns a operation result instead the own value.
 * @interface IResult<T, D, M>;
 * @classdesc on `T` refer to type of the value and `D` type of the error and `M` metaData type.
 * @default D is string.
 * @default M is empty object {}.
 */
class Result {
    constructor(isSuccess, data, error, metaData) {
        this._isSuccess = isSuccess;
        this._isFailure = !isSuccess;
        this._data = data !== null && data !== void 0 ? data : null;
        this._error = error !== null && error !== void 0 ? error : null;
        this._metaData = metaData !== null && metaData !== void 0 ? metaData : {};
    }
    /**
     * @description Create an instance of Result as success state with data and metadata to payload.
     * @param data as T to payload.
     * @param metaData as M to state.
     * @returns instance of Result.
     */
    static success(data, metaData) {
        return new Result(true, data, null, metaData);
    }
    /**
     * @description Create an instance of Result as failure state with error and metadata to payload.
     * @param error as D to payload.
     * @param metaData as M to state.
     * @returns instance of Result.
     */
    static fail(error, metaData) {
        return new Result(false, null, error, metaData);
    }
    /**
     * @description Create an instance of Iterator with array of Results on state.
     * @param results as array of Results
     * @returns instance of Iterator.
     */
    static iterate(results) {
        return Iterator.create({ initialData: results, returnCurrentOnReversion: true });
    }
    /**
     * @description Check all results instances status. Returns the first failure or returns the first success one.
     * @param results arrays with results instance.
     * @returns instance of result.
     * @default returns failure if provide a empty array.
     */
    static combine(results) {
        const iterator = this.iterate(results);
        if (iterator.isEmpty())
            return Result.fail('No results provided on combine param');
        while (iterator.hasNext()) {
            const currentResult = iterator.next();
            if (currentResult.isFailure())
                return currentResult;
        }
        return iterator.first();
    }
    /**
     * @description Execute any command on fail or success.
     * @param command instance of command that implements ICommand interface.
     * @returns Command result as payload.
     */
    execute(command) {
        return {
            /**
             * @description Use this option the command does not require arguments.
             * @param option `success` or `fail`
             * @returns command payload or undefined.
             */
            on: (option) => {
                if (option === 'success' && this.isSuccess())
                    return command.execute();
                if (option === 'fail' && this.isFailure())
                    return command.execute();
            },
            /**
             * @description Use this option the command require arguments.
             * @param data the same type your command require.
             * @returns on function.
             */
            withData: (data) => {
                return {
                    /**
                     * @description Use this option the command does not require arguments.
                     * @param option `success` or `fail`
                     * @returns command payload or undefined.
                     */
                    on: (option) => {
                        if (option === 'success' && this.isSuccess())
                            return command.execute(data);
                        if (option === 'fail' && this.isFailure())
                            return command.execute(data);
                    }
                };
            }
        };
    }
    /**
     * @description Get the instance value.
     * @returns `data` T or `null` case result is failure.
     */
    value() {
        return this._data;
    }
    /**
     * @description Get the instance error.
     * @returns `error` D or `null` case result is success.
     */
    error() {
        return this._error;
    }
    /**
     * @description Check if result instance is failure.
     * @returns `true` case result instance failure or `false` case is success one.
     */
    isFailure() {
        return this._isFailure;
    }
    /**
     * @description Check if result instance is success.
     * @returns `true` case result instance success or `false` case is failure one.
     */
    isSuccess() {
        return this._isSuccess;
    }
    /**
     * @description Get the instance metadata.
     * @returns `metadata` M or `{}` result in case of empty object has no metadata value.
     */
    metaData() {
        return this._metaData;
    }
    /**
     * @description Get result state as object.
     * @returns result state.
     * @example
     * {
     * 	isSuccess: boolean;
     * 	isFailure: boolean;
     * 	data: T | null;
     * 	error: D | null;
     * 	metaData: M | {};
     * }
     */
    toObject() {
        return {
            isSuccess: this._isSuccess,
            isFailure: this._isFailure,
            data: this._data,
            error: this._error,
            metaData: this._metaData
        };
    }
}
exports.Result = Result;
/**
 * @description defines getter and setter to all domain instances.
 */
class GettersAndSetters {
    constructor(props, config, history) {
        var _a, _b, _c;
        this.config = { className: '', deactivateGetters: false, deactivateSetters: false };
        this.props = props;
        this.config.className = (_a = config === null || config === void 0 ? void 0 : config.className) !== null && _a !== void 0 ? _a : '';
        this.config.deactivateGetters = (_b = config === null || config === void 0 ? void 0 : config.deactivateGetters) !== null && _b !== void 0 ? _b : false;
        this.config.deactivateSetters = (_c = config === null || config === void 0 ? void 0 : config.deactivateSetters) !== null && _c !== void 0 ? _c : false;
        this._MetaHistory = history;
    }
    /**
     * @description Create a snapshot as update action.
     * @returns void.
     * @see change
     * @see set
     */
    snapshotSet() {
        if (typeof this._MetaHistory !== 'undefined') {
            if (this._MetaHistory.count() === 0)
                return;
            const { id } = this._MetaHistory.list()[0];
            this._MetaHistory.snapshot({
                id,
                action: 'update',
                props: this.props,
                ocurredAt: new Date(),
                token: ID.createShort()
            });
        }
    }
    /**
     *
     * @param key the property key you want to get
     * @returns the value of property
     */
    get(key) {
        var _a;
        if ((_a = this.config) === null || _a === void 0 ? void 0 : _a.deactivateGetters)
            return null;
        return this.props[key];
    }
    /**
     *
     * @param key the property you want to set.
     * @returns to function asking the value you want to set.
     */
    set(key) {
        return {
            /**
             *
             * @param value the value you want to apply.
             * @param validation function to validate the value before apply. The value will be applied only if to pass on validation.
             * @example
             * (value: PropValue) => boolean;
             * @returns instance of this.
             */
            to: (value, validation) => {
                var _a;
                if ((_a = this.config) === null || _a === void 0 ? void 0 : _a.deactivateSetters)
                    return this;
                if (typeof validation === 'function') {
                    if (!validation(value))
                        return this;
                }
                this.props[key] = value;
                this.props = Object.assign({}, Object.assign({}, this.props), { updatedAt: new Date() });
                this.snapshotSet();
                return this;
            }
        };
    }
    /**
     *
     * @param key the property you want to set.
     * @param value the value to apply to the key.
     * @param validation function to validate the value before apply. The value will be applied only if to pass.
     * @returns instance of own class.
     */
    change(key, value, validation) {
        var _a;
        if ((_a = this.config) === null || _a === void 0 ? void 0 : _a.deactivateSetters)
            return this;
        if (typeof validation === 'function') {
            if (!validation(value))
                return this;
        }
        this.props[key] = value;
        this.props = Object.assign({}, Object.assign({}, this.props), { createdAt: new Date() });
        this.snapshotSet();
        return this;
    }
}
exports.GettersAndSetters = GettersAndSetters;
/**
 * @description Identity to Entity and Aggregates
 * @method create
 * @param value as string
 */
class ID {
    constructor(id) {
        this.MAX_SIZE = 16;
        this._createdAt = new Date();
        if (typeof id === 'undefined') {
            const uuid = (0, crypto_1.randomUUID)();
            this._value = uuid;
            this._isNew = true;
            return this;
        }
        this._value = id;
        ;
        this._isNew = false;
        return this;
    }
    ;
    setAsNew() {
        this._isNew = true;
    }
    /**
     * @description Update id value to a short value one. 16bytes.
     * @returns instance of ID with short value. 16bytes
     */
    toShort() {
        let short = '';
        let longValue = this._value;
        if (longValue.length < this.MAX_SIZE) {
            longValue = (0, crypto_1.randomUUID)() + longValue;
        }
        longValue = longValue.toUpperCase().replace(/-/g, '');
        const chars = longValue.split('');
        while (short.length < this.MAX_SIZE) {
            const lastChar = chars.pop();
            short = lastChar + short;
        }
        this._createdAt = new Date();
        this._value = short;
        return this;
    }
    /**
     * @description Get the id value.
     * @returns id value as string or number.
     */
    value() {
        return this._value;
    }
    /**
     * @description Check if id instance is a new one.
     * @returns `true` if id instance is new or `false` if not.
     * @example
     * ID.create("some-value") // this is not a new because on create you provided string value as param.
     *
     * @example
     * ID.create() // this is a new one because none args was provided.
     */
    isNew() {
        return this._isNew;
    }
    /**
     * @description Get created date
     * @returns date
     */
    createdAt() {
        return this._createdAt;
    }
    /**
     * @description Check if id instance is short. 16bytes
     * @returns `true` if id instance has short value and 'false` cause not.
     */
    isShortID() {
        if (typeof this._value !== 'string')
            return false;
        return this._value.toString().length === this.MAX_SIZE;
    }
    /**
     * @description Compare value from instance and provided id.
     * @param id instance of ID
     * @returns `true` if provided id value and instance value has the same value and `false` if not.
     */
    equal(id) {
        if (typeof this._value === typeof id.value())
            return this._value === id.value();
        return false;
    }
    /**
     * @description Deep comparative. Compare value and serialized instances.
     * @param id instance of ID
     * @returns `true` if provided id and instance is equal and `false` if not.
     */
    deepEqual(id) {
        if (typeof this._value !== typeof id.value)
            return false;
        const A = JSON.stringify(this);
        const B = JSON.stringify(id);
        return A === B;
    }
    /**
     * @description Create a clone from instance. This function does not change instance state.
     * @returns a cloned instance with the same properties and value.
     */
    cloneAsNew() {
        const newUUID = new ID(this._value);
        newUUID.setAsNew();
        return newUUID;
    }
    /**
     * @description Create a clone from instance. This function does not change instance state.
     * @returns a cloned instance with the same value.
     */
    clone() {
        return new ID(this._value);
    }
    /**
     * @description Create a short id. 16bytes.
     * @param id value as string optional.If you do not provide a value a new id value will be generated.
     * @returns instance of ID.
     */
    static createShort(id) {
        const _id = new ID(id);
        if (typeof id === 'undefined')
            _id.setAsNew();
        _id.toShort();
        return _id;
    }
    ;
    /**
     * @description Create a short id.
     * @param id value as string optional.If you do not provide a value a new uuid value will be generated.
     * @returns instance of ID.
     */
    static create(id) {
        return new ID(id);
    }
}
exports.ID = ID;
/**
 * @description Entity identified by an id
 */
class Entity extends GettersAndSetters {
    constructor(props, id, config) {
        super(props, config, new History({
            props: Object.assign({}, { createdAt: new Date(), updatedAt: new Date() }, Object.assign({}, props)),
            action: 'create',
            id: ID.create(id),
        }));
        this.validator = check_types_1.ValidateType.create();
        this.props = Object.assign({}, { createdAt: new Date(), updatedAt: new Date() }, Object.assign({}, props));
        this._id = ID.create(id);
        this.autoMapper = new AutoMapper();
    }
    /**
     * @description Get value as object from entity.
     * @returns object with properties.
     */
    toObject() {
        return this.autoMapper.entityToObj(this);
    }
    /**
     * @description Get id as ID instance
     * @returns ID instance
     */
    get id() {
        return this._id;
    }
    /**
     * @description Get hash to identify the entity.
     * @returns Entity hash as ID instance.
     * @example
     * `[Entity@ClassName]:UUID`
     *
     * @summary className is defined on constructor config param
     */
    hashCode() {
        var _a;
        return ID.create(`[Entity@${(_a = this.config) === null || _a === void 0 ? void 0 : _a.className}]:${this.id.value()}`);
    }
    /**
     * @description Check if an entity is a new instance.
     * @returns `true` if entity is a new instance generated and `false` if not.
     * @summary new instance: not saved on database yet.
     */
    isNew() {
        return this.id.isNew();
    }
    /**
     * @description Get a new instanced based on current Entity.
     * @param id value to identify the new entity instance.
     * @summary if not provide an id a new one will be generated.
     * @returns new Entity instance.
     */
    clone(id) {
        return Entity.bind(this).create(this.props, ID.create(id).value());
    }
    /**
     * @description Manage props state as history.
     * @returns IPublicHistory<Props>
     */
    history() {
        return {
            /**
             * @description Get previous props state and apply to instance.
             * @param token a value to identify the target state on history.
             * @returns previous state found.
             */
            back: (token) => {
                const prevState = this._MetaHistory.back(token);
                super.props = prevState !== null ? prevState === null || prevState === void 0 ? void 0 : prevState.props : this.props;
                return prevState;
            },
            /**
             * @description Get next props state and apply to instance.
             * @param token a value to identify the target state on history.
             * @returns next state found.
             */
            forward: (token) => {
                const nextState = this._MetaHistory.forward(token);
                this.props = nextState ? nextState === null || nextState === void 0 ? void 0 : nextState.props : this.props;
                return nextState;
            },
            /**
             * @description Create a new snapshot from current state.
             * @param token a key to identify the state on history.
             * @returns
             */
            snapshot: (token) => {
                return this._MetaHistory.snapshot({
                    action: 'update',
                    id: this.id,
                    props: this.props,
                    ocurredAt: new Date(),
                    token,
                });
            },
            /**
             * @description Get all props on state as history.
             * @returns a list of props on state.
             */
            list: () => {
                return this._MetaHistory.list();
            },
            /**
             * @description Get total of props on state as history.
             * @returns total of props on state.
             */
            count: () => {
                return this._MetaHistory.count();
            },
        };
    }
    /**
     * @description Method to validate prop value.
     * @param value to validate
     */
    static isValidValue(value) {
        return !this.validator.isUndefined(value) && !this.validator.isNull(value);
    }
    ;
    /**
     *
     * @param props params as Props
     * @param id optional uuid as string, second arg. If not provided a new one will be generated.
     * @returns instance of result with a new Entity on state if success.
     * @summary result state will be `null` case failure.
     */
    static create(props, id) {
        if (!this.isValidValue(props))
            return Result.fail('Props are required to create an instance of ' + this.name);
        return Result.success(new this(props, id, { className: this.name }));
    }
    ;
}
exports.Entity = Entity;
Entity.validator = check_types_1.ValidateType.create();
/**
 * @description Aggregate identified by an id
 */
class Aggregate extends Entity {
    constructor(props, id, config) {
        super(props, id, config);
    }
    /**
     * @description Get hash to identify the aggregate.
     * @returns Aggregate hash as ID instance.
     * @example
     * `[Aggregate@ClassName]:UUID`
     *
     * @summary className is defined on constructor config param
     */
    hashCode() {
        var _a;
        return ID.create(`[Aggregate@${(_a = this.config) === null || _a === void 0 ? void 0 : _a.className}]:${this.id.value()}`);
    }
    /**
     *
     * @param props params as Props
     * @param id optional uuid as string, second arg. If not provided a new one will be generated.
     * @returns instance of result with a new Aggregate on state if success.
     * @summary result state will be `null` case failure.
     */
    static create(props, id) {
        if (!this.isValidValue(props))
            return Result.fail('Props are required to create an instance of ' + this.name);
        return Result.success(new this(props, id, { className: this.name }));
    }
    ;
}
exports.Aggregate = Aggregate;
/**
 * @description ValueObject an attribute for entity and aggregate
 */
class ValueObject extends GettersAndSetters {
    constructor(props, config) {
        super(props, config, new History({
            props: props,
            action: 'create',
            id: ID.create(),
        }));
        this.validator = check_types_1.ValidateType.create();
        this.props = props;
        this.autoMapper = new AutoMapper();
    }
    history() {
        return {
            /**
             * @description Get previous props state and apply to instance.
             * @param token a value to identify the target state on history.
             * @returns previous state found.
             */
            back: (token) => {
                const prevState = this._MetaHistory.back(token);
                this.props = prevState ? prevState === null || prevState === void 0 ? void 0 : prevState.props : this.props;
                return prevState;
            },
            /**
             * @description Get next props state and apply to instance.
             * @param token a value to identify the target state on history.
             * @returns next state found.
             */
            forward: (token) => {
                const nextState = this._MetaHistory.forward(token);
                this.props = nextState ? nextState === null || nextState === void 0 ? void 0 : nextState.props : this.props;
                return nextState;
            },
            /**
             * @description Create a new snapshot from current state.
             * @param token a key to identify the state on history.
             * @returns
             */
            snapshot: (token) => {
                const first = this._MetaHistory.list()[0];
                return this._MetaHistory.snapshot({
                    action: 'update',
                    id: first ? first.id : ID.createShort(),
                    props: this.props,
                    ocurredAt: new Date(),
                    token
                });
            },
            /**
             * @description Get all props on state as history.
             * @returns a list of props on state.
             */
            list: () => {
                return this._MetaHistory.list();
            },
            /**
             * @description Get total of props on state as history.
             * @returns total of props on state.
             */
            count: () => {
                return this._MetaHistory.count();
            }
        };
    }
    /**
     * @description Get an instance copy.
     * @returns a new instance of value object.
     */
    clone() {
        return ValueObject.bind(this).create(this.props);
    }
    /**
     * @description Get value from value object.
     * @returns value as string, number or any type defined.
     */
    toObject() {
        return this.autoMapper.valueObjectToObj(this);
    }
    /**
     * @description Method to validate prop value.
     * @param value to validate
     */
    static isValidValue(value) {
        return !this.validator.isUndefined(value) && !this.validator.isNull(value);
    }
    ;
    /**
     *
     * @param props params as Props
     * @returns instance of result with a new Value Object on state if success.
     * @summary result state will be `null` case failure.
     */
    static create(props) {
        if (!this.isValidValue(props))
            return Result.fail('Props are required to create an instance of ' + this.name);
        return Result.success(new this(props, { className: this.name }));
    }
    ;
}
exports.ValueObject = ValueObject;
ValueObject.validator = check_types_1.ValidateType.create();
/**
 * @description Auto Mapper transform a domain resource into object.
 */
class AutoMapper {
    constructor() {
        this.validator = check_types_1.ValidateType.create();
    }
    /**
     * @description Transform a value object into a simple value.
     * @param valueObject as instance.
     * @returns an object or a value object value.
     */
    valueObjectToObj(valueObject) {
        // internal state
        let props = {};
        const isSimpleValue = this.validator.isBoolean(valueObject) ||
            this.validator.isNumber(valueObject) ||
            this.validator.isString(valueObject) ||
            this.validator.isObject(valueObject) ||
            this.validator.isDate(valueObject);
        if (isSimpleValue)
            return valueObject;
        const isID = this.validator.isID(valueObject);
        const id = valueObject;
        if (isID)
            return id === null || id === void 0 ? void 0 : id.value();
        // props
        const voProps = valueObject === null || valueObject === void 0 ? void 0 : valueObject['props'];
        const isSimp = this.validator.isBoolean(voProps) ||
            this.validator.isNumber(voProps) ||
            this.validator.isString(voProps) ||
            this.validator.isDate(voProps);
        if (isSimp)
            return voProps;
        const keys = Object.keys(voProps);
        const values = keys.map((key) => {
            const isVo = this.validator.isValueObject(voProps === null || voProps === void 0 ? void 0 : voProps[key]);
            if (isVo)
                return this.valueObjectToObj(voProps === null || voProps === void 0 ? void 0 : voProps[key]);
            const isSimpleValue = this.validator.isBoolean(voProps === null || voProps === void 0 ? void 0 : voProps[key]) ||
                this.validator.isNumber(voProps === null || voProps === void 0 ? void 0 : voProps[key]) ||
                this.validator.isString(voProps === null || voProps === void 0 ? void 0 : voProps[key]) ||
                this.validator.isObject(voProps === null || voProps === void 0 ? void 0 : voProps[key]) ||
                this.validator.isDate(voProps === null || voProps === void 0 ? void 0 : voProps[key]);
            if (isSimpleValue)
                return voProps === null || voProps === void 0 ? void 0 : voProps[key];
            const isID = this.validator.isID(voProps === null || voProps === void 0 ? void 0 : voProps[key]);
            const id = voProps === null || voProps === void 0 ? void 0 : voProps[key];
            if (isID)
                return id.value();
            const isArray = this.validator.isArray(voProps === null || voProps === void 0 ? void 0 : voProps[key]);
            if (isArray) {
                let arr = voProps === null || voProps === void 0 ? void 0 : voProps[key];
                const results = [];
                arr.forEach((data) => {
                    const result = this.valueObjectToObj(data);
                    results.push(result);
                });
                return results;
            }
        });
        const hasUniqueValue = values.length === 1;
        props = {};
        if (!hasUniqueValue) {
            values.forEach((value, i) => {
                props = Object.assign({}, Object.assign({}, props), { [keys[i]]: value });
            });
        }
        return hasUniqueValue ? values[0] : props;
    }
    /**
     * @description Transform a entity into a simple object.
     * @param entity instance.
     * @returns a simple object.
     */
    entityToObj(entity) {
        var _a, _b;
        let result = {};
        const isEntity = this.validator.isEntity(entity);
        const isAggregate = this.validator.isAggregate(entity);
        const props = (_a = entity === null || entity === void 0 ? void 0 : entity['props']) !== null && _a !== void 0 ? _a : {};
        const isValueObject = this.validator.isValueObject(entity);
        const isSimpleValue = this.validator.isBoolean(entity) ||
            this.validator.isNumber(entity) ||
            this.validator.isString(entity) ||
            this.validator.isObject(entity) ||
            this.validator.isDate(entity);
        if (isSimpleValue)
            return entity;
        if (isValueObject)
            return this.valueObjectToObj(entity);
        if (isEntity || isAggregate) {
            const id = (_b = entity === null || entity === void 0 ? void 0 : entity.id) === null || _b === void 0 ? void 0 : _b.value();
            const createdAt = entity === null || entity === void 0 ? void 0 : entity.get('createdAt');
            const updatedAt = entity === null || entity === void 0 ? void 0 : entity.get('updatedAt');
            result = Object.assign({}, Object.assign({}, result), { id, createdAt, updatedAt });
            const keys = Object.keys(props);
            keys.forEach((key) => {
                var _a;
                const isArray = this.validator.isArray(props === null || props === void 0 ? void 0 : props[key]);
                if (isArray) {
                    const arr = (_a = props === null || props === void 0 ? void 0 : props[key]) !== null && _a !== void 0 ? _a : [];
                    const subProps = arr.map((item) => this.entityToObj(item));
                    result = Object.assign({}, Object.assign({}, result), { [key]: subProps });
                }
                const isSimple = this.validator.isValueObject(props === null || props === void 0 ? void 0 : props[key]) ||
                    this.validator.isBoolean(props === null || props === void 0 ? void 0 : props[key]) ||
                    this.validator.isNumber(props === null || props === void 0 ? void 0 : props[key]) ||
                    this.validator.isString(props === null || props === void 0 ? void 0 : props[key]) ||
                    this.validator.isDate(props === null || props === void 0 ? void 0 : props[key]);
                if (isSimple) {
                    const data = this.valueObjectToObj(props[key]);
                    result = Object.assign({}, Object.assign({}, result), { [key]: data });
                }
            });
        }
        return result;
    }
}
exports.AutoMapper = AutoMapper;
/**
 * @description Manage state props as history.
 */
class History {
    constructor(props) {
        let _props = props ? Object.assign({}, Object.assign({}, props), { action: 'create' }) : undefined;
        _props = _props ? Object.assign({}, Object.assign({}, _props), { token: ID.createShort() }) : undefined;
        _props = _props ? Object.assign({}, Object.assign({}, _props), { ocurredAt: new Date() }) : undefined;
        this.iterator = Iterator.create({
            initialData: _props ? [_props] : [],
            restartOnFinish: false,
            returnCurrentOnReversion: true
        });
    }
    /**
     *
     * @param token ID as token.
     * @returns true if token already exists for some prop state on history and false if not.
     */
    tokenAlreadyExists(token) {
        const iterate = this.iterator.clone();
        iterate.toLast();
        while (iterate.hasPrev()) {
            const prev = iterate.prev();
            if (token.equal(prev.token))
                return true;
        }
        return false;
    }
    /**
     * @description Get all props on state as history.
     * @returns a list of props on state.
     */
    list() {
        return this.iterator.toArray();
    }
    /**
     * @description Create a new snapshot from current state.
     * @param props to be pushed into history.
     * @returns props pushed.
     */
    snapshot(props) {
        var _a, _b, _c;
        const token = (_b = (_a = props.token) === null || _a === void 0 ? void 0 : _a.toShort()) !== null && _b !== void 0 ? _b : ID.createShort();
        const tokenAlreadyExists = (this.tokenAlreadyExists(token));
        props.token = tokenAlreadyExists ? ID.createShort() : token;
        const ocurredAt = (_c = props.ocurredAt) !== null && _c !== void 0 ? _c : new Date();
        props.ocurredAt = ocurredAt;
        this.iterator.add(props);
        this.iterator.toLast();
        return props;
    }
    /**
     * @description Get previous props state and apply to instance.
     * @param token a value to identify the target state on history.
     * @returns previous state found or null if not found.
     */
    back(token) {
        var _a;
        this.iterator.prev();
        if (token) {
            while (this.iterator.hasPrev()) {
                const prev = this.iterator.prev();
                if ((_a = prev.token) === null || _a === void 0 ? void 0 : _a.equal(token))
                    return prev;
            }
        }
        if (this.iterator.hasPrev())
            return this.iterator.prev();
        this.iterator.toFirst();
        return this.iterator.first();
    }
    /**
     * @description Get next props state and apply to instance.
     * @param token a value to identify the target state on history.
     * @returns next state found or null if not found.
     */
    forward(token) {
        var _a;
        this.iterator.next();
        if (token) {
            while (this.iterator.hasNext()) {
                const next = this.iterator.next();
                if ((_a = next.token) === null || _a === void 0 ? void 0 : _a.equal(token))
                    return next;
            }
        }
        if (this.iterator.hasNext())
            return this.iterator.next();
        this.iterator.toLast();
        return this.iterator.last();
    }
    /**
     * @description Get total of props on state as history.
     * @returns total of props on state.
     */
    count() {
        return this.iterator.total();
    }
}
exports.History = History;
