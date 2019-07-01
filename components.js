// only_english_comments_mode: off


// helpers
function createHtmlElementHelper(elemName, attrs) {
    var elem = document.createElement(elemName);
    if (attrs !== null && attrs !== void 0) {
        Object.keys(attrs).forEach(function (attrName) {
            elem.setAttribute(attrName, attrs[attrName]);
        })
    }
    return elem;
}

function clearNode(node) {
    while (node.lastChild) {
        node.removeChild(node.lastChild);
    }
    return node;
}

// components

function FiltersComponent(filtersList, activeFilter, handlers) {
    this.list = filtersList;
    this.active = activeFilter;
    this.handlers = handlers;
}

FiltersComponent.prototype.render = function () {
    var fragment = document.createDocumentFragment();
    var clickHandler = this.handlers['click'];
    var active = this.active;
    this.list.forEach(function (filterName) {
        var node = createHtmlElementHelper('label', {
            'class': 'btn btn-outline-primary'
        });
        var input = createHtmlElementHelper('input', {
            'type': 'radio',
            'name': 'filter'
        });
        if (filterName === active) {
            node.classList.add('active');
            input.setAttribute('checked', '');
        }
        node.appendChild(input);
        node.insertAdjacentText('beforeend', filterName);
        node.addEventListener('click', function (e) {
            clickHandler(filterName)
            e.preventDefault();
            return false;
        });
        fragment.appendChild(node);
    });
    return fragment;
}



function ListComponent(items, handlers) {
    this.items = items;
    this.handlers = handlers;
}

ListComponent.prototype.render = function () {
    var fragment = document.createDocumentFragment();

    var changeStatus = this.handlers.changeStatus;
    var deleteItem = this.handlers.deleteItem;
    this.items.forEach(function (item) {
        var row = createHtmlElementHelper('div', { 'class': 'row p-1 border-bottom' });
        var col1 = createHtmlElementHelper('div', { 'class': 'col-2' });
        var col2 = createHtmlElementHelper('div', { 'class': 'col-8' });
        var col3 = createHtmlElementHelper('div', { 'class': 'col-2 text-right' });
        var btnGr = createHtmlElementHelper('div', { 'class': 'btn-group-toggle' });
        var label = document.createElement('label');
        var input = createHtmlElementHelper('input', { 'type': 'checkbox' });
        if (item.status) {
            input.setAttribute('checked', '');
            label.setAttribute('class', 'btn btn-block btn-success');
            label.insertAdjacentText('beforeend', 'DONE');
        } else {
            label.setAttribute('class', 'btn btn-block btn-outline-secondary');
            label.insertAdjacentText('beforeend', 'TODO');
        }
        label.addEventListener('click', function (e) {
            changeStatus(item, !item.status);
            e.preventDefault();
            return false;
        });
        label.appendChild(input);
        btnGr.appendChild(label);
        col1.appendChild(btnGr);
        row.appendChild(col1);

        var p = document.createElement('p');
        p.insertAdjacentText('beforeend', item.text);
        col2.appendChild(p);
        row.appendChild(col2);

        var btn = createHtmlElementHelper('button', {
            'class': 'btn btn-block btn-outline-danger',
            'type': 'button'
        });
        btn.insertAdjacentText('beforeend', 'Delete');
        btn.addEventListener('click', function (e) {
            deleteItem(item);
            e.preventDefault();
            return false;
        });

        col3.appendChild(btn);
        row.appendChild(col3);
        fragment.appendChild(row);
    });
    return fragment;
}

function Pagination(pages, currentPage, handlers) {
    this.pages = pages;
    this.currentPage = currentPage;
    this.handlers = handlers;
}

Pagination.prototype.render = function () {
    var fragment = document.createDocumentFragment();
    var changePage = this.handlers['changePage'];
    var currentPage = this.currentPage;

    this.pages.forEach(function (page) {
        var btn = createHtmlElementHelper('button', {
            'type': 'button',
            'class': (page === currentPage) ? 'btn btn-outline-secondary active' : 'btn btn-outline-secondary'
        });
        btn.insertAdjacentText('beforeend', page);
        btn.addEventListener('click', function (e) {
            changePage(page);
            e.preventDefault();
            return false;
        });
        fragment.appendChild(btn);
    });

    return fragment;
}