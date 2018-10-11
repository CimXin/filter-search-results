// /** 安装完成回调 */
// chrome.runtime.onInstalled.addListener(function () {
//     chrome.storage.sync.set({
//         color: '#3aa757'
//     }, function () {
//         console.log('The color is green.');
//     });
//     chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
//         test(1);
//         chrome.declarativeContent.onPageChanged.addRules([{
//             conditions: [new chrome.declarativeContent.PageStateMatcher({
//                 pageUrl: {
//                     hostEquals: 'developer.chrome.com'
//                 },
//             })],
//             actions: [new chrome.declarativeContent.ShowPageAction()]
//         }]);
//     });
// });

// function test(str) {
//     console.log("add log: ", str);
// }

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    url = request.filter;
    chrome.downloads.download({
        url: url,
        filename: 'filterRules.json'
    });
});