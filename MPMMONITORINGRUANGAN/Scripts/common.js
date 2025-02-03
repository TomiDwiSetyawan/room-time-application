//let loadPanel
//let toast
toastTypes = {
    SUCCESS: "success",
    ERROR: "error",
    WARNING: "warning",
    INFO: "info"
}

$(document).ready(function () {
    loadPanel = $('.loadpanel').dxLoadPanel({
        shadingColor: 'rgba(0,0,0,0.4)',
        visible: false,
        showIndicator: true,
        showPane: true,
        shading: true,
        hideOnOutsideClick: false,
    }).dxLoadPanel('instance');

    toast = $('#toast').dxToast({
        displayTime: 1000, width: 400
    }).dxToast('instance');
})

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function formatDateTime(dotNetDate) {
    const timestamp = parseInt(dotNetDate.match(/\d+/)[0]);
    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${month}-${day}-${year} ${hours}:${minutes}:${seconds}`;
}

async function callAjax(url, data, method = 'POST') {
    const options = {
        url: url,
        type: method,
        contentType: "application/json",
    }
    if (data !== null) {
        options['data'] = JSON.stringify(data)
    }

    return new Promise(function (resolve, reject) {
        $.ajax({
            ...options,
            success: function (response) {
                resolve(response)
            },
            error: function (xhr, status, error) {
                reject(error);
            }
        });
    });
}

function getFstDayOfMonFnc() {
    var date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1)
}

function getUrl(url) {
    let finalUrl = null
    $('.url').each(function () {
        if ($(this).data(url)) finalUrl = $(this).data(url)
    })
    return finalUrl
}

