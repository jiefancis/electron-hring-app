'use strict';

const { Service } = require('ee-core');
const { app } = require('electron');
const Addon = require('ee-core/addon');
const Log = require('ee-core/log');
const path = require('path');
const utils = require('../utils/index');
const fs = require('fs');

const isWindows = process.platform === 'win32'
const fileName = 'hiring-engine-desktop.zip'  //下载包名
const extractPathName = 'hiring-engine-desktop' //解压文件名
const excuteFileName = isWindows ? 'hiring-engine-desktop.exe' : 'hiring-engine-desktop'  //可执行文件名
const currentDirectory = isWindows? process.cwd() : __dirname  //当前路径

/**
 * 示例服务（service层为单例）
 * @class
 */
class ExampleService extends Service {

  constructor(ctx) {
    super(ctx);
  }

  /**
   * test
   */

  async test(args) {
    const lang = app.getLocale()
    let obj = {
      status:'ok',
      params: args,
      language: lang 
    }

    return obj;
  }
  async checkVersion() {
    // Addon.get('autoUpdater').checkUpdate()
    return app.getVersion()
  }
  async checkEngineVersion(){
    // Log.info('service checkEngineVersion');
    Log.info("currentDirectory:", currentDirectory);
    const filePath = path.join(currentDirectory, fileName)
    // const filePath = path.join(currentDirectory,'agentFile.exe')
    if(!fs.existsSync(filePath)){
      return ''
    }
    const md5Version = await utils.calculateMD5(filePath)
    Log.info("md5Version:", md5Version);
    return md5Version
  }
  async startEngine(){
    const excuteFile = isWindows ? `/${extractPathName}/${excuteFileName}` + '' : excuteFileName
    const filePath = path.join(currentDirectory,excuteFile)
    if(fs.existsSync(filePath)){
      Log.info('startEngine fileExist filePath = ',filePath)
      try{
        const res = await utils.runEngine(filePath)
        Log.info('startEngine runScript res = ',res)
        return res
      }catch(error){
        Log.info('startEngine runScript error = ',error)
        return error
      }
    }else{
      Log.info('startEngine file not exist')
      return 'file not exist'
    }
  }
  async removeEngine() {
    utils.closeEngine()
    const fileName = 'agentFile.exe'//"agentFile.7z"
    const outputPath = path.join(currentDirectory,fileName)
    // Log.info('platform = ',process.platform)
    const extractPath = path.join(currentDirectory,'agentFile.exe')

    if(fs.existsSync(outputPath)){
      fs.unlinkSync(outputPath);
    }
    if (fs.existsSync(extractPath)) {
      fs.rmSync(extractPath, { recursive: true });
    }
  }
  async engineUpdate(downloadUrl){
    const outputPath = path.join(currentDirectory,fileName)
    // Log.info('platform = ',process.platform)
    const extractPath = path.join(currentDirectory, extractPathName) //解压路径

    if(fs.existsSync(outputPath)){
      fs.unlinkSync(outputPath);
    }
    if (fs.existsSync(extractPath)) {
      fs.rmSync(extractPath, { recursive: true });
    }

    try{
      const res = await utils.downloadFile(downloadUrl,outputPath)
      Log.info('downloadFile res = ',res)
    }
    catch(err){
      Log.error('downloadFile err = ',err)
    }

    const unzipRes = utils.unzipFile(outputPath,extractPath)
    Log.info('unzipRes = ',unzipRes)

    // const isWindows = process.platform === 'win32'
    // const excuteFile = isWindows ? 'start-engine.bat' : 'start-engine.sh'
    // const filePath = path.join(extractPath,excuteFile)
    // Log.info('filePath = ',filePath)
    // const runScriptRes = await utils.runEngine(filePath)
    const runScriptRes = await this.startEngine(outputPath)
    Log.info('runScriptRes = ',runScriptRes)

    return true
  }
}

ExampleService.toString = () => '[class ExampleService]';
module.exports = ExampleService;