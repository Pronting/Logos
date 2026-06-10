---
title: BRICS区块链比赛流程
pubDate: 2023-09-24
description: 区块链比赛流程
category: 区块链
image: ""
draft: false
slugId: momo/intro/comment
---

> BRICS比赛流程梳理如下，从上到下的顺序为比赛流程的顺序。总共3个部分，从环境搭建到常见问题踩坑。提供了参考。整合了许多文档于一体的一部参考文档。对于未完成的部分，未来会完成补坑。

# 🥇区块链平台运维

---

## 基于提供的开发环境，使用离线安装包搭建区块链网络平台，含 **FISCO BCOS** 区块链底层平台和 **Console**控制台等

### 登录Linux服务器，安装并部署2节点Fisco联盟链

1. 安装Ubuntu对于Fisco-Bcos依赖

   ```shell
   sudo apt install -y openssl curl
   ```

2. 创建区块链比赛目录

   ```shell
   cd ~ && mkdir -p fisco && cd fisco
   ```

3. 下载安装脚本

   ```shell
   curl -#LO https://osp-1257653870.cos.ap-guangzhou.myqcloud.com/FISCO-BCOS/FISCO-BCOS/releases/v2.9.1/build_chain.sh && chmod u+x build_chain.sh
   ```

4. 搭建2节点联盟链

   ```shell
   bash build_chain.sh -l 127.0.0.1:2 -p 30300,20200,8545
   ```

   命令执行成功会输出`All completed`。如果执行出错，请检查`nodes/build.log`文件中的错误信息。

5. 启动2节点联盟链

   ```shell
   bash nodes/127.0.0.1/start_all.sh
   ```

   启动成功如下所示

   ```shell
   try to start node0
   try to start node1
   node0 start successfully
   node1 start successfully
   ```

6. 检查进程是否成功启动

   ```shell
   ps -ef | grep -v grep | grep fisco-bcos
   ```

   正常情况会有类似下面的输出； 如果进程数不为2，则进程没有启动（一般是端口被占用导致的）

   ```shell
   fisco       5453     1  1 17:11 pts/0    00:00:02 /home/ubuntu/fisco/nodes/127.0.0.1/node0/../fisco-bcos -c config.ini
   fisco       5459     1  1 17:11 pts/0    00:00:02 /home/ubuntu/fisco/nodes/127.0.0.1/node1/../fisco-bcos -c config.ini
   ```

   

###  安装并部署Console控制台，检查部署的Console控制台是否正常运行

1. 系统安装Java

   ```shell
   sudo apt install -y default-jdk
   ```

2. 获取控制台并返回fisco目录

   ```shell
   cd ~/fisco && curl -#LO https://gitee.com/FISCO-BCOS/console/raw/master-2.0/tools/download_console.sh && bash download_console.sh
   ```

3. 拷贝控制台配置文件

   ```shell
   cp -r nodes/127.0.0.1/sdk/* console/conf/
   ```

   将刚刚搭建的2节点下sdk所有证书配置文件赋值到控制台中的配置文件目录

