// only_english_comments_mode: off

// Абстрактный класс фильтрованный список сделан ИСКЛЮЧИТЕЛЬНО в учебных целях
// для того чтобы закрепить навыки прототипного наследования
//
// - items массив абстрактных элементов данный класс ничего не знает 
// о конкретной реализации этих элементов
// 
// - filters массив функций-фильтров которые будут применены к массиву
// items последовательно (вход последующего фильтра это выход предыдущего)
// порядок следования фильтров задается порядком следования функций-фильтров в массиве
function FilteredList(items, filters) {
    // массив с абстрактными элементами
    this.items = (items !== void 0 && items !== null) ? items : [];
    // массив фильтров, каждый фильтр эта функция которая принимает массив
    // элементов на вход
    this.filters = (filters !== void 0 && filters !== null) ? filters : [];
}

FilteredList.prototype.addItem = function (item) {
    this.items.push(item);
    return this;
};

// возвращает индекс элемента в массиве если такого элемента нет то null
FilteredList.prototype.getItemIndex = function (target) {
    var index = null;
    this.items.some(function (item, i) {
        index = i;
        return item === target;
    });
    return index;
};

// удаляет элемент из списка элементов
FilteredList.prototype.deleteItem = function (target) {
    var index = this.getItemIndex(target);
    if (index !== null) {
        this.items.splice(index, 1);
    }
    return this;
};

// возвращает фильтрованный список элементов
FilteredList.prototype.getFilteredItems = function () {
    var that = this;
    return this.filters.reduce(function (result, f) {
        // Binding необходим для того, чтобы фильтр имел доступ к свойствам списка
        // и мог использовать их в качестве параметров
        return f.call(that, result);
    }, this.items);
};

