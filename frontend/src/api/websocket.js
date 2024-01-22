import { WS_RECONNECT_COUNT, WS_CLOSE_ABNORMAL, WS_RECONNECT_TIME } from '~/constants'
import { CreateMessageModel, createMessage } from '~/store/global'
import { storageGet } from '~/utils/localStorage'
import { CacheKeyEnum } from '~/constants/enum'
import { useGlobalState } from '~/store/global.ts'

const {setIsEngineStart} = useGlobalState()

class WebSocketClient {
    constructor(onMessageCallback) {
      this.url = import.meta.env.VITE_WS_URL
      this.urlParam = `?lang=zh_CN&token=${storageGet(CacheKeyEnum.TOKEN)}`
      this.onMessageCallback = onMessageCallback;
      this.socket = null;
      this.messageQueue = new Map();
      this.responseListeners = new Map();
      this.heartbeatInterval = null;
      this.heartbeatMsg = {cmd: 'ping'}
      this.heartbeatIntervalTime = 30*1000;
      this.reconnectCount = WS_RECONNECT_COUNT
      this.setupQueueCleaner()
    }

    init() {
      this.connect()
    }

    resetReconnectCount() {
      this.reconnectCount = WS_RECONNECT_COUNT
    }
  
    // 连接 WebSocket
    connect() {
      console.log('WebSocket connecting');
      this.socket = new WebSocket(this.url+this.urlParam);
  
      this.socket.onopen = () => {
        console.log('WebSocket connected');
        createMessage(new CreateMessageModel({
          type: 'warning',
          message: '引擎连接成功'
        }))
        setIsEngineStart(true)
        this.startHeartbeat()
      };
  
      // 收到消息
      this.socket.onmessage = (event) => {
        console.log('WebSocket received message:', event.data);
        const message = JSON.parse(event.data);
        if (message?.messageId && this.messageQueue.has(message.messageId)) {
          // 检查是否有等待此 messageId 的监听器
          if (this.responseListeners.has(message?.messageId)) {
              const { resolve } = this.responseListeners.get(message?.messageId);
              resolve(message);  // 解决 Promise
              this.responseListeners.delete(message?.messageId);  // 清除监听器
          }
          this.messageQueue.delete(message.messageId);
          console.log(`Message with ID ${message.messageId} was acknowledged and removed from the queue.`);
        }
        // 处理接收到的消息
        this.onMessageCallback(message);
      };
  
      // 连接关闭
      this.socket.onclose = (event) => {
        console.log('WebSocket close');
        setIsEngineStart(false)
        createMessage(new CreateMessageModel(
          'error',
          '引擎已断开连接'
        ))
      };
  
      // 出现错误
      this.socket.onerror = (error) => {
        console.error(`WebSocket error: ${error.message}`, error);
        this.handleClose(error)
      };
    }

    //定时清理消息队列
    setupQueueCleaner() {
      setInterval(() => {
        const now = Date.now();
        this.messageQueue.forEach((data, messageId) => {
            if (now - data.timestamp > 1000*60) {
                this.messageQueue.delete(messageId);
                this.responseListeners.delete(messageId);
                console.log(`Message with ID ${messageId} ${JSON.stringify(data)} was removed from the queue due to timeout.`);
            }
        });
      }, 1000*60);
    }

    //创建messageId
    generateMessageId() {
        // Generate a unique messageId
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    handleClose(e) {
      // if(e.code === WS_CLOSE_ABNORMAL) {
        if(this.reconnectCount-- > 0) {
          // createMessage(new CreateMessageModel(
          //   'warning',
          //   'websocket正在连接中，请稍候'
          // ))
          this.reconnect()
        } else {
          createMessage(new CreateMessageModel(
            'warning',
            'websocket连接失败，请重新启动程序！'
          ))
          this.resetReconnectCount()
        }
      // }
    }

    reconnect() {
      setTimeout(() => {
        this.connect()
      }, WS_RECONNECT_TIME)
    }
  
    // 发送消息
    send(message) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        const messageId = this.generateMessageId();
        const msg = { ...message, messageId }
        console.log('WebSocket.send msg = ',msg);
        this.socket.send(JSON.stringify(msg));
        this.messageQueue.set(messageId, {message: message, timestamp: Date.now()});

        if(message.needResponse){
          return new Promise((resolve, reject) => {
              this.responseListeners.set(messageId, { resolve, reject });
          });
        }
      } else {
        console.error('WebSocket is not connected');
      }
    }
  
    // 关闭 WebSocket 连接
    disconnect() {
      if (this.socket) {
        this.socket.close();
      }
    }

    // 开始心跳
    startHeartbeat() {
      this.heartbeatInterval = setInterval(() => {
          if (this.socket.readyState === WebSocket.OPEN) {
              this.send(this.heartbeatMsg); // 发送心跳消息
          }
      }, this.heartbeatIntervalTime);
    }

    // 停止心跳
    stopHeartbeat() {
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }
    }
  }
  
  export default WebSocketClient
  