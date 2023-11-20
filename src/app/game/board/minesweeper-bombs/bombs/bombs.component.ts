import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bombs',
  templateUrl: './bombs.component.html',
  styleUrls: ['./bombs.component.css']
})
export class BombsComponent {

  constructor(private route: ActivatedRoute) { }

}
