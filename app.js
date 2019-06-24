function TodoItem(status, text) {
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
    //this.store = store;
    //this.output = output;
    //this.stateId = ;
    // init(strJSON, this) 
    //this.render = render;
    this.render();
};

// TodoList.prototype.prevState = function () {
//     // getPrevStateId(store,stateID)
//     // init(strJSON, this) 
//     this.render();
// };

// TodoList.prototype.nextState = function () {
//     // getNextStateId(store,stateID)
//     // init(strJSON, this) 
//     this.render();
// };

TodoList.prototype.saveToStore = function () {

};

TodoList.prototype.render = function () {

};

TodoList.prototype.addItem = function (text) {
    this.saveToStore();
    this.render();
};
TodoList.prototype.deleteItem = function (id) {
    this.saveToStore();
    this.render();
};
TodoList.prototype.filter = function (filter) {
    this.saveToStore();
    this.render();
};
TodoList.prototype.changePage = function (page) {
    this.saveToStore();
    this.render();
};

