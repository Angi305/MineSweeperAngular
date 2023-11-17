import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BoardComponent } from './game/board/board.component';
import { FieldComponent } from './game/board/minesweeper-field/field/field.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    FieldComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
