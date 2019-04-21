const WebSocket = require("ws");
const CryptoJS = require("crypto-js");
const nslookup = require("nslookup");
const fs = require("fs");

const CLIENT_SECRET = "7H1$!54C213N753CR37";
const LISTENING_PORT = 30000;

// 从docker分配的节点host文件中获取内网ip
const MYIP = fs
  .readFileSync("/etc/hosts", "utf8")
  .toString()
  .split(/[\s\n]/)[14];

class Client {
  constructor() {
    this.servers = [];
    this.sockets = {};
  }

  async discovery(serviceName) {
    try {
      const serverList = await this.getServersFrom(serviceName);
      this.servers.push(...serverList);
    } catch (err) {
      console.log(err + " ,try discovery again");
      setTimeout(async () => this.discovery(serviceName), 5000);
    }
    // 设置间隔时间以免碰撞，并发连接列表上的peer
    setTimeout(async () => {
      await Promise.all(
        this.servers.map(server => this.connectToServer(server))
      );
    }, 20000);
  }

  async getServersFrom(serviceName) {
    return await new Promise((resolve, reject) => {
      nslookup("tasks." + serviceName + "_web")
        .server("127.0.0.11")
        .end((err, addrs) => {
          resolve(addrs);
          reject(err);
        });
    });
  }

  // TODO 没有考虑节点离开网络的情况
  connectSocket(socket, serverIP) {
    this.sockets[serverIP] = socket;
  }

  async waitingForOpen(socket) {
    return await new Promise((resolve, reject) => {
      socket.onopen = () => {
        console.log("made it!");
        resolve(socket);
      };
      socket.onerror = event => {
        reject("connection fail:" + event.message);
      };
    });
  }

  async connectToServer(server) {
    if (!this.sockets[server]) {
      try {
        const socket = new WebSocket(
          `ws://${server}:${LISTENING_PORT}` +
            `?role=client&token=${Client.sign(MYIP, CLIENT_SECRET)}&ip=${MYIP}`
        );
        this.connectSocket(await this.waitingForOpen(socket), server);
      } catch (err) {
        console.log(err);
      }
    }
  }

  async broadcastAndWaitForReply(data) {
    try {
      let result = await Promise.all(
        Object.values(this.sockets).map(socket =>
          this.sendAndWaitForResponse(socket, data, 1000)
        )
      );

      console.log(JSON.stringify(this.countMsgs(result)));
    } catch (err) {
      console.log(err);
    }
  }

  async sendAndWaitForResponse(socket, data, ms) {
    try {
      return await Promise.race([
        new Promise(resolve => {
          socket.onmessage = event => {
            resolve(event.data);
          };
          socket.send(data);
        }),
        new Promise(resolve => {
          setTimeout(() => resolve(null), ms);
        })
      ]);
    } catch (err) {
      console.log(err);
    }
  }

  broadcastToServers(data) {
    for (let ip in this.sockets) {
      try {
        this.sockets[ip].send(JSON.stringify(data));
      } catch (err) {
        console.log(err);
      }
    }
  }

  async waitForResponse(socket) {
    try {
      return await new Promise((resolve, reject) => {
        socket.onmessage = event => {
          resolve(event.data);
        };

        setTimeout(reject(new Error("timeout to wait for reply")), 10000);
      });
    } catch (err) {
      console.log(err);
    }
  }

  static sign(data, secret) {
    return CryptoJS.HmacMD5(data, secret).toString();
  }
}

client = new Client();

module.exports = client;
