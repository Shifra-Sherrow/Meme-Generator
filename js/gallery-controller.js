'use strict';

// events functions

function onChangeSearch() {
    let elSearch = document.querySelector('.search input');
    updateSearch(elSearch.value.toLowerCase());
    renderGallery();
}

function onChangeKeyword(keyword) {
    updateCurrKeyword(keyword);
    renderTopicsBtns();
    renderGallery();
}

function onNextIdx() {
    setNextIdx();
    renderTopicsBtns();
}

function startUpload() {
    document.querySelector('.file').click();
}

function onUpload(ev) {
    const file = ev.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = ev => {
            const imgs = getImgs();
            const newImg = {
                id: imgs[imgs.length - 1].id + 1,
                name: file.name.substring(0, file.name.indexOf('.')),
                url: ev.target.result,
                keywords: ['all']
            };
            addImg(newImg);
            renderGallery();
        }
        reader.readAsDataURL(file);
    }
}

function onDeleteImg(ev, imgId) {
    ev.stopPropagation();
    deleteImg(imgId);
    renderGallery();
}

// render functions

function renderTopicsBtns() {
    const keywords = getKeywords();
    let strHtmls = ``;
    for (let keyword in keywords) {
        strHtmls += `<button class="capitalize" onclick="onChangeKeyword('${keyword}')" style="font-size: ${keywords[keyword]}px;">${keyword}</button>`;
    }
    const elTopics = document.querySelector('.topics');
    elTopics.innerHTML = strHtmls;
    _setIdxs(elTopics.querySelectorAll('button'));
    const lastIdx = +document.querySelector('.topics > button:last-child').classList[1].substring(4);
    setLastIdx(lastIdx);
    const currIdx = getCurrIdx();
    const nodes = elTopics.querySelectorAll(`button:not(.cls-${currIdx})`);
    nodes.forEach(node => node.parentNode.removeChild(node));
}

function renderGallery() {
    let strHtml = `
        <button class="upload">
            <span class="upload-txt" onclick="startUpload()">
                <i class="fas fa-upload"></i>
                upload Image
            </span>
            <span class="square-only">square only</span>
        </button>
        <input type="file" name="file" class="file" onchange="onUpload(event)" hidden />
    `;
    const imgs = getImgsByFilter();
    if (imgs.length) {
        strHtml += imgs.map(img => {
            return `<div class="img-preview">
                        <img src="${img.url}" onclick="onImgClicked(${img.id})" />
                        <button class="flex" onclick="onDeleteImg(event, ${img.id})"><i class="fal fa-trash-alt"></i></button>
                    </div>`;
        }).join('');
    } else strHtml += '<span class="no-imgs flex-center">There are no images that match your search</span>';
    document.querySelector('.gallery').innerHTML = strHtml;
}

// private functions

function _setIdxs(btnsArr) {
    let idx = 1;
    btnsArr[0].classList.add(`cls-${idx}`);

    for (let i = 0; i < btnsArr.length - 1; i++) {
        const currLeft = _getNodeLeft(btnsArr[i]);
        const PrevLeft = _getNodeLeft(btnsArr[i + 1]);
        if (PrevLeft <= currLeft + btnsArr[i].offsetWidth) idx++;
        btnsArr[i + 1].classList.add(`cls-${idx}`);
    }
}

function _getNodeLeft(node) {
    let left = 0;
    while (node) {
        if (node.tagName) {
            left = left + node.offsetLeft;
            node = node.offsetParent;
        } else {
            node = node.parentNode;
        }
    }
    return left;
}