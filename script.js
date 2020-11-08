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
    let todoListDiv = $("#todoListView");
    //remove all elements
    todoListDiv.empty();
    todoListDiv.addClass("table table-light");
    let filterInput = $("#inputSearch");
    let beginDateInput = $("#beginDate");
    let beginDate = new Date(beginDateInput.val());
    let endDateInput = $("#endDate");
    let endDate = new Date(endDateInput.val());
    todoListDiv.append("<table></table>");
    todoListDiv.find("table").append("<tr></tr>");
    let headers = ["Title","Description","Place","Date"];
    for (let header of headers){
        todoListDiv.find("table tr:last").append("<th>"+header+"</th>");
    }
    console.log(todoList.toString());
    //add all elements
    for (let todo in todoList)
    {
        if ((filterInput.val() == "") ||
            (todoList[todo].title.includes(filterInput.val())) ||
            (todoList[todo].description.includes(filterInput.val())))
            //Problem rozwiazalismy poprzez zrobienie z dat Stringow i ich porownanie
            if( ( beginDate.toString() === "Invalid Date" || endDate.toString() === "Invalid Date" ) ||
                (( Date.parse(todoList[todo].dueDate.toString()) >= Date.parse(beginDate.toString()) ) &&
                ( Date.parse(todoList[todo].dueDate.toString()) <= Date.parse(endDate.toString()) )))
                {
                    todoListDiv.find("table").append("<tr></tr>");
                    for(let element in todoList[todo]) {
                        if (todoList[todo][element]) {
                            if (todoList[todo][element] === todoList[todo].dueDate) {
                                todoListDiv.find("table tr:last").append("<td>" + displayableDate(todoList[todo][element]) + "</td>");
                            } else {
                                todoListDiv.find("table tr:last").append("<td>" + todoList[todo][element] + "</td>");
                            }
                        } else {
                            todoListDiv.find("table tr:last").append("<td>" + "Not defined" + "</td>");
                        }
                    }
                    todoListDiv.find("table tr:last").append("<input>");
                    todoListDiv.find("table tr:last input").attr("type", "button");
                    todoListDiv.find("table tr:last input").val("x");
                    todoListDiv.find("table tr:last input").addClass("btn btn-primary");
                    todoListDiv.find("table tr:last input").click(function() {
                        deleteTodo(todo);
                    });
                }
    }


}

setInterval(updateTodoList, 1000);

let deleteTodo = function(index) {
    todoList.splice(index,1);
    updateJSONbin();
}

let addTodo = function() {
    //get the elements in the form
    let inputTitle = $("#inputTitle");
    let inputDescription = $("#inputDescription");
    let inputPlace = $("#inputPlace");
    let inputDate = $("#inputDate");
    //get the values from the form
    let newTitle = inputTitle.val();
    let newDescription = inputDescription.val();
    let newPlace = inputPlace.val();
    let newDate = new Date(inputDate.val());
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