$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dateFormat = function(date) {
            var dt = new Date(date);
            var y = dt.getFullYear();
            var m = addZ(dt.getMonth() + 1);
            var d = addZ(dt.getDate());
            var h = addZ(dt.getHours());
            var mm = addZ(dt.getMinutes());
            var s = addZ(dt.getSeconds());


            return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s;

        }
        // 定义补零函数
    function addZ(n) {
        return n > 9 ? n : '0' + n
    }
    //定义一个查询的参数对象，后面请求数据的时候，需要将参数对象发送到服务器
    var q = {
        pagenum: 1, //默认显示第一页的页码
        pagesize: 2, //每页显示2条数据
        cate_id: '', //文章分类的id
        state: '', //文章的状态
    };
    initTable()
    initCate()
        //发送获取文章的列表数据
        // 定义初始化渲染函数
    function initTable() {

        $.ajax({
            method: 'GET',
            url: `/my/article/list`,
            data: q,
            success: res => {
                if (res.status !== 0) {
                    return layer.msg(`获取文章列表失败`)
                }
                console.log(res);
                //成功的话就把数据渲染到页面启用模板引擎
                var tableStr = template('tpl-table', res);
                $('tbody').html(tableStr);
                //调用渲染分页的方法
                renderPage(res.total);
            }
        })

    }

    //获取文章分类的函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: `/my/article/cates`,
            success: res => {
                if (res.status !== 0) {
                    layer.msg(`获取分类失败`)
                }
                //调用模板引擎渲染分类的可选项
                var cateStr = template('tpl-cate', res);

                $('[name=cate_id]').html(cateStr);
                form.render()
            }
        })

    };
    //监听表单提交事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        //获取表单中选中项的值；
        var cate_id = $('[name=cate_id').val();
        var state = $('[name=state]').val();
        //给事件对象q赋值
        q.cate_id = cate_id;
        q.state = state;
        //赋值后再调用初始化渲染页面的函数
        initTable()

    });
    //分页的函数
    function renderPage(total) {
        //调用layui的分页方法
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
                ,

            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //根据最新的q 拿到最新的列表数据
                //首次不执行
                if (!first) {
                    //do something
                    initTable()
                }

            }
        });
    };
    //点击删除按钮删除当前文章
    $('tbody').on('click', '.delbtn', function() {
        //弹出弹出层
        var id = $(this).attr('data-id')
        console.log(id);
        var len = $('.delbtn').length;
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: `/my/article/delete/` + id,
                success: res => {
                    if (res.status !== 0) {
                        return layer.msg(`删除文章失败`)
                    }
                    layer.msg(`删除文章成功`);
                    //分页的信息需要与页面中的数据相匹配，通过页面中删除按钮的length来判断
                    if (len === 1) {
                        //这种情况下说明，页面上只有一个删除按钮了，再让len -1 页面上就没有数据了  
                        //页面最小值是 1  ，小于1 的时候就永远等于1
                        q.pagenum = q.pagenum === 1 ? 1 : q, pagenum - 1
                    }
                    initTable()


                }
            })

            layer.close(index);
        });




    })






})