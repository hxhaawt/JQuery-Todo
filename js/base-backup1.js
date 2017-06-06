/**
 * Created by hxh on 2017/6/3.
 */

;(function () {

    "use strict";

    // console.log('JQuery', jQuery);

    let $formAddTask = $('.add-task')
        ,$deleteTask = $('.action.delete')
        ,$taskDetail = $('.task-detail')
        ,$taskDetailMask = $('.task-detail-mask')
        ,$taskList = $('.task-list')
        ,taskList = []
    ;

    // 初始化任务
    init();
    // 初始化 任务删除监听函数
    listDeleteTask();
    // 初始化 任务详情 监听函数
    listTaskDetail();

    
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

        console.log(newTask);

        // 存入新的task
        if (addTask(newTask)){

            $input.val(null);
        }
    });


    function listDeleteTask() {

        console.log("list delete task");

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

        $taskList.on('click', '.action.detail', function (e) {

            let $this = $(this);
            let $item = $this.parent().parent();
            let index = $item.data('index');

            showTaskDetail(index);
        });
    }

    function showTaskDetail(index) {

        $taskDetail.show();
        $taskDetailMask.show();
    }

    function init() {

        // store.clear();
        // console.log("init task");

        taskList = store.get('taskList') || [];

        // console.log(taskList);

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

        // console.log(taskList.length);

        // delete taskList[index];
        taskList.splice(index, 1);

        // console.log(taskList.length);

        // 更新本地存储和用户界面
        refreshTaskList();

    }

    function updateTaskList() {

        let len = taskList.length;
        let $taskList = $('.task-list');
        $taskList.html("");

        for (let i=0; i<len; i++){
            let $task = renderTaskTpl(taskList[i], i);
            $taskList.append($task);
        }

        $deleteTask = $('.action.delete');
    }

    function renderTaskList() {

        // let len = taskList.length;
        // let $taskList = $('.task-list');
        // $taskList.html("");
        //
        // for (let i=0; i<len; i++){
        //     let $task = renderTaskTpl(taskList[i]);
        //     $taskList.append($task);
        // }

        let len = taskList.length;
        let $taskList = $('.task-list');

        let $task = renderTaskTpl(taskList[len-1], len-1);
        $taskList.append($task);

        $deleteTask = $('.action.delete');

    }
    
    function renderTaskTpl(data, index) {

        if (!data) return;

        let listItem =
            ' <div class="task-item" data-index=" ' + index + '">' +
                '<span><input type="checkbox"></span>'+
                '<span class="task-content">'+ data.content +'</span>' +
                '<span class="fr">' +
                    '<span class="action delete"> 删除</span>' +
                    '<span class="action detail"> 详细</span>' +
                '</span>'+

            '</div>';

        return $(listItem);
    }
    
    
    
    
    
    
})();











