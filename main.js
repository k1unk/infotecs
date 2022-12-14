let dataSorted = [] // отсортированные данные для таблицы
let sortedValue = "value01" // значение, по которому сортируем
let pageNow = 1 // номер текущей страницы
const PAGE_SIZE = 10 // количество строк таблицы на странице
let hiddenColumns = [false, false, false, false] // какие из колонок скрыты

// дублирование данные в dataSorted, отображение номеров страниц и таблицы
function init() {
    dataSorted = copyData()
    showPageNumbers(data.length / PAGE_SIZE, dataSorted)
    changePage(1)
}

// отображение номеров страниц
function showPageNumbers(size) {
    let pages = document.getElementById("page-numbers")

    for (let i = 0; i < size; i++) {
        pages.innerHTML += `<div class="page-number" id="page${i + 1}" onclick="changePage(${i + 1})">${i + 1}</div>`
    }
}

// добавление css для номера выбранной страницы и отображение таблицы
function changePage(pageNow) {
    setPageNow(pageNow)
    loadPage()
}

// добавление css для номера выбранной страницы и замена значения pageNow
function setPageNow(value) {
    document.getElementById(`page${pageNow}`).classList.remove("page-number_active")
    document.getElementById(`page${value}`).classList.add("page-number_active")
    pageNow = value
}

// отображение таблицы
function loadPage() {
    setTableHeader()
    setTableBody()
}

// отображение заголовков столбцов таблицы
function setTableHeader() {
    let firstName = hiddenColumns[0] ? `` : `<th class="column1">Имя</th>`
    let lastName = hiddenColumns[1] ? `` : `<th class="column2">Фамилия</th>`
    let about = hiddenColumns[2] ? `` : `<th class="column3">Описание</th>`
    let eyeColor = hiddenColumns[3] ? `` : `<th class="column4">Цвет глаз</th>`
    document.getElementById("table").innerHTML =
        `
            <thead>
                <tr class="table-header">
                    ${firstName}
                    ${lastName}
                    ${about}
                    ${eyeColor}
                </tr>
            </thead>
        `
}

// отображение строк таблицы
function setTableBody() {
    document.getElementById("table").innerHTML += `<tbody id="table-body"></tbody>`
    let body = document.getElementById("table-body")
    for (let i = (pageNow - 1) * PAGE_SIZE; i < pageNow * PAGE_SIZE; i++) {
        let obj = dataSorted[i]
        let firstName = hiddenColumns[0] ? `` : `<td class="column1">${obj.firstName}</td>`
        let lastName = hiddenColumns[1] ? `` : `<td class="column2">${obj.lastName}</td>`
        let about = hiddenColumns[2] ? `` : `<td class="column3">${obj.about}</td>`
        let eyeColorSpan = `<span style="display: block; width: 10px; height: 10px; background: ${obj.eyeColor};"></span>`
        let eyeColor = hiddenColumns[3] ? `` : `<td class="column4">${obj.eyeColor}${eyeColorSpan} </td>`

        body.innerHTML = `${body.innerHTML}<tr id=${obj.id} 
            onclick="openEditElement(id)">${firstName}${lastName}${about}${eyeColor}</tr>`
    }
}

// отображение блока редактирования данных
function openEditElement(id) {
    let dataItem = dataSorted.find(e => e.id === id)
    document.getElementById(`container-right`).innerHTML =
        `
            <div>
                <div>
                    <div class="edit-value-item">
                        <div>Имя: </div>
                        <input type="text" id="change-firstName" value=${dataItem.firstName}>
                    </div>
                    <div class="edit-value-item">
                        <div>Фамилия: </div>
                        <input type="text" id="change-lastName" value=${dataItem.lastName}>
                    </div>
                    <div class="edit-value-item">
                        <div>Описание: </div>
                        <textarea id="change-about">${dataItem.about}</textarea>
                    </div>
                    <div class="edit-value-item">
                        <div>Цвет глаз: </div>
                        <input type="text" id="change-eyeColor" value=${dataItem.eyeColor}>
                    </div>
                </div>
                <button onclick="changeData('${id}')">Сохранить</button>
                <button onclick="cancelEditing()">Отмена</button>
            </div>
        `

    changeTextAreaSize(document.getElementById("change-about"))
}

// изменение размера textarea
function changeTextAreaSize(element) {
    element.style.height = (element.scrollHeight + 5) + "px";
    console.log(element.scrollHeight);
}

// отмена редактирования
function cancelEditing() {
    document.getElementById("container_right").innerHTML = ""
}

