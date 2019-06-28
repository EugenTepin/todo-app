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
    // create new item
    var item = new TodoItem(text);
    // save new item in list
    this.items.push(item);
    // set current page to last page
    this.currentPage = this.getPages().pop();
    this.saveToStore();
    this.render();
};

TodoList.prototype.changeItemStatus = function (id, status) {
    // search item by id in list then update its status
    this.items.some(function (item) {
        var flag = (item.id === Number(id));
        if (flag) {
            item.status = status;
        }
        return flag
    });
    var pages = this.getPages();
    // try to stay in the same page if no such page now then go to last page
    if (pages.indexOf(this.currentPage) === -1) {
        this.currentPage = pages.pop();
    }
    this.saveToStore();
    this.render();
};

TodoList.prototype.deleteItem = function (id) {
    var index;
    // search item by id
    var deleteFlag = this.items.some(function (item, i) {
        index = i;
        return item.id === Number(id);
    });
    // if found 
    if (deleteFlag) {
        // remove from list
        this.items.splice(index, 1);
        var pages = this.getPages();
        // try to stay in the same page if no such page now then go to last page
        if (pages.indexOf(this.currentPage) === -1) {
            this.currentPage = pages.pop();
        }
        this.saveToStore();
        this.render();
    }
};

TodoList.prototype.getFilteredItems = function () {
    var that = this;
    // filter items by status
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
    // change filter
    this.currentFilter = filter;
    var pages = this.getPages();
    // try to stay in the same page if no such page now then go to last page
    if (pages.indexOf(this.currentPage) === -1) {
        this.currentPage = pages.pop();
    }
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

// TodoList.prototype.getLastPageIndex = function () {
//     return Math.ceil(this.getFilteredItems().length / this.pageLimit);
// }

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
    console.time('Render time');
    var filter = this.currentFilter;
    var page = this.currentPage;
    var pageLimit = this.pageLimit;
    var filteredItems = this.getFilteredItems();
    var startIndex = page * pageLimit;
    if (filteredItems.length === 0) {
        console.log('You have 0 todo items, try to app.addItem("your text") to create one.')
    }

    var filtersList = [];
    ['all', 'completed', 'incompleted'].forEach(function (filterName) {
        filtersList.push((filterName === app.currentFilter) ? '[' + filterName + ']' : filterName)
    });
    console.log('Filters: ' + filtersList.join(' | '));

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
    console.timeEnd('Render time');
}

// Wrong!
// Store data in DOM
// function createHandelbarsRender() {
//     var tpl = $('#tpl').html();
//     var template = Handlebars.compile(tpl);

//     return function () {
//         // var data = {
//         //     items: [{}, {}],
//         //     currentFilter: '',
//         //     currentPage: 0,
//         //     pages: [1, 2]
//         // }

//         var currentPage = this.currentPage;
//         var currentFilter = this.currentFilter;
//         var startIndex = currentPage * this.pageLimit;
//         var data = {};
//         data.filters = ['all', 'completed', 'incompleted'].map(function (elem) {
//             return { text: elem, status: (elem === currentFilter) }
//         });
//         data.items = this.getFilteredItems().slice(startIndex, startIndex + this.pageLimit);
//         data.currentFilter = this.currentFilter;
//         data.currentPage = currentPage;
//         data.pages = this.getPages().map(function (elem) {
//             return { text: elem, status: (elem === currentPage) }
//         });

//         var rendered = template(data);
//         $('#app').empty().html(rendered);

//         $('#add').on('click', function (e) {
//             var textInput = $('#text');
//             app.addItem(textInput.val());
//             textInput.val('');
//             e.preventDefault();
//             return false;
//         });

//         $('.delete').on('click', function (e) {
//             var $elem = $(this);
//             var id = $elem.parents('.row').attr('id');
//             app.deleteItem(id);
//             e.preventDefault();
//             return false;
//         })

//         $('.page').on('click', function (e) {
//             var $elem = $(this);
//             var pageNumber = $elem.val();
//             app.changePage(pageNumber);
//             e.preventDefault();
//             return false;
//         })

//         $('.filter').on('click', function (e) {
//             var $elem = $(this);
//             var filter = $elem.val();
//             app.changeFilter(filter);
//             e.preventDefault();
//             return false;
//         })

//         $('.status').on('click', function (e) {
//             var $elem = $(this);
//             var id = $elem.parents('.row').attr('id');
//             app.changeItemStatus(id, $elem.prop('checked'));
//             e.preventDefault();
//             return false;
//         })
//     }
// }

