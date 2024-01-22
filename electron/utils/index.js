const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios')
const { spawn, execSync } = require('child_process');
const Log = require('ee-core/log');
const _7z = require('7zip-min');
const path = require('path');

let child_process = null
const isWindows = process.platform === 'win32'
const excuteFileName = isWindows ? 'hiring-engine-desktop.exe' : 'hiring-engine-desktop'  //可执行文件名

function calculateMD5(filePath) {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(filePath);
        const hash = crypto.createHash('md5');
        readStream.on('data', (chunk) => {
            hash.update(chunk);
        });

        readStream.on('end', () => {
            const fileMD5 = hash.digest('hex');
            resolve(fileMD5);
        });

        readStream.on('error', (err) => {
            reject(err);
        });
    });
}

async function downloadFile(fileUrl, outputLocationPath) {
    const writer = fs.createWriteStream(outputLocationPath);

    return axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream',
    }).then(response => {
        return new Promise((resolve, reject) => {
            response.data.pipe(writer);
            let error = null;
            writer.on('error', err => {
                error = err;
                writer.close();
                reject(err);
            });
            writer.on('close', () => {
                if (!error) {
                    resolve('success');
                }
            });
        });
    });
}

function unzipFile(filePath,extractPath){
    // return new Promise((resolve,reject)=>{
    const command = 
        isWindows ? 
        `powershell -command "Expand-Archive -Path '${filePath}' -DestinationPath '${extractPath}'"` 
        : `unzip ${filePath}`;

    execSync(command)

    return true
    // })
}

async function runEngine(filePath){
    return new Promise((resolve, reject) => {
        const command = isWindows ? 'cmd.exe' : filePath;
        const args = isWindows ? ['/c',filePath] : []

        if(!isWindows){
            Log.info('runEngine filePath = ',filePath)
            execSync(`chmod -R 755 ${filePath}`)
            child_process = spawn(command, args);
        }
        // else{
        //     let runDir = path.join(process.cwd(),"hiring-engine-desktop")
        //     Log.info('runEngine runDir = ',runDir)
        //     // execSync(`cd ${runDir}`)
        //     process.chdir(runDir)
        //     Log.info('process.cwd() = ',process.cwd())
        //     child_process = spawn(command, ["/c","hiring-engine-desktop.exe"]);
        // }

        child_process = spawn(command, args);

        Log.info('typeof subprocess.pid',typeof child_process.pid)
        if(typeof child_process.pid == "number"){
            resolve('success')
        }

        let stdoutData = '';
        let stderrData = '';

        child_process.stdout.on('exit', (code) => {
            if(code == 0){
                resolve('success')
            }else{
                resolve('error')
            }
        });

        child_process.stderr.on('data', (data) => {
            stderrData += data;
        });

        child_process.on('close', (code) => {
            if (code !== 0) {
                Log.error(`执行的错误, 退出码 ${code}`);
                Log.error(`stderr: ${stderrData}`);
                reject(new Error(stderrData));
            } else {
                Log.info(`stdout: ${stdoutData}`);
                resolve('Success');
            }
        });

        child_process.on('error', (error) => {
            Log.error(`执行过程中发生错误: ${error}`);
            reject(error);
        });
    });
}

function closeEngine(){
    Log.info('closeEngine')
    if(isWindows){
        execSync(`taskkill /F /IM ${excuteFileName}`)
    }else{
        
    }
    return true
}

module.exports = {
    calculateMD5,
    downloadFile,
    unzipFile,
    runEngine,
    closeEngine
}