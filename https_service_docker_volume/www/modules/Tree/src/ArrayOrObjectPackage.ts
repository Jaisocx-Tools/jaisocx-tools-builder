export interface IJsonDataType {
  ARRAY: number;
  OBJECT: number;
  STRING: number;
  NUMBER: number;
  BOOLEAN: number;
  NO_SUBTREE: number;

  [key: string]: number;
}

export class ArrayOrObjectPackage {
  static readonly JsonDataType: IJsonDataType = {
    ARRAY: 1,
    OBJECT: 2,
    STRING: 3,
    NUMBER: 4,
    BOOLEAN: 5,
    NO_SUBTREE: 6,
  };

  public static getDataTypeStringAndConst(value: any): { dataTypeString: string, dataType: number } {
    const dataTypeString: string = Array.isArray(value) ? "array" : (typeof value);
    const dataType: number = ArrayOrObjectPackage.JsonDataType[dataTypeString.toUpperCase()];

    return {
      dataTypeString,
      dataType,
    };
  }

  public static getDataType(value: any): number {
    const dataTypeString: string = Array.isArray(value) ? "array" : (typeof value);
    const dataType: number = ArrayOrObjectPackage.JsonDataType[dataTypeString.toUpperCase()];

    return dataType;
  }

  public static getArrayOrObjectItemsAmount(
    isArray: number,
    arrayOrObject: any,
  ): {itemsAmount: number, objectKeys: string[]|null} {
    let itemsAmount: number = 0;
    let objectKeys: string[]|null = null;

    if (isArray === 1) {
      itemsAmount = arrayOrObject.length;
    } else {
      objectKeys = Object.keys(arrayOrObject);
      itemsAmount = objectKeys.length;
    }

    return {
      itemsAmount,
      objectKeys,
    };
  }

  public static iterateOverArrayOrObject(
    dataType: number,
    arrayOrObject: any,
    callback: CallableFunction,
    callbackPayload: any,
    objectKeys: string[]|null,
  ): any {
    const isArray: number = ((dataType === ArrayOrObjectPackage.JsonDataType.ARRAY) ? 1 : 0);
    const callbackResult: any = ArrayOrObjectPackage.iterateOverArrayOrObjectDefined(
      isArray,
      arrayOrObject,
      callback,
      callbackPayload,
      objectKeys,
    );

    return callbackResult;
  }

  public static iterateOverArrayOrObjectDefined(
    isArray: number,
    arrayOrObject: any,
    callback: CallableFunction,
    callbackPayload: any,
    objectKeys: string[]|null,
  ): any {
    // expects isArray = 1 true

    let loopCounter: number = 0;
    let arrayElement: any = {};

    let subtreeNodesKeys: string[] = [];
    let subtreeNodesValues: any[] = [];
    let loopPropertyName: string = "";
    let loopPropertyValue: any = {};

    let arrayOrObjectItemsAmount: number = 1;

    let callbackResult: any = null;

    if (isArray === 1) {
      // subtree type is array

      loopPropertyName = "";
      arrayOrObjectItemsAmount = arrayOrObject.length;
      for (loopCounter = 0; loopCounter < arrayOrObjectItemsAmount; loopCounter++) {
        arrayElement = arrayOrObject[loopCounter];

        callbackResult = callback(isArray, loopCounter, arrayElement, loopCounter, arrayOrObject, callbackResult, callbackPayload);
      }
    } else {
      // subtree type is object

      subtreeNodesKeys = (objectKeys !== null) ? objectKeys : Object.keys(arrayOrObject);
      subtreeNodesValues = Object.values(arrayOrObject);

      arrayOrObjectItemsAmount = subtreeNodesKeys.length;
      for (loopCounter = 0; loopCounter < arrayOrObjectItemsAmount; loopCounter++) {
        loopPropertyName = subtreeNodesKeys[loopCounter];
        loopPropertyValue = subtreeNodesValues[loopCounter];

        callbackResult = callback(isArray, loopCounter, loopPropertyValue, loopPropertyName, arrayOrObject, callbackResult, callbackPayload);
      }
    }

    return callbackResult;
  }
}
