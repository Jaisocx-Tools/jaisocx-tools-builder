export interface EventHandlerReturnValue {
  payloadReturned: any;
  value: any;
}

export interface EventEmitResult {
  eventArt: string;
  eventName: string;
  selector: string|null;
  payload: any;
  result: any;
}

