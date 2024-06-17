// Get all the useful elements with their id or class
let listContainer = document.getElementById('list-container')
let inputBox = document.getElementById("input-box")   // Get the input-box element by its id
const deleteAllButton = document.querySelector(".delete-all");
const filterButtons = document.querySelectorAll(".filters .filter");
let filter = 'all';     // Initialize filter variable to 'all'.

// Add an even listener for the "keydown" event on the input box
inputBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();      //if pressed key is 'enter' then call addtask func.
    }
});

function addTask(){
    if(inputBox.value === ''){      //checking input box is empty, then alert the user
        alert('Please Write the Task')
    }
    else{
        const task = document.createElement('li')
        task.textContent = inputBox.value;   // set text content of list item to input value
        // listContainer.appendChild(task)
        
        let span = document.createElement('span') //adding the cross-icon after the listing of the task
        span.textContent = "\u00d7"
        span.style.right = '0px';   //position the span to right
        task.appendChild(span)

        listContainer.prepend(task);  //Add the new task to the top of the list

        saveData();     // Saving the current state of the task list
    }
    inputBox.value = '';    // clear the input box after successful adding

    if(filter && filter != todo.status){
        return '';
    }
    saveData()
}

// Event listener for marking the task checked or unchecked
listContainer.addEventListener('click', (e) => { 
    if(e.target.tagName === 'LI'){      // check if the clicked element is a list item and if yes, toggle the 'checked' class
        e.target.classList.toggle("checked")
        saveData()
    }
    else if(e.target.tagName === 'SPAN'){       //check if the clicked element is a delete icon, get the parent list item and add the animation to it.
        const todo = e.target.parentElement;
        todo.classList.add("shrink-fade-out");
        
        // e.target.parentElement.remove();
        // saveData();

        // Remove the task after the transition ends
        todo.addEventListener('transitionend', () => {
            todo.remove();      // remove the task
            saveData();
            showTask();
        }, { once: true });     //ensure event listener is called only once
    }
});

// Adding event listener to the filter buttons
filterButtons.forEach(function(el) {
    el.addEventListener("click", (e) => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        el.classList.add('active'); //add active class to clicked filter button
        filter = e.target.dataset.filter;
        showTask(); //update the task list display based on current filter
    });
});

// event listener for the delete all button
deleteAllButton.addEventListener('click', deleteAllTasks);

function deleteAllTasks() {
    listContainer.innerHTML = '';   //clear all tasks in the list container
    saveData();
}

// save the current state of the task list in local storage
function saveData(){
    localStorage.setItem("data",listContainer.innerHTML)    // store the innerHTML of the list container in local storage, value will be saved in our browser
}

// Display the saved tasks everytime whenever we open or refresh the page
function showTask(){
    listContainer.innerHTML = localStorage.getItem("data");  // get the stored task list from local storage

    const tasks = listContainer.querySelectorAll('li');
    tasks.forEach(task => {
        switch (filter) {
            case 'completed':
                if (!task.classList.contains('checked')) {
                    task.style.display = 'none';    // hide tasks that are not completed
                } else {
                    task.style.display = 'block';   // show only completed tasks
                }
                break;
            case 'pending':
                if (task.classList.contains('checked')) {
                    task.style.display = 'none';    // hide completed tasks
                } else {
                    task.style.display = 'block';   // show pending tasks
                }
                break;
            default:
                task.style.display = 'block';   // show all tasks
                break;
        }
    });
}

showTask();  // call the function to show the tasks when page is loaded