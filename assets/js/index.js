$(function() {
        //调用函数获取用户基本信息
        getUserInfo()

        //实现点击退出功能，给退出绑定点击事件
        $('#btnLogout').on('click', function() {

            layer.confirm('确认退出吗？', function(index) {
                //do something
                location.href = `/login.html`
                layer.close(index);
            });

        })



    })
    //获取用户基本信息
function getUserInfo() {

    $.ajax({
        method: 'GET',
        url: `/my/userinfo `,
        //配置请求头对象
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: res => {
            if (res.status !== 0) {
                // console.log(res.message);
                return layui.layer.msg(`获取用户信息失败`)
            }
            console.log(res);
            //调用渲染用户头像部分的函数
            renderAvater(res.data)
        }
    })

};

function renderAvater(user) {
    //如果有昵称优先显示昵称否则就显示用户名
    var name = user.nickname || user.username;
    $('.welcome').html(`欢迎&nbsp;&nbsp${name}`);
    // 3. 按需渲染用户的头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avater').hide()
    } else {
        $('.layui-nav-img').hide();
        $('.text-avater').show();
        var first = name[0].toUpperCase()
        $('.text-avater').html(first)
    }
}