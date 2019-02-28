import { Component, OnInit, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-first-char',
  templateUrl: './first-char.component.html',
  styleUrls: ['./first-char.component.css']
})
export class FirstCharComponent implements OnInit {

  constructor() { }

  @Input() name: string;
  @Input() userBg: string;
  @Input() userColor: string;

  firstChar: any;
  private _name: string;


  @Output()
  notify: EventEmitter<string> = new EventEmitter<string>();

  nameClicked = () => {
    this.notify.emit(this._name);
  }


  ngOnInit() {
    this._name = this.name;
    this.firstChar = this._name[0];
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges(changes: SimpleChanges) {
    // tslint:disable-next-line:prefer-const
    let name = changes.name;
    this._name = name.currentValue;
    this.firstChar = this._name[0];
  }

}
