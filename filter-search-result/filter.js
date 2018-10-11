/** 过滤规则 */

var MObserver = function (reg) {
    var Observer = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new Observer((records) => {
        googleFilter(reg);
    });
    observer.observe(document.body, {
        'childList': true
    });
}

var main = function () {
    chrome.storage.sync.get('filter', function (data) {
        // console.warn("设置的过滤配置", data);
        if (!data.filter) //如果过滤规则为空，则使用默认的过滤规则
        {
            getRe = 'www.jb51.net\/.*?|www.wuji8.com\/.*?|baike.baidu.com\/.*?';
            chrome.storage.sync.set({
                'filter': getRe
            });
            var reg = new RegExp(getRe);
            MObserver(reg);
            // baiduFilter(reg);
            googleFilter(reg);
        } else {
            getRe = data.filter;
            var reg = new RegExp(getRe);
            MObserver(reg);
            // baiduFilter(reg);
            googleFilter(reg);
        }
    })
}

var host = window.location.host;
let googleRe = /www.google.com|www.google.co.jp|www.google.cn|www.google.com.hk/;
var googleFilter = function (reg) {
    if (googleRe.test(host)) {
        var queryList = document.getElementsByClassName('g');
        var queryNum = queryList.length;
        for (var i = 0; i < queryNum; ++i) {
            var item = queryList[i];
            if (!item) continue;
            var node = item.getElementsByClassName("r");

            if (node.length !== 0) {
                var url = node[0].innerHTML;
                if (reg.test(url)) {
                    item.remove();
                }
            }
        }
        var tab = document.getElementById("hdtb-msb");
        inputFilter(tab);
    }
}

function filterHandler() {
    var inputFilter = document.getElementById('inputFilter');
    if (inputFilter.value !== '') {
        chrome.storage.sync.get('filter', function (data) {
            getRe = data.filter + '|' + inputFilter.value + '\/.*?';
            chrome.storage.sync.set({
                'filter': getRe
            });
            alert('已添加过滤地址');
            window.location.reload(true);
        });
    } else {
        alert('请输入需要过滤的域名');
    }
}

function inputFilter(tab) {
    if (document.getElementById('inputFilter') === null) {
        var inputFilter = document.createElement('input');
        inputFilter.setAttribute('id', 'inputFilter');
        inputFilter.setAttribute('class', 'hdtb-dd-b');
        inputFilter.setAttribute('placeholder', '过滤域名');
        // 创建一个过滤按钮
        var filterButton = document.createElement('button');
        filterButton.innerHTML = "添加过滤";
        filterButton.addEventListener('click', filterHandler);
        //创建一个输入按钮
        var exportBtn = document.createElement('button');
        exportBtn.innerHTML = "导出";
        exportBtn.addEventListener('click', exportFile);
        tab.appendChild(inputFilter);
        tab.appendChild(filterButton);
        tab.appendChild(exportBtn);
    }
}

//不能直接使用export 关键字
var exportFile = function () {
    chrome.storage.sync.get('filter', function (data) {
        var result = JSON.stringify(data);
        var url = 'data:application/json;base64,' + btoa(result);
        chrome.runtime.sendMessage({
            'filter': url
        }, function (response) {});
    });
};

main();