import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';

import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

import { HttpClient , HttpHeaders} from '@angular/common/http';
import { HttpErrorResponse , HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = 'http://localhost:3000/';
  private socket;

  constructor(public http: HttpClient) {
    // this is were connection is being created
    this.socket = io(this.url);
  }
  //   this.socket.emit('mark-chat-as-seen', userDetails);
  // }
  // LISTENERS

  public getChat(senderId: any, receiverId: any, skip: number): Observable<any> {
  // tslint:disable-next-line:max-line-length
  return this.http.get(`${this.url}api/v1/chat/get/for/user?senderId=${senderId}&recieverId=${receiverId}&skip=${skip}&authToken=${Cookie.get('authToken')}`)
  .do(data => console.log('Data Received'))
  .catch(this.handleError);
}

    public verifyUser = () => {
      return Observable.create((observer) => {
        console.log('verifyUser');
        this.socket.on('verifyUser', (data) => {
          observer.next(data);
        }); // end socket
      }); // end Observable
    }// end veifyUser

    public onlineUserList = () => {
      return Observable.create((observer) => {
      this.socket.on('online-user-list', (userList) => {
          observer.next(userList);
      }); // end socket
    }); // end observer
    }// end onlineuserList

    public disconnectedSocket = () => {
      return Observable.create((observer) => {
        this.socket.on('disconnect', () => {
            observer.next();
        });
      });
    }

    public chatByUserId = (userId) => {
      return Observable.create((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data);
      });
    });
    }


    // EMITTERS

    // events to be emitted
    public setUser = (authToken) => {
      this.socket.emit('set-user', authToken);
    }

    // sending message to the particulatr onnline user
    public SendChatMessage = (chatMsgObject) => {
      this.socket.emit('chat-msg', chatMsgObject);
    }

    // going into offline
    public exitSocket = () => {
      this.socket.disconnect();
    }// end

    private handleError(err: HttpErrorResponse) {
      let errorMessage = '';
      if (err.error instanceof Error) {
        errorMessage = `An error occurred: ${err.error.message}`;

      } else {
        errorMessage = `server returned code: ${err.status}; error message is ${err.message}`;

      }
      console.error(errorMessage);

      return Observable.throw(errorMessage);
    }

}
