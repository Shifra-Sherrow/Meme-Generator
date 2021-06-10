'use strict';

var gCurrMeme = _createMeme();
var gStickers = _createStickers();

// ---- get functions

function getCurrMeme() {
    return gCurrMeme;
}

function getStickers() {
    return gStickers;
}

// ---- set functions

function switchLine(idx) {
    if (idx !== undefined) gCurrMeme.selectedLineIdx = idx;
    else gCurrMeme.selectedLineIdx = (gCurrMeme.lines.length - 1 > gCurrMeme.selectedLineIdx) ? gCurrMeme.selectedLineIdx + 1 : 0;
}

function addLine() {
    gCurrMeme.lines.push(_createLine({ x: 151.5, y: 262 }));
    gCurrMeme.selectedLineIdx = gCurrMeme.lines.length - 1;
}

function removeLine() {
    gCurrMeme.lines.splice(gCurrMeme.selectedLineIdx, 1);
    if (gCurrMeme.selectedLineIdx >= gCurrMeme.lines.length) {
        if (gCurrMeme.lines.length) gCurrMeme.selectedLineIdx = 0;
        else gCurrMeme.selectedLineIdx = null;
    }
}

function moveLine(axis, size, idx = gCurrMeme.selectedLineIdx) {
    if (axis === 'y') gCurrMeme.lines[idx].pos.y += size;
    else gCurrMeme.lines[idx].pos.x += size;
}

function updateCurrImg(id) {
    const imgs = getImgs();
    if (gCurrMeme.selectedImg.id !== id) {
        gCurrMeme.selectedImg.id = id;
        gCurrMeme.selectedImg.img = new Image();
        gCurrMeme.selectedImg.img.src = imgs.find(img => img.id === id).url;
    }
}

function updateCurrLine(line, posX) {
    let currLine = gCurrMeme.lines[gCurrMeme.selectedLineIdx];
    currLine.txt = line;
    currLine.pos.x = posX;
}

function updateCurrAlign(posX) {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].pos.x = posX;
}

function updateCurrfontSize(newSize, posX, posY) {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].pos.x = posX;
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].pos.y = posY;
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].size = newSize;
}

function updateCurrfontFamily(font, posX) {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].pos.x = posX;
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].fontFamily = font;
}

function updateCurrColor(value, isStroke) {
    if (isStroke) gCurrMeme.lines[gCurrMeme.selectedLineIdx].strokeColor = value;
    else gCurrMeme.lines[gCurrMeme.selectedLineIdx].fillColor = value;
}

function addSticker(id) {
    let stickerImg = new Image();
    stickerImg.src = gStickers.find(img => img.id === id).url;
    const pos = { x: 215, y: 214 };
    gCurrMeme.stickers.push({ id, stickerImg, pos, isMark: false });
}

function removeSticker(idx) {
    gCurrMeme.stickers.splice(idx, 1);
}

function moveSticker(axis, size, idx) {
    if (axis === 'y') gCurrMeme.stickers[idx].pos.y += size;
    else gCurrMeme.stickers[idx].pos.x += size;
}

function toggleMarkSticker(idx) {
    gCurrMeme.stickers[idx].isMark = !gCurrMeme.stickers[idx].isMark;
}

function resetCurrMeme() {
    gCurrMeme = _createMeme();
}

function setMeme(idx) {
    const currMeme = getSavedMemes()[idx];
    gCurrMeme = deepCopy(currMeme);
    delete gCurrMeme.canvasImgUrl;
    renderCanvas();
    openEditor();
}

// ---- private functions

function _createMeme() {
    return {
        selectedImg: {
            id: 0,
            img: null
        },
        selectedLineIdx: 0,
        lines: [
            _createLine({ x: 151.5, y: 112 }),
            _createLine({ x: 151.5, y: 422 })
        ],
        stickers: []
    };
}

function _createLine(pos) {
    return { txt: 'Your text here', size: 35, fontFamily: 'IMPACT', strokeColor: 'black', fillColor: 'white', pos };
}

function _createStickers() {
    return [
        { id: 1, url: 'imgs/stickers/1.png' },
        { id: 2, url: 'imgs/stickers/2.png' },
        { id: 3, url: 'imgs/stickers/3.png' },
        { id: 4, url: 'imgs/stickers/4.png' },
        { id: 5, url: 'imgs/stickers/5.png' },
        { id: 6, url: 'imgs/stickers/6.png' },
        { id: 7, url: 'imgs/stickers/7.png' },
        { id: 8, url: 'imgs/stickers/8.png' },
        { id: 9, url: 'imgs/stickers/9.png' },
        { id: 10, url: 'imgs/stickers/10.png' },
        { id: 11, url: 'imgs/stickers/11.png' },
        { id: 12, url: 'imgs/stickers/12.png' },
        { id: 13, url: 'imgs/stickers/13.png' },
        { id: 14, url: 'imgs/stickers/14.png' },
        { id: 15, url: 'imgs/stickers/15.png' },
        { id: 16, url: 'imgs/stickers/16.png' },
        { id: 17, url: 'imgs/stickers/17.png' },
        { id: 18, url: 'imgs/stickers/18.png' },
        { id: 19, url: 'imgs/stickers/19.png' },
        { id: 20, url: 'imgs/stickers/20.png' }
    ];
}