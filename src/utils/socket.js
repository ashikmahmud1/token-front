import {BASE_URL} from "../config";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

const serverUrl = BASE_URL + '/ws';
const ws = new SockJS(serverUrl);
const stompClient = Stomp.over(ws);

export default stompClient;
