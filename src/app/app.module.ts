import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';



import { AppComponent } from './app.component';
import { BoardComponent } from './game/board/board.component';
import { FieldComponent } from './game/board/minesweeper-field/field/field.component';
import { BombsComponent } from './game/board/minesweeper-bombs/bombs/bombs.component';


@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    FieldComponent,
    BombsComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
