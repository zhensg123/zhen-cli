let {ftpAccount, ECSAccount, outputDir, deployDir, deployType} = require("../app.config");
outputDir = outputDir || 'dist';

if(deployType == 'oss'){
  deployOSS();
} else if(deployType == 'ecs'){
  deployECS()
} else{
  console.log('不支持的部署方式')
}

// 发布到OSS
function deployOSS(){
  const fs = require("vinyl-fs");
  const ftp = require("vinyl-ftp");
  var conn = new ftp({
    // 要连接的FTP的host
    host: ftpAccount.host,
    // FTP的端口号
    port: ftpAccount.port,
    // FTP的用户名
    user: ftpAccount.user,
    // FTP的登录密码
    password: ftpAccount.password,
    log: logstr
  });

  // conn.dest返回一个 stream对象，参数是文件要上传的目录
  
  fs.src('./'+ outputDir + '/**', { buffer: false }).pipe(
    conn.dest(deployDir)
  );
}

// 发布到ECS
function deployECS(){
  const { spawn } = require("child_process");
  const scp = spawn(
    "scp",
    [
      "-r",
      // 如果远程服务器防火墙有为scp命令设置了指定的端口，我们需要使用 -P 参数来设置命令的端口号
      "-P",
      ECSAccount.port || "22",
      outputDir + "/*",
      ECSAccount.user + "@" + ECSAccount.host + ":" + deployDir
    ],
    // 如果不指定，子进程的信息无法输出到主进程中，无法弹出密码输入提示。
    { stdio: "inherit" }
  );
  
  scp.on("close", code => {
    if (!code) {
      process.stdout.write("恭喜你，部署成功！");
    }
  });
  process.on("exit", () => {
    if (scp) scp.kill("SIGTERM");
  });

}

// 文件上传日志打印
function logstr(mode, address) {
  if (address) {
    console.log(mode, address);
  }
}