function renderRightWay() {
    var currentPage = this.currentPage;
    var pageLimit = this.pageLimit;
    var startIndex = currentPage * pageLimit;

    var filtersNode = document.createDocumentFragment();
    var itemsNode = document.createDocumentFragment();
    var pagesNode = document.createDocumentFragment();
    var app = this;
    ['all', 'completed', 'incompleted'].forEach(function (filterValue) {
        var node = document.createElement('label');
        var input = document.createElement('input');
        input.setAttribute('type', 'radio');
        input.setAttribute('name', 'filter');

        if (app.currentFilter === filterValue) {
            node.setAttribute('class', 'btn btn-outline-primary active');
            input.setAttribute('checked', '');
        } else {
            node.setAttribute('class', 'btn btn-outline-primary');
        }
        node.addEventListener('click', function (e) {
            app.changeFilter.bind(app)(filterValue);
            e.preventDefault();
            return false;
        })
        node.appendChild(input);
        node.insertAdjacentText('beforeend', filterValue);
        filtersNode.appendChild(node);
    });
    app.getFilteredItems().slice(startIndex, startIndex + pageLimit).forEach(function (item) {
        var row = document.createElement('div');
        row.setAttribute('class', 'row p-1 border-bottom');
        var col1 = document.createElement('div');
        col1.setAttribute('class', 'col-2');
        var col2 = document.createElement('div');
        col2.setAttribute('class', 'col-8');
        var col3 = document.createElement('div');
        col3.setAttribute('class', 'col-2 text-right');
        var btnGr = document.createElement('div');
        col1.appendChild(btnGr).setAttribute('class', 'btn-group-toggle');
        var label = btnGr.appendChild(document.createElement('label'));
        var input = label.appendChild(document.createElement('input'));
        input.setAttribute('type', 'checkbox');
        if (item.status) {
            input.setAttribute('checked', '');
            label.setAttribute('class', 'btn btn-block btn-success');
            label.insertAdjacentText('beforeend', 'DONE');
        } else {
            label.setAttribute('class', 'btn btn-block btn-outline-secondary');
            label.insertAdjacentText('beforeend', 'TODO');
        }

        var p = col2.appendChild(document.createElement('p'));
        p.insertAdjacentText('beforeend', item.text);
        var btn = col3.appendChild(document.createElement('button'));
        btn.setAttribute('class', 'btn btn-block btn-outline-danger');
        btn.setAttribute('type', 'button');
        btn.insertAdjacentText('beforeend', 'Delete');

        row.appendChild(col1);
        row.appendChild(col2);
        row.appendChild(col3);
        row.addEventListener('click', function (e) {
            var target = e.target;
            if (target.isSameNode(input)) {
                app.changeItemStatus.bind(app)(item.id, !input.hasAttribute('checked'));
            }
            if (target.isSameNode(btn)) {
                app.deleteItem.bind(app)(item.id);
                e.preventDefault();
                return false;
            }

        });
        itemsNode.appendChild(row);
    });

    app.getPages().forEach(function (page) {
        var btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        //btn.setAttribute('type', page);
        if (page === app.currentPage) {
            btn.setAttribute('class', 'btn btn-outline-secondary active');
        } else {
            btn.setAttribute('class', 'btn btn-outline-secondary');
        }
        btn.insertAdjacentText('beforeend', page);
        btn.addEventListener('click', function (e) {
            app.changePage.bind(app)(page);
            e.preventDefault();
            return false;
        });
        pagesNode.appendChild(btn);
    });

    clearNode(document.getElementById('filters')).appendChild(filtersNode);
    clearNode(document.getElementById('items')).appendChild(itemsNode);
    clearNode(document.getElementById('pages')).appendChild(pagesNode);
    document.getElementById('add').onclick = function (e) {
        app.addItem.bind(app)(document.getElementById('text').value);
        document.getElementById('text').value = '';
        e.preventDefault();
        return false;
    };
}


function clearNode(node) {
    while (node.lastChild) {
        node.removeChild(node.lastChild);
    }
    return node;
}

function matrixHasYou() {
    document.getElementById('q').setAttribute('class', '');
    document.getElementById('app').remove();
    window.app = new TodoList();
    app.init(sessionStorage, consoleRender);
    var s = window.screen;
    var width = q.width = s.width;
    var height = q.height = s.height;
    var letters = Array(256).join(1).split('');

    var draw = function () {
        q.getContext('2d').fillStyle = 'rgba(0,0,0,.05)';
        q.getContext('2d').fillRect(0, 0, width, height);
        q.getContext('2d').fillStyle = '#0F0';
        letters.map(function (y_pos, index) {
            text = String.fromCharCode(Math.random() * 300 + Math.random() * 300);
            x_pos = index * 10;
            q.getContext('2d').fillText(text, x_pos, y_pos);
            letters[index] = (y_pos > 758 + Math.random() * 1e4) ? 0 : y_pos + 10;
        });
    };
    setInterval(draw, 33);
}
