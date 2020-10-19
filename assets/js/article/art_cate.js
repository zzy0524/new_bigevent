$(function() {
    initArticleList()
    var layer = layui.layer;
    var form = layui.form;
    //获取文章分类的列表
    function initArticleList() {
        $.ajax({
            method: 'GET',
            url: `/my/article/cates`,
            success: res => {
                if (res.status !== 0) {
                    layer.msg(`获取文章分类列表失败`)
                }
                // layer.msg(`获取文章分类列表成功`);
                //拿到文章信息渲染页面
                // console.log(res.data);
                var result = template('tpl', res);
                $('tbody').html(result);
            }
        })
    }

    var indexAdd = null;
    //点击添加类别，弹出弹出层
    $('#addCate').on('click', function() {
        // alert(1)

        indexAdd = layer.open({
            type: 1,
            area: [`500px`, `250px`],
            title: `添加文章分类`,
            content: $('#addinnerStr').html()
        });

    });
    //事件委托动态监听表单提交事件,发起ajax请求。并把数据更新渲染到页面
    $('body').on('submit', '#addform', function(e) {
        e.preventDefault()
        var data = $('#addform').serialize();
        $.ajax({
            method: `POST`,
            url: `/my/article/addcates`,
            data,
            success: res => {
                console.log(res);
                if (res.status !== 0) {
                    layer.msg(`新增文章分类失败`)
                }
                initArticleList()
                layer.close(indexAdd)
            }
        })

    });
    var indexEidt = null;
    //点击列表中的编辑按钮弹出编辑的弹出层，需要事件委托
    $('tbody').on('click', '#editbtn', function() {
        // alert(1)
        indexEidt = layer.open({
            type: 1,
            area: [`500px`, `250px`],
            title: `编辑文章分类`,
            content: $('#editinnerStr').html()
        });
        // console.log($(this));
        var Id = $(this).attr('data-id');
        // console.log(Id);//通过给按钮设置属性，在点击的时候拿到按钮对应的当前数据行的id值，后面要用
        //发起ajax请求
        $.ajax({
                method: 'GET',
                url: `/my/article/cates/` + Id,
                success: res => {
                    // console.log(res);
                    if (res.status !== 0) {
                        layer.msg(`获取数据失败`)
                    }
                    //用layui的form快速赋值功能，把获取到的当前行的数据赋给当天弹出表格
                    form.val('addform', res.data);
                }
            })
            //给编辑弹出的弹出层里面确认修改按钮绑定提交事件
        $('#reAddbtn').on('click', function(e) {
            e.preventDefault();
            // alert(1)
            var data = $('#editform').serialize();
            console.log(data);
            $.ajax({
                method: 'POST',
                url: `/my/article/updatecate`,
                data,
                success: res => {
                    if (res.status !== 0) {
                        layer.msg(`跟新失败`)
                    }
                    console.log(res);
                    initArticleList();
                    layer.close(indexEidt)
                }
            })
        })

    });
    //点击删除按钮删除弹出弹出层并且需要确认是否删除
    $('tbody').on('click', '#delbtn', function() {
        // alert(1)
        var Id = $(this).attr('data-id');
        layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function(index) {
            //发送删除数据的ajax请求
            $.ajax({
                method: 'GET',
                url: `/my/article/deletecate/` + Id,
                success: res => {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功');
                    initArticleList();
                    layer.close(index);
                }

            })


        });







    })


















})