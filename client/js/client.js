
$(function () {
    // io-client
    // 连接成功会触发服务器端的connection事件
    var socket = io();

    // 点击输入昵称，回车登录
    $('#name').keyup((ev)=> {
        if(ev.which == 13) {
            inputName();
        }
    });
    $('#nameBtn').click(inputName);
    // 登录成功，隐藏登录层
    socket.on('loginSuc', ()=> {
        $('.name').hide();
    })
    socket.on('loginError', ()=> {
        alert('用户名已存在，请重新输入！');
        $('#name').val('');
    });

    function inputName() {
        var imgN = Math.floor(Math.random()*4)+1; // 随机分配头像
        if($('#name').val().trim()!=='')
            socket.emit('login', {
                name: $('#name').val(),
                img: 'image/user' + imgN + '.jpg'
            });  // 触发登录事件
        return false;
    }

    //系统提示消息
    socket.on('system',(user)=>{
        let data = new Date().toTimeString().substr(0,8);
        $('#messages').append(`<p class='system'><span>${data}</span><br /><span>${user.name}  ${user.status}了聊天室<span></p>`)
        //滚动条总是在最底部
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    })

    //显示在线人员
    socket.on('disUser',(usersInfo)=>{
        displayUser(usersInfo);
    });
    function displayUser(users) {
        $('#users').text('');   // 每次都要重新渲染
        if(!users.length){
            $('.contacts p').show();
        }else {
            $('.contacts p').hide();
        }
        $('#num').text(users.length);
        for(var i = 0; i < users.length; i++) {
            var $html = `<li>
                <img src="${users[i].img}">
                <span>${users[i].name}</span>
            </li>`;
            $('#users').append($html);
        }
    }

    //点击按钮或回车键发送消息
    $('#sub').click(sendMsg);
    $('#m').keyup((ev)=>{
        if(ev.which ==13){
            sendMsg();
        }
    })
    //发送消息
    function sendMsg() {
        if($('#m').val()==''){
            alert('请输入内容！');
            return false;
        }
        socket.emit('sendMsg',{
            msg:$('#m').val()
        });
        $('#m').val('');
        return false;
    }

    //接收消息
    socket.on('receiveMsg',(obj)=>{
        $('#messages').append(`
            <li class='${obj.side}'>
          <img src="${obj.img}">
          <div>
            <span>${obj.name}</span>
            <p>${obj.msg}</p>
          </div>
        </li>
        `);
        //滚动条总是在最底部
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    })
})