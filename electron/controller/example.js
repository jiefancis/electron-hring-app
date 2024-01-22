'use strict';

const { Controller } = require('ee-core');
const Log = require('ee-core/log');
const Services = require('ee-core/services');
const Addon = require('ee-core/addon');
const { BrowserWindow } = require('electron')
const CoreWindow = require('ee-core/electron/window');

/**
 * example
 * @class
 */
let alipaywin = null;
class ExampleController extends Controller {

  constructor(ctx) {
    super(ctx);
  }


  /**
   * 所有方法接收两个参数
   * @param args 前端传的参数
   * @param event - ipc通信时才有值。详情见：控制器文档
   */

  /**
   * test
   */
  async test () {
    const result = await Services.get('example').test('electron');
    Log.info('service result:', result);

    return result; // 'hello electron-egg';
  }
  async checkVersion() {
    const result = await Services.get('example').checkVersion('1.0.0');
    Log.info('checkVersion service result:', result);
    
    return result;
  }
  async checkEngineVersion() {
    try{
      const result = await Services.get('example').checkEngineVersion()
      return result
    }catch(e){
      Log.info('controller checkEngineVersion e = ',e)
      return 'error'
    }
    // Log.info('agentVersion = ',result)

  }
  async startEngine(){
    Log.info('controller startEngine');
    const result = await Services.get('example').startEngine()

    return result
  }
  async engineUpdate(downloadUrl) {
    Log.info('controller downloadUrl = ',downloadUrl);
    const result = await Services.get('example').engineUpdate(downloadUrl)

    return result
  }
  checkForUpdater() {
    Addon.get('autoUpdater').checkUpdate()
    return;
  }
  appUpdate() {
    Services.get('example').removeEngine()
    Log.info('removeEngine ')
    Addon.get('autoUpdater').download();
    return;
  }

  closeMainWin() {
    const win = CoreWindow.getMainWindow();
    win.destroy()
  }

  openAlipayWin(url) {
    const bwin = new BrowserWindow({ width: 1440, height: 800 })
    bwin.loadURL(url)
    alipaywin = bwin;

    bwin.on('close', (event) => {
      // 阻止窗口关闭的默认行为
      event?.preventDefault?.();
      
      const textJson = true;
      const channel = 'alipaywin:close';
      const win = CoreWindow.getMainWindow();
      win.webContents.send(channel, textJson);

      alipaywin = null;
      bwin.destroy()
    });
  }

  closeAlipayWin() {
    alipaywin && alipaywin.destroy()
  }
}

ExampleController.toString = () => '[class ExampleController]';
module.exports = ExampleController;  