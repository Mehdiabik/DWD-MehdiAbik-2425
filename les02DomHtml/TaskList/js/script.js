const taskList = document.querySelector('#tasks');
const taskForm = document.querySelector('#frmTask');
const priorityList = taskForm.querySelector('#selPriority');
const task = taskForm.querySelector('#txtTask');
const deadline = taskForm.querySelector('#datDeadline');

taskForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // kleuren en belangrijkheid met priority
    const prioriteit = priorityList[priorityList.selectedIndex].value;
    let priorityColor;
    if (prioriteit === 'low') {
        priorityColor = 'nietbelangrijk';
    } else if (prioriteit === 'normal') {
        priorityColor = 'normaal';
    } else if (prioriteit === 'high') {
        priorityColor = 'belangrijk';
    }

    // wat er komt
    taskList.innerHTML += `<div class="task">
    <span class="priority ${priorityColor} material-icons">assignment</span>
    <p class="tasktext">${task.value} ${deadline.value ? `<span class="deadline">(deadline: ${deadline.value} )</span>` : ''}</p>
    <span class="complete material-icons">more_horiz</span>
 </div>`;
});

// click eventlistener to check tasks
taskList.addEventListener('click', function(e) {
    const iconComplete = e.target;
    if (!iconComplete.classList.contains('complete')) return;
    if (iconComplete.innerHTML == 'more_horiz') {
        iconComplete.innerHTML = 'done';
        iconComplete.classList.add('done');
    } else {
        iconComplete.innerHTML = 'more_horiz';
        iconComplete.classList.remove('done');
    }
});
