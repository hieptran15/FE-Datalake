import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs';

export class WebSocketUtil {
  webSocketEndPoint: string;
  topic: string = '/topic/greetings';
  stompClient: any;
  connectStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor() {
    this.webSocketEndPoint = `${environment.apiUrlFe}/ws`
  }

  connect() {
    console.log('Initialize WebSocket Connection');
    const ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({}, () => {
      _this.stompClient.reconnect_delay = 2000;
      _this.connectStatus.next(true);
    }, (error) => this.errorCallBack(error));
  };

  subscribeTopic(object) {
    return this.stompClient.subscribe(this.topic, (res) => {
      object.message = res.body;
    });
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected');
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error) {
    console.log('errorCallBack -> ' + error)
    setTimeout(() => {
      // this.connect(onMessageReceived);
      this.disconnect();
    }, 5000);
  }

  /**
   * Send message to sever via web socket
   * @param {*} message
   */
  send(id) {
    console.log('calling logout api via web socket');
    this.stompClient.send('/api/hello', {}, JSON.stringify({appId: id}));
  }
}
