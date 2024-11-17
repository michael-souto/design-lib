import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'd-modal-box',
  templateUrl: './modal-box.component.html',
  styleUrls: ['./modal-box.component.css']
})
export class ModalBoxComponent implements OnInit {

  constructor() { }

  @Input() display: boolean;
  @Output() displayChange = new EventEmitter<boolean>();

  @Input() header: string = null;

  @Input() color: string = '#eee';
  @Input() textColor: string = '#000';

  ngOnInit(): void {
  }

  show() {
    this.display = true;
  }

  hide() {
    this.display = false;
    this.displayChange.emit(false);
  }

  getDisplay() {
    return this.display ? 'block' : 'none';
  }

}
