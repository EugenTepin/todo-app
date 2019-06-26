function TodoItem(text, status) {
    this.status = (status !== void 0) ? !!(status) : false;
    this.text = text || "";
    this.id = (new Date()).getTime();
}


function TodoList() {
    //items, pageLimit, currentPage, filter
    // this.items = items || [];
    // this.pageLimit = (pageLimit !== void 0) ? parseInt(pageLimit, 10) : 5;
    // this.currentPage = (currentPage !== void 0) ? parseInt(currentPage, 10) : 1;
    // this.currentFilter = filter || "all";
    this.items = [];
    this.pageLimit = 5;
    this.currentPage = 0;
    this.currentFilter = "all";
}

TodoList.prototype.init = function (store, render) {
    this.store = store;
    this.render = render;
    var that = this;
    var store = this.store;
    var stateStr = store.getItem('Todo state');
    if (stateStr !== null) {
        var state = JSON.parse(stateStr);
        Object.keys(state).forEach(function (prop) {
            that[prop] = state[prop];
        });
        // this.items = state.items;
        // this.pageLimit = this.pageLimit;
        // this.currentPage = this.currentPage;
        // this.currentFilter = this.currentFilter;
    }
    this.render();
};

TodoList.prototype.saveToStore = function () {
    if (this.store === void 0) {
        throw new Error("Store is undefined!");
    }
    var store = this.store;
    var app = Object.assign({}, this);
    delete app.store;
    delete app.render;
    store.setItem('Todo state', JSON.stringify(app));
};

TodoList.prototype.addItem = function (text) {
    var item = new TodoItem(text);
    this.items.push(item);
    this.saveToStore();
    this.render();
};

TodoList.prototype.changeItemStatus = function (id, status) {
    this.items.some(function (item) {
        var flag = item.id === id;
        if (flag) {
            item.status = status;
        }
        return flag
    })
    this.saveToStore();
    this.render();
};

TodoList.prototype.deleteItem = function (id) {
    var index;
    var deleteFlag = this.items.some(function (item, i) {
        index = i;
        return item.id === Number(id);
    });
    if (deleteFlag) {
        this.items.splice(index, 1);
        var pages = this.getPages();
        if (pages.indexOf(this.currentPage) === -1) {
            this.currentPage = pages.pop();
        }
        this.saveToStore();
        this.render();
    }
};

TodoList.prototype.getFilteredItems = function () {
    var that = this;
    return that.items.filter(function (item) {
        switch (that.currentFilter) {
            case 'completed':
                return item.status;
                break;
            case 'incompleted':
                return !item.status;
                break;
            case 'all':
                return true;
                break;
            default:
                return false;
                break;
        }
    });
};

TodoList.prototype.changeFilter = function (filter) {
    this.currentFilter = filter;
    this.currentPage = 0;
    this.saveToStore();
    this.render();
};
TodoList.prototype.getPages = function () {
    var pages = [];
    var filteredItems = this.getFilteredItems();
    for (var k = 0; k < Math.ceil(filteredItems.length / this.pageLimit); k++) {
        pages.push(k);
    }
    return pages;
}

TodoList.prototype.changePage = function (page) {
    page = Number(page);
    if (!isNaN(page)) {
        var pages = this.getPages();
        if (pages.indexOf(page) > -1) {
            this.currentPage = page;
        }
        this.saveToStore();
        this.render();
    }
};

function consoleRender() {
    console.clear();
    var filter = this.currentFilter;
    var page = this.currentPage;
    var pageLimit = this.pageLimit;
    var filteredItems = this.items.filter(function (item) {
        switch (filter) {
            case 'completed':
                return item.status;
                break;
            case 'incompleted':
                return !item.status;
                break;
            case 'all':
                return true;
                break;
            default:
                return false;
                break;
        }
    });

    var startIndex = page * pageLimit;
    if (filteredItems.length === 0) {
        console.log('You have 0 todo items, try to app.addItem("your text") to create one.')
    }
    var result = filteredItems.slice(startIndex, startIndex + pageLimit);
    result.forEach(function (item, i) {
        var tmp = ['#' + i, 'id ' + item.id, 'text: ' + item.text, 'status: ' + ((item.status) ? '[x]' : '[]')];
        console.log(tmp.join(' | '));
    });


    var pages = [];
    for (var k = 0; k < Math.ceil(filteredItems.length / pageLimit); k++) {
        var pageNumStr = (k === this.currentPage) ? '[' + k + ']' : k;
        pages.push(pageNumStr);
    }
    if (pages.length > 0) {
        console.log('Pages: ' + pages.join(' | '));
    }

}


function createHandelbarsRender() {
    var tpl = $('#tpl').html();
    var template = Handlebars.compile(tpl);

    return function () {
        // var data = {
        //     items: [{}, {}],
        //     currentFilter: '',
        //     currentPage: 0,
        //     pages: [1, 2]
        // }

        var currentPage = this.currentPage;
        var currentFilter = this.currentFilter;
        var startIndex = currentPage * this.pageLimit;
        var data = {};
        data.filters = ['all', 'completed', 'incompleted'].map(function (elem) {
            return { text: elem, status: (elem === currentFilter) }
        });
        data.items = this.getFilteredItems().slice(startIndex, startIndex + this.pageLimit);
        data.currentFilter = this.currentFilter;
        data.currentPage = currentPage;
        data.pages = this.getPages().map(function (elem) {
            return { text: elem, status: (elem === currentPage) }
        });

        var rendered = template(data);
        $('#app').empty().html(rendered);

        $('#add').on('click', function (e) {
            var textInput = $('#text');
            app.addItem(textInput.val());
            textInput.val('');
            e.preventDefault();
            return false;
        });

        $('.delete').on('click', function (e) {
            var $elem = $(this);
            var id = $elem.parents('.row').attr('id');
            app.deleteItem(id);
            e.preventDefault();
            return false;
        })

        $('.page').on('click', function (e) {
            var $elem = $(this);
            var pageNumber = $elem.val();
            app.changePage(pageNumber);
            e.preventDefault();
            return false;
        })

        $('.filter').on('click', function (e) {
            var $elem = $(this);
            var filter = $elem.val();
            app.changeFilter(filter);
            e.preventDefault();
            return false;
        })
    }
}