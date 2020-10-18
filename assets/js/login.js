$(function() {
    //点击登录注册的a标签跳转页面
    $('#link_reg').on('click', function() {

        $('.login-box').hide();
        $('.reg-box').show()
    });
    $('#link_login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show()
    });
    //从layui中 获取form对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过form.verify配置校验规则
    form.verify({

            pass: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            username: function(value, item) { //value：表单的值、item：表单的DOM对象
                if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                    return '用户名不能有特殊字符';
                }
                if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                    return '用户名首尾不能出现下划线\'_\'';
                }
                if (/^\d+\d+\d$/.test(value)) {
                    return '用户名不能全为数字';
                }
            },
            //校验两次密码不一致的问题
            repass: function(val) {
                var inputVal = $('.reg-box [name=password]').val();
                if (inputVal !== val) {
                    return `两次密码不一致`
                }
            }

            //我们既支持上述函数式的方式，也支持下述数组的形式
            //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]

        })
        //监听注册表单的提交事件
    var baseUrl = `http://ajax.frontend.itheima.net`;
    $('#reg_form').on('submit', function(e) {
            e.preventDefault();

            $.ajax({
                method: 'POST',
                url: baseUrl + `/api/reguser`,
                data: {
                    username: $('.reg-box [name=username]').val(),
                    password: $('.reg-box [name=password]').val()
                },
                success: res => {
                    if (res.status !== 0) {
                        // return console.log(res.message);
                        return layer.msg(res.message)
                            //使用layui的layer方法的msg属性提示信息
                    }
                    layer.msg(`注册成功，请登录`);
                    //自动调用模拟点击登录事件
                    $('#link_login').click();
                }
            })
        })
        //监听登录表单的提交事件
    $('#login_form').submit(function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: baseUrl + `/api/login`,
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                        //使用layui的layer方法的msg属性提示信息
                }
                // layer.msg(`登录成功`);
                // console.log(res.token);

                //登录成功跳转至后台页面
                location.href = `/index.html`;
                //需要把token保存到本地,获取用户信息时要使用
                localStorage.setItem('token', res.token);
            }

        })


    })











})