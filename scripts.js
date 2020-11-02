"use strict"
let todoList = []; //declares a new array for Your todo list

    let updateJSONbin = function() {
        $.ajax({
            url: 'https://api.jsonbin.io/b/5f96a6fcbd69750f00c3bbf7',
            type: 'PUT',
            headers: { //Required only if you are trying to access a private bin
                'secret-key': "$2b$10$UkXuPeEEBcEdF5fZEiUcludQ90ngivxuGpW3/FxMYcIWqCq0gZz9a"
            },
            contentType: 'application/json',
            data: JSON.stringify(todoList),
            success: (data) => {
                console.log(data);
            },
            error: (err) => {
                console.log(err.responseJSON);
            }
        });
    }

    let initList = function () {
        let savedList = window.localStorage.getItem("todos");
        if (savedList != null)
            todoList = JSON.parse(savedList);
        else
            //code creating a default list with 2 items
            todoList.push(
                {
                    title: "Learn JS",
                    description: "Create a demo application for my TODO's",
                    place: "445",
                    dueDate: new Date(2019, 10, 16)
                },
                {
                    title: "Lecture test",
                    description: "Quick test from the first three lectures",
                    place: "F6",
                    dueDate: new Date(2019, 10, 17)
                }
                // of course the lecture test mentioned above will not take place
            );
    }
//initList();
    $.ajax({
        // copy Your bin identifier here. It can be obtained in the dashboard
        url: 'https://api.jsonbin.io/b/5f96a6fcbd69750f00c3bbf7/latest',
        type: 'GET',
        headers: { //Required only if you are trying to access a private bin
            'secret-key': "$2b$10$UkXuPeEEBcEdF5fZEiUcludQ90ngivxuGpW3/FxMYcIWqCq0gZz9a"
        },
        success: (data) => {
            //console.log(data);
            todoList = data;
        },
        error: (err) => {
            console.log(err.responseJSON);
        }
    });

    let deleteTodo = function (index) {
        todoList.splice(index, 1);
        updateJSONbin();
    }

    let updateTodoList = function () {
        let todoListDiv = document.getElementById("todoListView");
        todoListDiv.classList.add("table");
        todoListDiv.classList.add("table-light");
        let filterInput = document.getElementById("inputSearch");
        //add all elements
        let newTable = document.createElement("table");
        newTable.className = "table";
        let newRow = document.createElement("tr");
        let headers = ["Title","Description","Place","Date"];
        for (let header of headers){
            let newTableHeader = document.createElement("th");
            let headerContent = document.createTextNode(header);
            newTableHeader.appendChild(headerContent)
            newRow.appendChild(newTableHeader);
        }
        newTable.appendChild(newRow);

        for (let todo in todoList) {
            if (
                (filterInput.value === "") ||
                (todoList[todo].title.includes(filterInput.value)) ||
                (todoList[todo].description.includes(filterInput.value))
            ) {
                let newTableRow = document.createElement("tr");
                for(let element in todoList[todo]){
                    let newCell = document.createElement("td");
                    let newCellContent = null;
                    if(todoList[todo][element]){
                        newCellContent = document.createTextNode(todoList[todo][element]);
                    }
                    else{
                        newCellContent = document.createTextNode("Not defined");
                    }
                    newCell.appendChild(newCellContent);
                    newTableRow.appendChild(newCell);

                }

                let newDeleteButton = document.createElement("input"); //creating removing button
                newDeleteButton.type = "button";
                newDeleteButton.value = "x";
                newDeleteButton.className = "btn btn-primary";
                newDeleteButton.addEventListener("click",
                    function () {
                        deleteTodo(todo); //listener triggering the function which removes array element by index
                    });
                newTableRow.appendChild(newDeleteButton);
                newTable.appendChild(newTableRow);
            }
            while (todoListDiv.firstChild) {
                todoListDiv.removeChild(todoListDiv.firstChild);
            }
            todoListDiv.appendChild(newTable);


        }
    }
    setInterval(updateTodoList, 1000);

    let addTodo = function () {
        //get the elements in the form
        let inputTitle = document.getElementById("inputTitle");
        let inputDescription = document.getElementById("inputDescription");
        let inputPlace = document.getElementById("inputPlace");
        let inputDate = document.getElementById("inputDate");
        //get the values from the form
        let newTitle = inputTitle.value;
        let newDescription = inputDescription.value;
        let newPlace = inputPlace.value;
        let newDate = new Date(inputDate.value);
        //create new item
        let newTodo = {
            title: newTitle,
            description: newDescription,
            place: newPlace,
            dueDate: newDate
        };
        //add item to the list
        todoList.push(newTodo);
        //save item to local storage
        window.localStorage.setItem("todos", JSON.stringify(todoList));
        updateJSONbin();
    }
