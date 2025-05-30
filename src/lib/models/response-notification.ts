import { Message } from './message.model';

export class ResponseNotification<T> {
  public timestamp: Date;
  public status: number;
  public title: string;
  public detail: string;
  public path: string;
  public data: T;
  public messages: Array<Message>;
}
