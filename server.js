let express = require('express');//引入express模块
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

var users = []; // 储存登录用户
var usersInfo = [];  // 存储用户姓名和头像

// 路由为/默认client静态文件夹
app.use('/', express.static(__dirname + '/client'));

io.on('connection',function (socket) {
    //渲染在线人员
    io.emit('disUser',usersInfo);

    //登录，检测用户名
    socket.on('login',(user)=>{
        if(users.indexOf(user.name)>-1){    //判断昵称是否存在
            socket.emit('loginError');    //触发客户端的登录失败事件
        }else{
            users.push(user.name);    //存储用户昵称
            usersInfo.push(user);    //存储用户的昵称和头像
            socket.emit('loginSuc');   //触发客户端的登录成功事件
            socket.nickname = user.name;
            io.emit('system',{        //向所有用户广播该用户进入房间
                name:user.name,
                status:'进入'
            });
            io.emit('disUser',usersInfo);   //渲染右侧在线人员信息
            console.log(users.length + 'user connect');   //打印连接人数
        }
    })

    // 发送消息事件
    socket.on('sendMsg', (data)=> {
        var img = '';
        for(var i = 0; i < usersInfo.length; i++) {
            if(usersInfo[i].name == socket.nickname) {
                img = usersInfo[i].img;
            }
        }
        socket.broadcast.emit('receiveMsg', {
            name: socket.nickname,
            img: img,
            msg: data.msg,
            color: data.color,
            type: data.type,
            side: 'left'
        });
        socket.emit('receiveMsg', {
            name: socket.nickname,
            img: img,
            msg: data.msg,
            color: data.color,
            type: data.type,
            side: 'right'
        });
    });
});

//路由为localhost:3000时向客户端响应"Hello"
app.get('/',function(req,res){
    res.send(index);//发送数据
});

//监听3000端口
http.listen(3000,function(){
    console.log("3000端口启动");
});