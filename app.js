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
    this.currentPage = 1;
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
TodoList.prototype.deleteItem = function (id) {
    var index;
    var deleteFlag = this.items.some(function (item, i) {
        index = i;
        return item.id === id;
    });
    if (deleteFlag) {
        this.items.splice(index, 1);
        this.saveToStore();
        this.render();
    }
};

// TodoList.prototype.recalculatePage = function(){

// }

TodoList.prototype.changeFilter = function (filter) {
    this.currentFilter = filter;
    this.currentPage = 0;
    // change page number
    this.saveToStore();
    this.render();
};

TodoList.prototype.changePage = function (page) {
    this.currentPage = page;
    this.saveToStore();
    this.render();
};

function renderConsole() {
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
            default:
                return true;
                break;
        }
    });

    // var pages = [];
    // for (var k = 0; k < Math.ceil(filteredItems.length / pageLimit); k++) {
    //     pages.push(k + 1);
    // }
    // console.log(pages.join(' | '));

}