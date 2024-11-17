import { MessageType } from './message-type.model';

export class Message {

  constructor(
    public code: string,
    public type: MessageType,
    public description: string
  ) {}

}

export class ValidationErrorResponse {
  timestamp: string;
  status: number;
  title: string;
  detail: string;
  path: string;
  errors: ValidationError[];
}

export class ValidationError {
  fieldName: string;
  message: string;
}