4. 启动并使用控制台，检测控制台是否安装配置成功

   ```shell
   cd ~/fisco/console && bash start.sh
   ```

   这是正确无误的启动情况

   ```shell
   =============================================================================================
   Welcome to FISCO BCOS console(2.6.0)！
   Type 'help' or 'h' for help. Type 'quit' or 'q' to quit console.
    ________  ______   ______    ______    ______         _______    ______    ______    ______
   |        \|      \ /      \  /      \  /      \       |       \  /      \  /      \  /      \
   | $$$$$$$$ \$$$$$$|  $$$$$$\|  $$$$$$\|  $$$$$$\      | $$$$$$$\|  $$$$$$\|  $$$$$$\|  $$$$$$\
   | $$__      | $$  | $$___\$$| $$   \$$| $$  | $$      | $$__/ $$| $$   \$$| $$  | $$| $$___\$$
   | $$  \     | $$   \$$    \ | $$      | $$  | $$      | $$    $$| $$      | $$  | $$ \$$    \
   | $$$$$     | $$   _\$$$$$$\| $$   __ | $$  | $$      | $$$$$$$\| $$   __ | $$  | $$ _\$$$$$$\
   | $$       _| $$_ |  \__| $$| $$__/  \| $$__/ $$      | $$__/ $$| $$__/  \| $$__/ $$|  \__| $$
   | $$      |   $$ \ \$$    $$ \$$    $$ \$$    $$      | $$    $$ \$$    $$ \$$    $$ \$$    $$
    \$$       \$$$$$$  \$$$$$$   \$$$$$$   \$$$$$$        \$$$$$$$   \$$$$$$   \$$$$$$   \$$$$$$
   
   =============================================================================================
   ```

   

### 使用MySQL数据库对搭建的节点数据进行存储，并命名为Node0和Node1。







## 完成区块链中间件WeBASE-Front搭建，以及按要求进行网络的扩容和网络配置等维护操作

### 安装并检查部署的WeBASE-Front中间件是否正常运行

#### 需要安装的环境

##### 环境依赖

1. java: 8 ✅

请注意：***WeBASE-Front依赖于JAVA_HOME。如果没有配置JAVA_HOME，请优先配置JAVA_HOME在完成以下操作***

* 查看位置

  ```shell
  which java
  ```

  输出：`/usr/bin/java`

* 确定Java安装位置

  ```shell
  ls -lr /usr/bin/java
  ls -lrt /etc/alternatives/java
  ```

  输出：`/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.181-3.b13.el7_5.x86_64`。这个就是Java的安装目录。

* 打开配置环境变量的文件

  ```shell
  vim /etc/profile
  ```

  添加如下配置

  ```shell
  export JAVA_HOME=java安装目录
  export JRE_HOME=$JAVA_HOME/jre
  export CLASSPATH=$JAVA_HOME/lib:$JRE_HOME/lib:$CLASSPATH
  export PATH=$JAVA_HOME/bin:$JRE_HOME/bin:$PATH
  ```

* 刷新并测试是否配置成功

  ```shell
  source /etc/profile && echo $JAVA_HOME
  ```

  

#### 安装



1. 下载安装包

   ```shell
   wget https://osp-1257653870.cos.ap-guangzhou.myqcloud.com/WeBASE/releases/download/v1.5.5/webase-front.zip
   ```

2. 解压并进入目录

   ```shell
   unzip webase-front.zip
   cd webase-front
   ```

3. 拷贝sdk证书文件(build_chain生成的)

   ```shell
   cp -r nodes/${ip}/sdk/* ./conf/
   ```

4. 服务启动

   ```shell
   bash start.sh
   ```

5. 启动成功出现如下日志

   ```shell
   ...
   	Application() - main run success...
   ```

#### 检查

1. 访问浏览器http://ipaddr:5002/WeBASE-Front/看是否能够访问web平台

2. 检查节点进程

   ```shell
   ps -ef | grep node
   ```

   输出如下，此处部署了两个节点node0, node1

   ```shell
   root     29977     1  1 17:24 pts/2    00:02:20 /root/fisco/webase/webase-deploy/nodes/127.0.0.1/node1/../fisco-bcos -c config.ini
   root     29979     1  1 17:24 pts/2    00:02:23 /root/fisco/webase/webase-deploy/nodes/127.0.0.1/node0/../fisco-bcos -c config.ini
   ```

3. 检查节点前置webase-front的进程

   ```shell
   ps -ef | grep webase.front 
   ```

   正常输入如下

   ```shell
   root     31805     1  0 17:24 pts/2    00:01:30 /usr/local/jdk/bin/java -Djdk.tls.namedGroups=secp256k1 ... conf/:apps/*:lib/* com.webank.webase.front.Application
   ```

   







