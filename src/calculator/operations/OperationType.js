// enum emulation, since we're not allowed to use TypeScript:(
export default class OperationType {
	static allClear = Symbol("allClear");
	static clear = Symbol("clear");
	static delete = Symbol("delete");
	static equal = Symbol("equal");
};
