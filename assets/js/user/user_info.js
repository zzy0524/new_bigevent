$(function() {
    var form = layui.form
        // console.log(form);
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return `昵称长度必须在1-6个字符之间`
            }
        }
    });
    initUserInfo()
        //获取用户基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: `/my/userinfo`,
            success: res => {
                if (res.status !== 0) {
                    console.log(`获取用户信息失败`);
                }
                console.log(res);
                //调用form.val快速为表单赋值
                form.val('userForm', res.data)
            }
        })

    }

    //给重置按钮绑定点击事件
    $('#btnreset').on('click', function(e) {
        e.preventDefault();
        initUserInfo()
    });
    //监听提交修改表单的事件
    $('.layui-form').submit(function(e) {
        e.preventDefault();
        //发起更新用户信息的请求
        $.ajax({
            method: 'POST',
            url: `/my/userinfo`,
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layer.msg(`更新用户信息失败`)
                }
                layer.msg(`更新用户信息成功`);
                //调用父页面中的方法更新用户的信息
                window.parent.getUserInfo();
            }
        })
    })





})