### 登陆linux服务器，生成新的节点，并且将该节点启动及加入当前群组

这里的详细操作请参考文档➡️➡️[如何生成节点并添加到群组](https://www.cnblogs.com/pronting/p/17762939.html)













## 针对搭建的区块链网络平台，使用Caliper压力测试工具对区块链网络平台进行性能测试

### 搭建Caliper环境

##### 环境依赖：

1. NodeJS: 14 ✅
2. Docker >= 20 ✅
3. Docker Compose >= 1.22.0 ✅
4. Python >=2.7 ✅
5. 安装make, g++, gcc, git ✅
6. 需要外网权限 ✅

##### 下载caliper,并安装验证

```shell
npm install --only=prod @hyperledger/caliper-cli@0.2.0
```

```shell
npx caliper --versi
```

成功会打印版本信息v0.2.0。如果错误，请检查环境是否完整或者版本是否对应。

![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260610131056285.png)

##### 绑定FISCO-BCOS(需要外网，自行准备clash ✒️[clash操作地址](https://github.com/frozeman/bignumber.js-nolookahead/))

```shell
npx caliper bind --caliper-bind-sut fisco-bcos --caliper-bind-sdk latest
```

![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260610131127066.png)

##### 下载测试用例

> 在Caliper目录下通过git拉去测试代码,由于网络原因，这里使用gitee

```shell
git clone https://gitee.com/vita-dounai/caliper-benchmarks.git
```

![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260610131149132.png)

##### 修改源码

一共要修改4个文件的源码，分别是`fiscoBcos.js`，`channelPromise.js`，`web3sync.js`, 一个依赖包版本`secp256k1`

1. 修改`fiscoBcos.js`

   ```shell
   vim ./node_modules/@hyperledger/caliper-fisco-bcos/lib/fiscoBcos.js
   ```

   ![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260610131209471.png)

   ![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260610131350991.png)

   ![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260610131410488.png)

2. 修改`channelPromise.js`

   ```shell
   vim ./node_modules/@hyperledger/caliper-fisco-bcos/lib/channelPromise.js
   ```

   ![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260610131432476.png)

3. 修改`web3sync.js`

   ```shell
   vim ./node_modules/@hyperledger/caliper-fisco-bcos/lib/web3lib/web3sync.js
   ```

   ![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260610131457445.png)

   ![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260610131515842.png)

   ![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260610131538334.png)

4. 修改`package.json`文件，添加`secp256k1` 依赖

   ```shell
   vim node_modules/@hyperledger/caliper-fisco-bcos/package.json
   ```

   ![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260610131603645.png)

   在该目录下重新安装依赖：

   ```shell
   npm i
   ```

   ##### 基于刚刚下载的测试用例进行压测

   进入caliper目录中输入如下命令：

   ```shell
   npx caliper benchmark run --caliper-workspace caliper-benchmarks --caliper-benchconfig benchmarks/samples/fisco-bcos/helloworld/config.yaml --caliper-networkconfig networks/fisco-bcos/4nodes1group/fisco-bcos.json
   ```

   等命令执行完成之后会显示如下页面：

   

   ![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260610131626463.png)

   ![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260610131652162.png)

   如上图所示，显示了4个节点的内存，磁盘使用率，每秒交易的TPS,最大与最小响应时间

   在caliper-benchmarks中也有report.html文件方便查看。



### Caliper 使用

1. 启动webase平台(webase-front)

2. 在caliper目录中：

   ```shell
   cd ./caliper-benchmarks/networks/fisco-bcos
   mkdir myProject
   ```

3. 在该目录创建`fisco-bcos.json`

   ![image-20230924151049599](https://img2023.cnblogs.com/blog/3282079/202310/3282079-20231013181715516-199367836.png)

   

### 使用Caliper和HelloWorld合约对区块链网络进行压测。



# 🥈智能合约开发

---

## 基于题目中的业务逻辑，使用 Solidity 语言进行智能合约开发，并完成合约编译、部署以及运行测试。









### 根据提供的Solidity智能合约代码框架完成银行、核心企业、供应商的功能，并且完成银行向核心企业提供授信并发放数字凭证，企业转让数字凭证。











### 完成智能合约的部署、编译与接口调用的运行测试，并将结果截图提交至工程文档。













## 智能合约代码测试，基于Ganache私有链环境，使用Truffle框架编写JavaScript脚本对Solidity智能合约进行单元测试

### 安装Ganache与Truffle

##### 环境要求

1. NodeJS v8.9.4 或 之后的版本

##### 安装Ganache

* [Ganache工具下载](https://trufflesuite.com/ganache/)

* 下载成功如图所示

  ![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260610131736402.png)

##### 安装Truffle

1. 使用npm安装Truffle

   ```shell
   npm install -g truffle@5.8.2
   ```

2. 创建项目并未当前用户添加权限

   ```shell
   truffle init && sudo chmod -R 777 你创建的truffle文件夹目录地址
   ```

   如果在安装的过程中出现了错误的token，如图所示。

   ![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260610131756815.png)

   建议升级node版本或者npm版本，然后清除npm缓存，再不行就卸载重装最新版本node。即可解决这一问题。

   

3. 修改配置文件

   ![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260610131819578.png)

   ![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260610131848920.png)



### 基于Ganache与Truffle完成简单测试查看是否安装配置成功

> 在启动Ganache私有链环境与Truffle框架配置完成之后就可以进行如下操作。

1. 在项目目录下编译部署之后：

```shell
truffle compile && truffle migrate
```

2. 成功之后会显示如下信息，包括账户信息，资产信息，合约地址以及用户地址。

![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260610131920872.png)

如果合约地址在链上出现，说明合约部署成功并完成上链操作

![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260610131942831.png)

3. 写完之后的合约进行单元测试

   ```shell
   truffle test ./test/你编写的测试脚本
   ```

   3.1. 这里提供`HelloWorld.sol` 的测试脚本，仅作为参考

   ```js
   const helloWorld = artifacts.require("HelloWorld");
   
   contract("helloWorld", async(accounts)=>{
       let var_data;
       it("Test HelloWorld get", async() =>{
           const hello = await helloWorld.deployed();
           const var_data = await hello.getName();
           assert.equal(var_data, "HelloWorld", "ok");
       })
       it("Test HelloWorld set", async() =>{
           const hello = await helloWorld.deployed();
           await hello.setName("Hello Chain!");
       })
       it("Test HelloWorld get2", async() =>{
           const hello = await helloWorld.deployed();
           const var_data = await hello.getName();
           assert.equal(var_data, "Hello Chain!", "ok2")
       })
   })
   ```

   测试成功如下图所示⬇️⬇️⬇️

   ![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260610132010450.png)





### 完成智能合约代码中实现函数的功能测试







### 完成智能合约的漏洞测试









### 针对提供的合约代码，完成智能合约测试，并将测试结果截图提交至工程文档









# 🥉应用开发与部署

---

## 利用 HTML、Javascript前端框架等完成页面逻辑和展示

### 基于前端系统的开发模板，在Login.vue等文件中添加对应的登录与注册功能，实现对后端系统的访问，并测试功能完整性。









### 在框架代码中完善对应企业信息、凭证信息等数据的查询页面。











## 利用 Java 语言和SpringBoot框架，实现应用程序接口、完善区块链应用系统，调用智能合约开发结果，实现链上信息的查询和结果展示

### 开发区块链供应链金融应用中后端系统对应的数据查询功能，包括公司信息列表、银行信息列表、存证信息列表等功能









### 开发区块链供应链金融应用的后端系统中包含的存证交易功能











## 对区块链应用的后端接口进行测试

















## 按要求完成前后端的集成测试