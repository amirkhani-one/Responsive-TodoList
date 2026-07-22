const addBtn = document.querySelector(".Add-btn");
const modalScreen = document.querySelector(".modal-screen");
const cancelXBtn = document.querySelector(".cancelX");
const cancelBtn = document.querySelector(".cancel");
const todoInputElem = document.querySelector(".input");
const createBtn = document.querySelector(".create");
const todosContainer = document.querySelector(".todos-container");
const sortBtnElem = document.querySelectorAll(".sort-menu button");
const sortTypeElem = document.querySelector(".sort-type");
const searchInput = document.querySelector(".search-box");
const themeBtn = document.querySelector(".theme-btn");
const themeIcon = document.querySelector(".fa-solid");
let Todos = [];

//////////////////////////////////////
/////////////////////////////////////

function showModalHandler() {
    modalScreen.classList.remove("hidden");
}
function hideModalHandler() {
    modalScreen.classList.add("hidden");
}
function addNewTodo() {
    const newTodoTitle = todoInputElem.value;
    if (newTodoTitle) {
        todoInputElem.value = "";
        const newTodoId = Math.floor(Math.random() * 9999);
        const newTodoObj = {
            id: newTodoId,
            title: newTodoTitle,
            isComplete: false,
        };
        Todos.push(newTodoObj);
        saveTodosInLocal(Todos);
        hideModalHandler();
        getTodosFromLocal();
    }
}
function showTodos(shownTodo) {
    todosContainer.innerHTML = "";
    if (shownTodo.length) {
        shownTodo.forEach(function (todo) {
            todosContainer.insertAdjacentHTML(
                "beforeend",
                `
                <article class="todo-content ${todo.isComplete ? "completed" : " "}" >
                        <div class="todo-data">
                            <button class="remove-btn" onclick="removeTodoHandler(${todo.id})">
                                <span>Remove</span>
                            </button>
                            <div>
                                <button class="checkbox " onclick = "checkTodoHandler(${todo.id})">
                                    <span>
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            class="size-3"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="m4.5 12.75 6 6 9-13.5"
                                            ></path>
                                        </svg>
                                    </span>
                                </button>
                                <div>
                                    <p class="todo-title">${todo.title}</p>
                                </div>
                            </div>

                            
                        </div>
                    </article>
                `,
            );
        });
    } else {
        todosContainer.insertAdjacentHTML(
            "beforeend",
            `
            <h4 style="text-align: center;">No Todos Found!</h4>
            `,
        );
    }
}
function saveTodosInLocal(todosArr) {
    localStorage.setItem("todos", JSON.stringify(todosArr));
}
function getTodosFromLocal() {
    const localTodo = JSON.parse(localStorage.getItem("todos"));
    if (localTodo) {
        Todos = localTodo;
    }
    showTodos(Todos);
    detectThemeHandler();
}
function checkTodoHandler(todoId) {
    Todos.some(function (todo) {
        if (todo.id === todoId) {
            if (todo.isComplete === true) {
                todo.isComplete = false;
            } else {
                todo.isComplete = true;
            }
            return true;
        }
    });
    saveTodosInLocal(Todos);
    getTodosFromLocal();
}
function removeTodoHandler(removeTodoId) {
    const removeTodoIndex = Todos.findIndex(function (todo) {
        return todo.id === removeTodoId;
    });
    Todos.splice([removeTodoIndex], 1);
    saveTodosInLocal(Todos);
    getTodosFromLocal(Todos);
}
function sortTodosHandler(event) {
    const sortTypeValue = event.target.value;

    sortTypeElem.innerHTML = event.target.innerHTML;
    switch (sortTypeValue) {
        case "Completed": {
            const completedTodos = Todos.filter(function (todo) {
                console.log(todo);

                return todo.isComplete === true;
            });
            showTodos(completedTodos);
            break;
        }

        case "Uncompleted": {
            const UncompletedTodos = Todos.filter(function (todo) {
                return todo.isComplete === false;
            });

            showTodos(UncompletedTodos);
            break;
        }

        default: {
            showTodos(Todos);
            break;
        }
    }
}
function toggleThemeHandler() {
    if (themeIcon.className.includes("fa-moon")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
    detectThemeHandler();
}
function detectThemeHandler() {
    let theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark");
        themeIcon.className = "fa-solid fa-sun";
    } else {
        document.body.classList.remove("dark");
        themeIcon.className = "fa-solid fa-moon";
    }
}
///////////////////////////////////
///////////////////////////////////t

searchInput.addEventListener("keyup", function (event) {
    const searchValue = event.target.value.trim().toLocaleLowerCase();

    const filteredTodos = Todos.filter(function (todo) {
        return todo.title.toLocaleLowerCase().includes(searchValue);
    });
    showTodos(filteredTodos);
});

themeBtn.addEventListener("click", toggleThemeHandler);
sortBtnElem.forEach(function (sortBtn) {
    sortBtn.addEventListener("click", sortTodosHandler);
});
createBtn.addEventListener("click", addNewTodo);
addBtn.addEventListener("click", showModalHandler);
cancelXBtn.addEventListener("click", hideModalHandler);
cancelBtn.addEventListener("click", hideModalHandler);
document.body.addEventListener("keyup", function (event) {
    if (event.key === "Escape") {
        hideModalHandler();
    }
});
