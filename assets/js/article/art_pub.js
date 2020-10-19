$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initCate()
    initEditor()
        //定义一个获取下拉列表中文章分类的函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: `/my/article/cates`,
            success: res => {
                if (res.status !== 0) {
                    return layer.msg(`获取文章分类失败`)
                }
                //成功就渲染下拉列表
                var tmpStr = template('tpl-cate', res)
                $('[name=cate_id]').html(tmpStr);
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //点击封面选择按钮，让file自点击
    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click()
        })
        //监听filechange事件，实现图片替换效果
    $('#coverFile').on('change', function(e) {
        var filesList = e.target.files;
        if (filesList.length < 1) {
            return layer.msg(`请选择照片`)
        }
        //拿到用户选择的图片,创建url地址
        var file = e.target.files[0];
        var newImgURL = URL.createObjectURL(file);
        $image.cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    });

    //定义一个变量
    var art_state = `已发布`;
    //点击存为草稿按钮的时候将状态变为草稿
    $('#btnSave2').on('click', function() {
        art_state = `草稿`
    });
    // 为表单绑定监听提交的事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        fd.append('state', art_state);

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                    //发起ajax请求
                pubArticle(fd)
            })

    });

    function pubArticle(fd) {
        $.ajax({
            method: 'POST',
            url: `/my/article/add`,
            data: fd,
            contentType: false,
            processData: false,
            success: res => {
                if (res.status !== 0) {
                    return layer.msg(`发布文章失败`)
                }
                layer.msg(`发布文章成功`);
                location.href = `/article/art_list.html`
            }


        })
    }

})