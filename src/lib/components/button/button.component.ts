import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'd-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  standalone: false
})
export class ButtonComponent implements OnInit {

  constructor() { }
  @Input() label: string;
  @Input() text: string;
  @Output() onClick = new EventEmitter<any>();
  @Input() severity: string = 'primary';
  ngOnInit(): void {

  }

  clickButton() {
    this.onClick.emit();
  }

}
