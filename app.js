// only_english_comments_mode: off

// Простой класс для элемента todo листа
function TodoItem(text, status) {
    this.status = !!(status);
    this.text = (text !== void 0 && text !== null) ? text : "";
    this.id = (new Date()).getTime();
}


// Конкретный класс для реализации Todo листа
// items, filters параметры класса предка (FilteredList)
// filters будет содержать только одну функцию, которая будет осуществлять 
// фильтрацию по статусу TodoItem. Однако, если потребуется 
// ввести еще один фильтр, например по дате создания TodoItem или дате изменения, или
// приоритету, то это будет достаточно просто сделать


// store Данный параметр вынесен в параметры крнструктора для того чтобы store легко можно
// было заменить на другой store с таким же интерфейсом (Например, sessionStore и localStore)
// Реализация методов saveState и restoreState зависят от реализации sessionStore/localStore
// Для уменьшения данной зависимости можно передавать не store целиком, а только методы 
// конкретного экземпляра store для сохранения и извлечения данных из store

// pageLimit максимальное кол-во элементов на странице

// currentPage текущая страница

// statusFilter имя текущего фильтра используется как параметр для фильтра filterByStatus

// render Можно подставлять различные реализации 

function TodoList(items, filters, store, pageLimit, currentPage, statusFilter, render) {
    this.parent.call(this, items, filters);
    this.store = store;
    this.pageLimit = (pageLimit !== void 0 && pageLimit !== null) ? Number(pageLimit) : 5;
    this.currentPage = (currentPage !== void 0 && currentPage !== null) ? Number(currentPage) : 0;
    this.statusFilter = (statusFilter !== void 0 && statusFilter !== null) ? statusFilter : '';
    this.render = render;
}


// наследумся от абстрактного FilteredList, исключительно в учебных целях
TodoList.prototype = Object.create(FilteredList.prototype);
TodoList.prototype.constructor = TodoList;
TodoList.prototype.parent = FilteredList;


TodoList.prototype.saveState = function () {
    if (this.store === void 0) {
        throw new Error("Store is undefined!");
    }
    var state = {};
    state.pageLimit = this.pageLimit;
    state.currentPage = this.currentPage;
    state.statusFilter = this.statusFilter;
    state.items = this.items;
    this.store.setItem('Todo state', JSON.stringify(state));
    return this;
};


TodoList.prototype.restoreState = function () {
    if (this.store === void 0) {
        throw new Error("Store is undefined!");
    }
    var strState = this.store.getItem('Todo state');

    if (strState !== null) {
        var state = JSON.parse(strState);
        this.pageLimit = state.pageLimit;
        this.currentPage = state.currentPage;
        this.statusFilter = state.statusFilter;
        this.items = state.items.map(function (item) {
            // возможно нам необходимо сохранять id, например, где-то есть ссылка по id на 
            // конкретный todoItem
            var id = item.id;
            // делаем так потому, что TodoItem класс может содержать важные методы
            // если мы возьмем объект из хранилища то он этих методов содержать не будет
            var todoItem = new TodoItem(item.text, item.status);
            //вернем старый id
            todoItem.id = id;
            return todoItem;
        });
    }
    return this;
};

TodoList.prototype.init = function () {
    return this.restoreState().render();
}

//addItem
TodoList.prototype.addToDoItem = function (text) {
    return this
        .addItem(new TodoItem(text, false))
        .changePage(this.getLastPageIndex())
        .saveState()
        .render();

}

//delete Item
TodoList.prototype.deleteToDoItem = function (target) {
    return this
        .deleteItem(target)
        .changePage(this.currentPage)
        .saveState()
        .render();
}

// меняем status у элемента todo списка
TodoList.prototype.changeToDoItemStatus = function (target, status) {
    // есть ли такой элемент в списке?
    var index = this.getItemIndex(target);
    if (index !== null) {
        // найден, меняем статус
        target.status = status;
        this.saveState()
            .render();
    }
    return this;
};

