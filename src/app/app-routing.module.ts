import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BombsComponent } from './game/board/minesweeper-bombs/bombs/bombs.component';
import { AppComponent } from './app.component';

const routes: Routes = [
    { path: 'app-bombs', component: BombsComponent },
    { path: "", component: AppComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
    
 }
 
