import { Router } from '@angular/router';
import { Message, ValidationErrorResponse } from './../../models/message.model';
import { Component, OnInit, Input } from '@angular/core';
import { MessageType } from '../../models/message-type.model';

@Component({
  selector: 'd-message-window',
  templateUrl: './message-window.component.html'
})
export class MessageWindowComponent implements OnInit {

  messages: Message[];
  displayDialogMessages: boolean = false;
  urlRouteExit: string = '';
  @Input() header = "Mensagem";
  closeFunction: () => void = () => {};

  constructor(protected router: Router) { }

  ngOnInit() {
  }

  show(messages: Message[], urlRouteExit: string) {
    this.messages = messages;
    this.urlRouteExit = urlRouteExit;
    this.displayDialogMessages = true;
  }

  showValidationError(errorResponse: ValidationErrorResponse, urlRouteExit: string) {
    this.messages = this.parseValidationErrors(errorResponse);
    this.header = errorResponse.title;
    this.urlRouteExit = urlRouteExit;
    this.displayDialogMessages = true;
  }

  showTitle(messages: Message[], urlRouteExit: string, title: string): void;
  showTitle(messages: Message[], urlRouteExit: string, title: string, closeFunction: () => void): void;

  showTitle(messages: Message[], urlRouteExit: string, title: string, closeFunction?: () => void): void {
    this.messages = messages;
    this.header = title ?? 'Mensagens';
    this.urlRouteExit = urlRouteExit;
    this.displayDialogMessages = true;
    this.closeFunction = closeFunction;
  }

  closeDialog(){
    this.displayDialogMessages=false;

    if (this.urlRouteExit != ''){
      this.router.navigate([this.urlRouteExit]);
    }
    if (this.closeFunction) {
      this.closeFunction();
    }
  }

  parseValidationErrors(errorResponse: ValidationErrorResponse): Message[] {
    const messages: Message[] = [];

    if (errorResponse.errors && Array.isArray(errorResponse.errors)) {
      errorResponse.errors.forEach((error: { fieldName: string, message: string }) => {
        const code = error.fieldName; // Atribui o fieldName ao code
        const description = `${error.fieldName}: ${error.message}`; // Combina fieldName e message

        const message = new Message(code, MessageType.Error, description);
        messages.push(message);
      });
    }

    return messages;
  }
}
