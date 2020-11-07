"use strict"
let todoList = []; //declares a new array for Your todo list
let myUrl = 'https://api.jsonbin.io/b/5fa6f11248818715939d7d8f';
let myLatestUrl = 'https://api.jsonbin.io/b/5fa6f11248818715939d7d8f/latest'
let initList = function() {
    todoList.push(
        {
            title: "Learn JS",
            description: "Create a demo application for my TODO's",
            place: "445",
            dueDate: new Date(2019,10,16)
        },
        {
            title: "Lecture test",
            description: "Quick test from the first three lectures",
            place: "F6",
            dueDate: new Date(2019,10,17)
        }
        // of course the lecture test mentioned above will not take place
    );
}
//let savedList = window.localStorage.getItem("todos");
//if (savedList != null) todoList = JSON.parse(savedList);
//else initList();
$.ajax({
        // copy Your bin identifier here. It can be obtained in the dashboard
        url: myLatestUrl,
        type: 'GET',
        headers: { //Required only if you are trying to access a private bin
            'secret-key': "$2b$10$Ni0XOeJ0AGg5e65eErx8lubBK.9Zi/47jUWKLG1cHJHolDvVgcrLu"
    },
    success: (data) => {
            //console.log()data;
    todoList = data;
},
    error: (err) => {
    console.log(err.responseJSON);
}
});

let updateTodoList = function() {
    let todoListDiv = document.getElementById("todoListView");
    todoListDiv.classList.add("table");
    todoListDiv.classList.add("table-light");
    let filterInput = document.getElementById("inputSearch");
    let beginDateInput = document.getElementById("beginDate");
    let beginDate = new Date(beginDateInput.value);
    let endDateInput = document.getElementById("endDate");
    let endDate = new Date(endDateInput.value);
    //remove all elements

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

    //add all elements
    for (let todo in todoList)
    {
        if ((filterInput.value == "") ||
            (todoList[todo].title.includes(filterInput.value)) ||
            (todoList[todo].description.includes(filterInput.value)))
            //Problem rozwiazalismy poprzez zrobienie z dat Stringow i ich porownanie
            if( ( beginDate.toString() === "Invalid Date" || endDate.toString() === "Invalid Date" ) ||
                (( Date.parse(todoList[todo].dueDate.toString()) >= Date.parse(beginDate.toString()) ) &&
                ( Date.parse(todoList[todo].dueDate.toString()) <= Date.parse(endDate.toString()) )))
                {
                let newTableRow = document.createElement("tr");
                for(let element in todoList[todo]) {
                    let newCell = document.createElement("td");
                    let newCellContent = null;
                    if (todoList[todo][element]) {
                        if(todoList[todo][element] === todoList[todo].dueDate)
                        {
                            newCellContent = document.createTextNode(displayableDate(todoList[todo][element]));
                        }
                        else
                        {
                            newCellContent = document.createTextNode(todoList[todo][element]);
                        }
                    }
                    else {
                        newCellContent = document.createTextNode("Not defined");
                    }
                    newCell.appendChild(newCellContent);
                    newTableRow.appendChild(newCell);
                }
                let newDeleteButton = document.createElement("input");
                newDeleteButton.type = "button";
                newDeleteButton.value = "x";
                newDeleteButton.className = "btn btn-primary";
                newDeleteButton.addEventListener("click", function() {
                    deleteTodo(todo);
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

let deleteTodo = function(index) {
    todoList.splice(index,1);
    updateJSONbin();
}

let addTodo = function() {
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
    //window.localStorage.setItem("todos", JSON.stringify(todoList));
    updateJSONbin();
}

let updateJSONbin = function() {
    $.ajax({
        url: myUrl,
        type: 'PUT',
        headers: { //Required only if you are trying to access a private bin
            'secret-key': "$2b$10$Ni0XOeJ0AGg5e65eErx8lubBK.9Zi/47jUWKLG1cHJHolDvVgcrLu"
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

let displayableDate = function (date) {
    let thisDate = new Date(date);
    console.log(thisDate.getDate());
    let d = thisDate.getDate();
    let m = thisDate.getMonth() + 1;
    let y = thisDate.getFullYear();
    return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);

}