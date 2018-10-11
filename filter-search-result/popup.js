var main = function () {
    chrome.storage.sync.get('filter', (data) => {
        if (data && data.filter) {
            var filterStr = data.filter + "";
            var filterArr = filterStr.split("|");
            filterArr.forEach((data) => {
                data.length > 0 && addElementLi("parentUl", data);
            })
        } else {
            addElementLi("parentUl", "no data");
        }
    });
}

main();

// let changeColor = document.getElementById('changeColor');
// changeColor.onclick = function (element) {
//     addElementLi("parentUl", 2);
// };

function addElementLi(obj, data) {
    var ul = document.getElementById(obj);
    //添加 li
    var li = document.createElement("li");

    //设置 li 属性，如 id
    li.setAttribute("id", data);
    li.innerHTML = data;

    let button = document.createElement('button');
    var t = document.createTextNode("   delete");
    button.appendChild(t);
    button.addEventListener('click', function () {
        deleteFilter(li.id);
    });
    li.appendChild(button);
    ul.appendChild(li);
}

function deleteFilter(deleteStr) {
    chrome.storage.sync.get('filter', (data) => {
        if (data && data.filter) {
            var filterArr = data.filter.split("|");
            if (filterArr.indexOf(deleteStr) != -1) {
                filterArr.splice(filterArr.indexOf(deleteStr), 1);

                var newFilter = '';
                filterArr.forEach((element, index) => {
                    if (element.length > 0) {
                        if (index < filterArr.length - 1) {
                            newFilter += element + "|";
                        } else {
                            newFilter += element;
                        }
                    }
                });

                chrome.storage.sync.set({
                    'filter': newFilter
                });
                alert(`url: ${deleteStr} has deleted! `);
                window.location.reload(true);
            }
        }
    });
}