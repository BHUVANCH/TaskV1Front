import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';


import { SocketService } from './../../socket.service';
import { AppService } from './../../app.service';

import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css'],
  providers: [SocketService]
})

export class ChatboxComponent implements OnInit {

  @ViewChild('scrollMe', { read: ElementRef })

  public scrollMe: ElementRef;

  public authToken: any;
  public userInfo: any;
  public userList: any = [];

  public recieverId: any;
  public recieverName: any;

  public messageText: String = '';
  public messageList: any = [];

  public scrollToChatTop = false;
  public disconnectedSocket: boolean;
  public pageValue = 0;
  public loadingPreviousChat: boolean;

  public unchat: any;


  constructor(public appService: AppService,
    public socketService: SocketService,
    public router: Router,
    private toastr: ToastrService,
    public shared: SharedModule

  ) {
    this.recieverId = Cookie.get('recieverId');
    this.recieverName = Cookie.get('recieverName');
    console.log(this.recieverId, this.recieverName);
  }



  ngOnInit() {

    this.authToken = Cookie.get('authToken');

    this.userInfo = this.appService.getUserInfoFromLocalstorage();

    this.checkStatus();

    this.verifyUserConfirmation();

    this.getOnlineUserList();

    this.getMessageFromAUser();

  }

  public checkStatus: any = () => {

    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === '' || Cookie.get('authToken') === null) {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  } // end checkStatus



  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser()
      .subscribe((data) => {
        this.disconnectedSocket = false;
        this.socketService.setUser(this.authToken);
        this.getOnlineUserList();

      });
  }


  public getOnlineUserList: any = () => {

    this.socketService.onlineUserList()
      .subscribe((userList) => {
        console.log(userList);
        this.userList = [];
        // tslint:disable-next-line:forin
        for (let x in userList) {
          // tslint:disable-next-line:prefer-const
          let temp = { 'userId': userList[x].userId, 'name': userList[x].fullName, 'unread': 0, 'chatting': false };
          this.userList.push(temp);
        }
        console.log(this.userList);
      }); // end online-user-list
  }


  public sendMessageUsingKeypress: any = (event: any) => {
    if (event.keyCode === 13) { // 13 is keyCode of enter .
      this.sendMessage();
    }
  }

  public sendMessage: any = () => {

    console.log(this.messageText);
    if (this.messageText) {

      // tslint:disable-next-line:prefer-const
      let chatMsgObject = {
        senderName: this.userInfo.firstName + ' ' + this.userInfo.lastName,
        senderId: this.userInfo.userId,
        recieverName: Cookie.get('recieverName'),
        recieverId: Cookie.get('recieverId'),
        message: this.messageText,
        createdOn: new Date()
      };
      console.log(chatMsgObject);
      this.socketService.SendChatMessage(chatMsgObject);
      this.pushToChatWindow(chatMsgObject);
    }
  }

  public pushToChatWindow: any = (data) => {
    this.messageText = '';
    this.messageList.push(data);
    this.scrollToChatTop = false;
  }

  public getMessageFromAUser: any = () => {
    this.socketService.chatByUserId(this.userInfo.userId)
      .subscribe((data) => {
        console.log(this.recieverId);
        console.log(data);
        (this.recieverId === data.senderId) ? this.messageList.push(data) : '';
        console.log(this.messageList);
        this.toastr.success(`${data.senderName} says: ${data.message}`);
        this.scrollToChatTop = false;
      });
  }

  public userSelectedToChat: any = (id, name) => {

    console.log('setting user active');
    this.userList.map((user) => {
      if (user.userId === id) {
        user.chatting = true;
      } else {
        user.chatting = false;
      }
    });

    Cookie.set('recieverId', id);
    Cookie.set('recieverName', name);

    this.recieverName = name;
    this.recieverId = id;
    this.messageList = [];
    this.pageValue = 0;

    // tslint:disable-next-line:prefer-const
    let chatDetails = {
      userId: this.userInfo.userId,
      senderId: id
    };

    // this.socketService.markChatAsSeen(chatDetails);
    this.getPreviousChatWithAUser();
  }

  getPreviousChatWithAUser(): any {
    // tslint:disable-next-line:prefer-const
    let previousData = (this.messageList.length > 0 ? this.messageList.slice() : []);

    this.socketService.getChat(this.userInfo.userId, this.recieverId, this.pageValue * 10)
      .subscribe((apiResponse) => {
        console.log(apiResponse);

        if (apiResponse.status === 200) {
          // tslint:disable-next-line:prefer-const
          let chatList = apiResponse.data.reverse();
          this.messageList = chatList.concat(previousData);
        } else {
          this.messageList = previousData;
          this.toastr.warning('No messages available');
        }

        this.loadingPreviousChat = false;
      }, (err) => {
        this.toastr.error('some error occured');
      });

  }// end get prevoius chayt with any user


  public loadEarlierPageOfChat: any = () => {

    this.loadingPreviousChat = true;

    this.pageValue++;
    this.scrollToChatTop = true;

    this.getPreviousChatWithAUser();

  } // end loadPreviousChat

  logout = () => {
    this.appService.logout().subscribe((apiResponse) => {
      console.log(apiResponse);
      if (apiResponse.status === 200 || 500) {
        console.log('logout Called');
        Cookie.delete('authToken');
        Cookie.delete('recieverId');
        Cookie.delete('recieverName');
        this.socketService.exitSocket();
        this.router.navigate(['/']);
      } else {
        this.toastr.error(apiResponse.message);
      } // end Condition
    }, (err) => {
      this.toastr.error('some error occured');
    });
  }

}