TodoList.prototype.getLastPageIndex = function () {
    return Math.ceil(this.getFilteredItems().length / this.pageLimit) - 1;
}

TodoList.prototype.getPages = function () {
    var lastPage = this.getLastPageIndex();
    var pages = [];
    for (var i = 0; i <= lastPage; i++) {
        pages.push(i);
    }
    return pages;
}

TodoList.prototype.changePage = function (pageNum) {
    var lastPage = this.getLastPageIndex();
    var pageNum = Number(pageNum);
    if (!isNaN(pageNum)) {
        if (pageNum > lastPage) {
            this.currentPage = lastPage;
        } else {
            this.currentPage = pageNum;
        }
        this.saveState()
            .render();
    }
    return this;
}

TodoList.prototype.changeFilterStatus = function (status) {
    this.statusFilter = status;
    return this
        .changePage(this.currentPage)
        .saveState()
        .render();
}


function filterByStatus(items) {
    var currentFilter = this.statusFilter;
    var listOfFilters = {
        'all': function (item) {
            return true;
        },
        'completed': function (item) {
            return item.status;
        },
        'incompleted': function (item) {
            return !item.status;
        }
    };

    if (currentFilter in listOfFilters) {
        return items.filter(listOfFilters[currentFilter]);
    } else {
        return items;
    }
}




// function consoleRender() {
//     console.clear();
//     console.time('Render time');
//     var filter = this.statusFilter;
//     var page = this.currentPage;
//     var pageLimit = this.pageLimit;

//     var filtersList = [];
//     ['all', 'completed', 'incompleted'].forEach(function (filterName) {
//         filtersList.push((filterName === filter) ? '[' + filterName + ']' : filterName)
//     });
//     console.log('Filters: ' + filtersList.join(' | '));
//     var filteredItems = this.getFilteredItems();
//     var startIndex = page * pageLimit;
//     if (filteredItems.length === 0) {
//         console.log('You have 0 todo items, try to app.addItem("your text") to create one.')
//     }

//     var result = filteredItems.slice(startIndex, startIndex + pageLimit);
//     result.forEach(function (item, i) {
//         var tmp = ['#' + i, 'id ' + item.id, 'text: ' + item.text, 'status: ' + ((item.status) ? '[x]' : '[]')];
//         console.log(tmp.join(' | '));
//     });

//     var pages = [];
//     for (var k = 0; k < Math.ceil(filteredItems.length / pageLimit); k++) {
//         var pageNumStr = (k === this.currentPage) ? '[' + k + ']' : k;
//         pages.push(pageNumStr);
//     }
//     if (pages.length > 0) {
//         console.log('Pages: ' + pages.join(' | '));
//     } else {
//         console.log('Pages: [0]');
//     }
//     console.timeEnd('Render time');
// }


function renderRightWay() {
    var app = this;
    var currentPage = this.currentPage;
    var pageLimit = this.pageLimit;
    var startIndex = currentPage * pageLimit;
    var filterC = new FiltersComponent(
        ['all', 'completed', 'incompleted'],
        app.statusFilter,
        {
            'click': app.changeFilterStatus.bind(app)
        });
    var displayedItems = app.getFilteredItems().slice(startIndex, startIndex + pageLimit);
    var listC = new ListComponent(displayedItems, {
        'changeStatus': app.changeToDoItemStatus.bind(app),
        'deleteItem': app.deleteToDoItem.bind(app)
    });

    var paginationC = new Pagination(app.getPages(), app.currentPage, { 'changePage': app.changePage.bind(app) });

    clearNode(document.getElementById('filters')).appendChild(filterC.render());
    clearNode(document.getElementById('items')).appendChild(listC.render());
    clearNode(document.getElementById('pages')).appendChild(paginationC.render());

    document.getElementById('add').onclick = function (e) {
        app.addToDoItem.bind(app)(document.getElementById('text').value);
        document.getElementById('text').value = '';
        e.preventDefault();
        return false;
    };
}



