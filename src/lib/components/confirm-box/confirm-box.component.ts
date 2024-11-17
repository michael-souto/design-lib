import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'd-confirm-box',
  templateUrl: './confirm-box.component.html',
  styleUrls: ['./confirm-box.component.css']
})
export class ConfirmBoxComponent implements OnInit {

  constructor() { }

  display: boolean = false;
  header: string;
  text: string;
  accept: Function;
  reject: Function;

  ngOnInit(): void {
  }

  showConfirmBox(header: string, text: string, accept: Function, reject: Function) {
    this.header = header;
    this.text = text;
    this.accept = accept;
    this.reject = reject;

    this.display = true;
  }

  acceptEvent() {
    this.accept();
    this.display = false;
  }

  rejectEvent() {
    this.reject();
    this.display = false;
  }

}
