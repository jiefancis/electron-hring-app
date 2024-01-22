const { Application } = require('ee-core');
const { app } = require('electron');
const fs = require('fs');
const Log = require('ee-core/log');
const utils = require('./utils/index');
const path = require('path');
class Index extends Application {

  constructor() {
    super();
    // this === eeApp;
  }

  /**
   * core app have been loaded
   */
  async ready () {
    // do some things
    app.on('window-all-closed', async () => {
      // if (process.platform !== 'darwin') {
        Log.info('window-all-closed');
        utils.closeEngine()
        app.quit();
      // }
    });
  }

  /**
   * electron app ready
   */
  async electronAppReady () {
    // do some things
    // const isWindows = process.platform === 'win32'
    // const excuteFile = isWindows ? '/agentFile/start-engine.bat' : '/agentFile/start-engine.sh'
    // const filePath = path.join(process.cwd(),excuteFile)
    // Log.info('electronAppReady filePath = ',filePath)
    // if(fs.existsSync(filePath)){
    //   Log.info('electronAppReady fileExist')
    //   try{
    //     const res = await utils.runEngine(filePath)
    //     Log.info('electronAppReady runScript res = ',res)
    //   }catch(error){
    //     Log.info('electronAppReady runScript error = ',error)
    //   }
    // }
  }

  /**
   * main window have been loaded
   */
  async windowReady () {
    // const language = app.getLocale();
    // console.log(666, language);
    // do some things
    // 延迟加载，无白屏
    const winOpt = this.config.windowsOption;
    const isDev = this.config.isDev;
    if (winOpt.show == false) {
      const win = this.electron.mainWindow;
      win.once('ready-to-show', () => {
        win.show();
        win.focus();
      })

      win.on('close', (event) => {
        // 阻止窗口关闭的默认行为
        event.preventDefault();
    
        // 在这里可以添加你的逻辑处理
        // 例如弹出确认对话框询问用户是否真的要退出程序
    
        // 如果用户确认退出，可以调用以下代码关闭窗口
        win.destroy();
      });

      if(isDev) {
        Object.defineProperty(app, 'isPackaged', {
          get() {
            return true
          }
        })
      }

    }
  }

  /**
   * before app close
   */  
  async beforeClose () {
    // do some things
    Log.info('electron beforeClose')
    // utils.closeEngine()
  }
}

Index.toString = () => '[class Index]';
module.exports = Index;