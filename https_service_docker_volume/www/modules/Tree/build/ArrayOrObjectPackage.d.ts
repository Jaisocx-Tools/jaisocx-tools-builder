export interface IJsonDataType {
    ARRAY: number;
    OBJECT: number;
    STRING: number;
    NUMBER: number;
    BOOLEAN: number;
    NO_SUBTREE: number;
    [key: string]: number;
}
export declare class ArrayOrObjectPackage {
    static readonly JsonDataType: IJsonDataType;
    static getDataTypeStringAndConst(value: any): {
        dataTypeString: string;
        dataType: number;
    };
    static getDataType(value: any): number;
    static getArrayOrObjectItemsAmount(isArray: number, arrayOrObject: any): {
        itemsAmount: number;
        objectKeys: string[] | null;
    };
    static iterateOverArrayOrObject(dataType: number, arrayOrObject: any, callback: CallableFunction, callbackPayload: any, objectKeys: string[] | null): any;
    static iterateOverArrayOrObjectDefined(isArray: number, arrayOrObject: any, callback: CallableFunction, callbackPayload: any, objectKeys: string[] | null): any;
}
