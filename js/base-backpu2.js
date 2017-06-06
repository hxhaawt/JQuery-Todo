/**
 * Created by hxh on 2017/6/3.
 */

;(function () {

    "use strict";

    // console.log('JQuery', jQuery);

    let $formAddTask = $('.add-task')
        // ,$deleteTask = $('.action.delete')
        ,$taskDetail = $('.task-detail')
        ,$taskDetailMask = $('.task-detail-mask')
        ,$taskList = $('.task-list')
        ,taskList = []
        ,currentIndex
        ,$updateForm
        ,$taskDetailContent
        ,$taskDetailContentInput
        ,$checkboxComplete
    ;

    // 初始化任务
    init();
    // 初始化 任务删除监听函数
    listDeleteTask();
    // 初始化 任务详情 监听函数
    listTaskDetail();
    // 监听 checkbox 点击 事件
    listCheckboxComplete();
    
    $formAddTask.on('submit', function (e) {

        let newTask = {};
        // console.log(newTask);

        let $input = $(this).find('input[name=content]');

        // 禁用默认行为
        e.preventDefault();

        // 获取新task的值
        newTask.content = $input.val();

        // 如果新task值为空，则直接返回
        if (!newTask.content)   return;

        // console.log(newTask);

        // 存入新的task
        if (addTask(newTask)){

            $input.val(null);
        }
    });

    // 监听 点击 删除 按钮事件
    function listDeleteTask() {

        // console.log("list delete task");

        $taskList.on('click', '.action.delete', function (e) {

            let $this = $(this);
            let $item = $this.parent().parent();
            let index = $item.data('index');

            let tmp = confirm('确认删除');
            if (tmp){
                deleteTask(index);
            }
        });
    }

    function listTaskDetail() {

        // 为任务中的 详细 按钮 注册 点击 事件
        $taskList.on('click', '.action.detail', function (e) {

            let $this = $(this);
            let $item = $this.parent().parent();
            let index = $item.data('index');

            // 输入的是字符串,要转换成数字
            index = parseInt(index);

            showTaskDetail(index);
        });

        // 为 整个任务列表 注册双击事件
        $taskList.on('dblclick', '.task-item', function () {

            let index = $(this).data('index');

            // 输入的是字符串,要转换成数字
            index = parseInt(index);

            showTaskDetail(index);
        });
    }

    // 为 显示详细信息 外面的遮盖增加点击 事件
    $taskDetailMask.on('click', function () {
        // 点击应该消失 详细信息和 遮盖界面
        hideTaskDetail();
    });

    // 监听 checkbox 点击 事件
    function listCheckboxComplete() {

        $taskList.on('click', '.complete', function () {

            let $this = $(this);
            let isChecked = $this.is(':checked');
            let index = $this.parent().parent().data('index');
            
            index = parseInt(index);
            let item = get(index);

            if (item.complete){

                updateTask(index, {complete: false});
            }else {

                updateTask(index, {complete: true});
            }
        });
    }

    function get(index) {
        return store.get('taskList')[index];
    }

    // 显示特定任务的详细信息
    function renderTaskDetail(index) {

        let itemIndex = index;

        if (isNaN(itemIndex) || itemIndex >= taskList.length){
            return ;
        }

        let item = taskList[itemIndex];

        let tpl = '<form>'+
                    '<div class="content">'+
                    item.content +
                    '</div>'+

                    '<div class="input-item">' +
                        '<input style="display: none;" type="text" name="content" value="'+ (item.content || '') +'">'+
                    '</div>'+

                    '<div>'+
                        '<div class="desc input-item">'+
                        '<textarea name="desc">' + (item.desc || '') +'</textarea>'+
                        '</div>'+
                    '</div>'+

                    '<div class="remind input-item">'+
                        '<label>提醒时间</label>'+
                        '<input class="date-time" name="remind-date" type="date" value="' + (item.remindDate || '') + '">'+
                    '</div>'+

                    '<div class="input-item">' +
                        '<button type="submit">更新</button>'+
                    '</div>'+

            '</form>';

        $taskDetail.html(null);

        $taskDetail.html(tpl);
        // $('.date-time').datetimepicker();

        // $taskDetail.append($(tpl));

        $updateForm = $taskDetail.find('form');
        $taskDetailContent = $updateForm.find('.content');
        $taskDetailContentInput = $updateForm.find('[name=content]');

        $taskDetailContent.on('dblclick', function () {

            $taskDetailContentInput.show();
            $taskDetailContent.hide();
        });

        $updateForm.on('submit', function (e) {
            e.preventDefault();

            let data = {};
            data.content = $(this).find('[name=content]').val();
            data.desc = $(this).find('[name=desc]').val();
            data.remindDate = $(this).find('[name=remind-date]').val();

            // console.log(data);
            updateTask(itemIndex, data);
            hideTaskDetail();
        });
    }

    function showTaskDetail(index) {

        renderTaskDetail(index);

        currentIndex = index;

        $taskDetail.show();
        $taskDetailMask.show();
    }

    function updateTask(index, data) {

        if (isNaN(index) || index >= taskList.length){
            console.log("updaeteTask index error");
            return ;
        }

        taskList[index] = $.extend({}, taskList[index], data);

        // console.log(taskList[index].complete);

        refreshTaskList();
    }
    function hideTaskDetail() {

        $taskDetail.hide();
        $taskDetailMask.hide();
    }

    function init() {

        // store.clear();
        taskList = store.get('taskList') || [];

        if (taskList.length){

            updateTaskList();
        }
    }

    function addTask(task) {

        taskList.push(task);

        store.set('taskList', taskList);

        renderTaskList();

        return true;
    }

    // 更新本地存储和用户界面
    function refreshTaskList() {

        // 更新 localStorage
        store.set('taskList', taskList);

        //  更新用户界面
        updateTaskList();
    }

    function deleteTask(index) {

        // 如果 index不存在 或 index值 不存在 退出
        // if (index === undefined || !taskList[index]){
        if (index >= taskList.length){
            return ;
        }

        // delete taskList[index];
        taskList.splice(index, 1);

        // 更新本地存储和用户界面
        refreshTaskList();
    }

    // 更新整个用户界面
    function updateTaskList() {

        let len = taskList.length;
        let $taskList = $('.task-list');
        $taskList.html("");
        let completeItem = [];
        let completeItemIndex = [];
        let k = 0;

        for (let i=0; i<len; i++){
            let item = taskList[i];

            if (item && item.complete){
                completeItem.push(item);
                completeItemIndex.push(i);
            }else {
                let $task = renderTaskTpl(item, i);
                $taskList.prepend($task);
            }
        }

        len = completeItem.length;
        for (let i=0; i<len; i++){
            let $task = renderTaskTpl(completeItem[i], completeItemIndex[i]);
            $task.addClass('completed');
            $taskList.append($task);
        }

        $checkboxComplete = $('.task-list .completer');

    }
    // 增加任务时，将增加的项更新到网页
    function renderTaskList() {

        let len = taskList.length;
        let $taskList = $('.task-list');

        let $task = renderTaskTpl(taskList[len-1], len-1);
        // $taskList.append($task);
        $taskList.prepend($task);
    }
    
    function renderTaskTpl(data, index) {

        if (!data) return;

        let listItem =
            ' <div class="task-item" data-index=" ' + index + '">' +
                '<span><input class="complete"'+ (data.complete ? "checked": "") +  ' type="checkbox"></span>'+
                '<span class="task-content">'+ data.content +'</span>' +
                '<span class="fr">' +
                    '<span class="action delete"> 删除</span>' +
                    '<span class="action detail"> 详细</span>' +
                '</span>'+
            '</div>';

        return $(listItem);
    }
    
    
    
    
    
    
})();