// сохранение введенных данных
function changeData(id) {
    let firstName = document.getElementById("change-firstName").value;
    let lastName = document.getElementById("change-lastName").value;
    let about = document.getElementById("change-about").value;
    let eyeColor = document.getElementById("change-eyeColor").value;

    let el = data.find(e => e.id === id)
    el.name.firstName = firstName
    el.name.lastName = lastName
    el.about = about
    el.eyeColor = eyeColor

    dataSorted = copyData()
    sortData(true)
    loadPage()
}

// копирование объекта data
function copyData() {
    let result = []
    for (let i = 0; i < data.length; i++) {
        result.push({
            id: data[i].id,
            firstName: data[i].name.firstName,
            lastName: data[i].name.lastName,
            eyeColor: data[i].eyeColor,
            about: data[i].about
        })
    }
    return result
}

// при скрытии/развертывании колонок - добавление/удаление классов, добавление/удаление возможности выбора сортировки
// по соответствующим параметрам
function toggling(column_number, elements) {
    let num1 = (column_number + 1) * 2
    let num2 = (column_number + 1) * 2 + 1
    if (!hiddenColumns[column_number]) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.add("hidden-column")
        }
        hiddenColumns[column_number] = true
        let num = Number(sortedValue.substring(5))
        if (num === num1 || num === num2) {
            document.getElementById(`data-sorting`).value = "value01"
            sortData()
        }

        document.getElementById(`data-sorting`).options[num1 - 1].disabled = true;
        document.getElementById(`data-sorting`).options[num2 - 1].disabled = true;
    } else {
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove("hidden-column")
        }
        hiddenColumns[column_number] = false

        document.getElementById(`data-sorting`).options[num1 - 1].disabled = false;
        document.getElementById(`data-sorting`).options[num2 - 1].disabled = false;
        loadPage()
    }

}

// обработка нажатия на чекбокс
function toggleFirstName() {
    let col_elements = document.getElementsByClassName("column1")
    toggling(0, col_elements)
}

function toggleLastName() {
    let col_elements = document.getElementsByClassName("column2")
    toggling(1, col_elements)
}

function toggleAbout() {
    let col_elements = document.getElementsByClassName("column3")
    toggling(2, col_elements)
}

function toggleEyeColor() {
    let col_elements = document.getElementsByClassName("column4")
    toggling(3, col_elements)
}

// обработчик выбора option в select, сортировка data
// value01 - по умолчанию
// value02 - Имя А-Я
// value03 - Имя Я-А
// value04 - Фамилия А-Я
// value05 - Фамилия Я-А
// value06 - Описание А-Я
// value07 - Описание Я-А
// value08 - Цвет глаз А-Я
// value09 - Цвет глаз Я-А
function sortData(save_page_now) {
    let sel = document.getElementById('data-sorting').selectedIndex;
    let options = document.getElementById('data-sorting').options;
    sortedValue = options[sel].value

    switch (sortedValue) {
        case 'value01': {
            dataSorted = copyData()
            if (!save_page_now) setPageNow(1)
            loadPage()

            break
        }
        case 'value02': {
            dataSorted = copyData()
            if (!save_page_now) setPageNow(1)
            dataSorted.sort((a, b) => a.firstName.localeCompare(b.firstName));
            loadPage()

            break
        }

        case 'value03': {
            dataSorted = copyData()
            if (!save_page_now) setPageNow(1)
            dataSorted.sort((a, b) => b.firstName.localeCompare(a.firstName));
            loadPage()

            break
        }

        case 'value04': {
            dataSorted = copyData()
            if (!save_page_now) setPageNow(1)
            dataSorted.sort((a, b) => a.lastName.localeCompare(b.lastName));
            loadPage()

            break
        }

        case 'value05': {
            dataSorted = copyData()
            if (!save_page_now) setPageNow(1)
            dataSorted.sort((a, b) => b.lastName.localeCompare(a.lastName));
            loadPage()

            break
        }

        case 'value06': {
            dataSorted = copyData()
            if (!save_page_now) setPageNow(1)
            dataSorted.sort((a, b) => a.about.localeCompare(b.about));
            loadPage()

            break
        }

        case 'value07': {
            dataSorted = copyData()
            if (!save_page_now) setPageNow(1)
            dataSorted.sort((a, b) => b.about.localeCompare(a.about));
            loadPage()

            break
        }

        case 'value08': {
            dataSorted = copyData()
            if (!save_page_now) setPageNow(1)
            dataSorted.sort((a, b) => a.eyeColor.localeCompare(b.eyeColor));
            loadPage()

            break
        }

        case 'value09': {
            dataSorted = copyData()
            if (!save_page_now) setPageNow(1)
            dataSorted.sort((a, b) => b.eyeColor.localeCompare(a.eyeColor));
            loadPage()

            break
        }

        default: {
        }
    }

}

init()
