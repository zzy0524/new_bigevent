$(function() {
    var form = layui.form;
    //自定义表单校验规则
    form.verify({
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value) {
            if (value == $('[name=oldPwd]').val()) {
                return `新旧密码不能相同`
            }

        },
        rePwd: function(val) {
            if (val !== $('[name=newPwd]').val()) {
                return `两次密码不一致，请重新确认`
            }

        }
    })

    //填写更新的表单密码后，点击修改密码需要发起请求
    //监听表单提交事件
    $('.layui-form').submit(function(e) {
        e.preventDefault();
        $.ajax({
            method: `POST`,
            url: `/my/updatepwd`,
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layui.layer.msg(`更新密码失败`)
                }
                layui.layer.msg(`更新密码成功`)
                    //表单重置
                $('.layui-form')[0].reset()
            }
        })
    })



})