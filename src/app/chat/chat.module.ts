import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatboxComponent } from './chatbox/chatbox.component';

import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SharedModule } from '../shared/shared.module';
import { RemoveSpecialCharPipe } from '../shared/Pipe/pipe';


@NgModule({
  declarations: [ChatboxComponent, RemoveSpecialCharPipe],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      { path: 'chat', component: ChatboxComponent }
    ]),
    SharedModule
  ]
})
export class ChatModule { }





