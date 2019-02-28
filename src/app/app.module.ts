import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';

import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { SocketService } from 'src/app/socket.service';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    ChatModule,
    UserModule,
    SharedModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent , pathMatch: 'full' },
       { path: '', redirectTo: 'login', pathMatch: 'full' },
       { path: '*', component: LoginComponent  },
       { path: '**', component: LoginComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
