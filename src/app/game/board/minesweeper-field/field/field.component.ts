import { Component, EventEmitter, Input, Output, ElementRef, OnInit } from '@angular/core';
import { BoardComponent } from '../../board.component';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {
  @Input() state: string = '';
  @Input() value: number = 0;
  @Input() x: number = 0;
  @Input() y: number = 0;
  @Input() isMine: boolean = false;
  @Input() additionalMines: number = 0;
  @Output() clickEvent = new EventEmitter<object>();
  @Output() rbClickEvent = new EventEmitter<object>();
  textColor: string = '';
  colours: Array<string> = [
    'blue', 'green', 'red',
    'purple', 'maroon', 'turquoise',
    'black', 'gray'
  ];
  isClicked: boolean = false;

  ngOnInit(): void {
    this.updateTextColor();
  }

  ngOnChanges(): void {
    this.updateTextColor();
  }

  private updateTextColor() {
    const adjustedValue = this.value + this.additionalMines;
    this.textColor = this.colours[adjustedValue - 1];
  }

  onClick() {
    this.isClicked = true;
    this.clickEvent.emit({ x: this.x, y: this.y });
    return false;
  }
  onRBClick() {
    this.rbClickEvent.emit({ x: this.x, y: this.y });
    return false;
  }
}
