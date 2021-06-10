'use strict';

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

function loadFromStorage(key) {
    const val = localStorage.getItem(key);
    return JSON.parse(val);
}

function _toRawType(value) {
    let _toString = Object.prototype.toString;
    let str = _toString.call(value);
    return str.slice(8, -1);
}

function deepCopy(inObject) {
    let outObject, value, key;
    if (typeof inObject !== 'object' || inObject === null) return inObject;
    if (_toRawType(inObject) === 'HTMLImageElement') {
        let img = new Image();
        img.src = inObject.src;
        return img;
    }
    outObject = Array.isArray(inObject) ? [] : {};
    for (key in inObject) {
        value = inObject[key];
        outObject[key] = deepCopy(value);
    }
    return outObject;
}

// timing events functions

function toggleMenu() {
    document.body.classList.toggle('show');
}

function openGallery() {
    document.querySelector('.editor').classList.add('hide');
    document.querySelector('.gallery-container').classList.remove('hide');
    document.querySelector('.saved-memes').classList.add('hide');

    document.querySelector('.nav .gallery-li').classList.add('li-focus');
    document.querySelector('.nav .saved-memes-li').classList.remove('li-focus');

    document.body.classList.remove('show');

    document.querySelector('.line-input').value = '';
    resetCurrMeme();
}

function openEditor() {
    document.querySelector('.editor').classList.remove('hide');
    document.querySelector('.gallery-container').classList.add('hide');
    document.querySelector('.saved-memes').classList.add('hide');

    document.querySelector('.nav .gallery-li').classList.remove('li-focus');
    document.querySelector('.nav .saved-memes-li').classList.remove('li-focus');
}

function openSavedMemes() {
    document.querySelector('.editor').classList.add('hide');
    document.querySelector('.gallery-container').classList.add('hide');
    document.querySelector('.saved-memes').classList.remove('hide');

    document.querySelector('.nav .gallery-li').classList.remove('li-focus');
    document.querySelector('.nav .saved-memes-li').classList.add('li-focus');

    document.body.classList.remove('show');

    document.querySelector('.line-input').value = '';
    resetCurrMeme();
}

function focusOnInput() {
    const currMeme = getCurrMeme();
    let elInput = document.querySelector('.line-input');
    elInput.value = currMeme.lines.length ? currMeme.lines[currMeme.selectedLineIdx].txt : '';
    if (elInput.value) {
        elInput.focus();
        elInput.select();
    }
}