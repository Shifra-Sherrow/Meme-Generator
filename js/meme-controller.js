'use strict';

var gCanvas;
var gCtx;

var gLineToMove = {
    idx: null,
    offset: {
        xStart: null,
        xEnd: null,
        yStart: null,
        yEnd: null
    }
};
var gStickerToMove = {
    idx: null,
    offset: {
        xStart: null,
        xEnd: null,
        yStart: null,
        yEnd: null
    }
};

// get functions

function getCanvas() {
    return gCanvas;
}

// events functions

function onInit() {
    gCanvas = document.querySelector('#myCanvas');
    gCtx = gCanvas.getContext('2d');

    initKeywords();
    initImgs();
    initSavedMemes();

    renderTopicsBtns();
    renderGallery();
    renderStickers();
    renderNumOfSavedMemes();
    renderSavedMemes();

    gCanvas.addEventListener('contextmenu', onRemoveSticker);
    gCanvas.addEventListener('mousemove', setCursor);
}

function onSwitchLine(idx) {
    switchLine(idx);
    renderCanvas();
    focusOnInput();
}

function onAddLine() {
    addLine();
    renderCanvas();
    focusOnInput();
}

function onRemoveLine() {
    removeLine();
    renderCanvas();
    focusOnInput();
}

function onMoveLine(axis, size) {
    const currMeme = getCurrMeme();
    const currLine = currMeme.lines[currMeme.selectedLineIdx];
    const currLineWidth = _getCurrLineWidth(currLine);
    if (axis === 'x' &&
        (
            (size < 0 && currLine.pos.x < Math.abs(size) + 6) ||
            (size > 0 && currLine.pos.x + currLineWidth + size + 6 > gCanvas.width)
        )
    ) size = 0;
    if (axis === 'y' &&
        (
            (size < 0 && currLine.pos.y - currLine.size - Math.abs(size) - 6 < 0) ||
            (size > 0 && currLine.pos.y + size + 6 > gCanvas.height)
        )
    ) size = 0;
    moveLine(axis, size);
    renderCanvas();
}

function onImgClicked(id) {
    updateCurrImg(id);
    renderCanvas();
    openEditor();
    focusOnInput();
}

function onChangeLine(line) {
    const currMeme = getCurrMeme();
    const currLine = currMeme.lines[currMeme.selectedLineIdx];
    gCtx.font = `${currLine.size}px ${currLine.fontFamily}`;
    const currLineWidth = gCtx.measureText(currLine.txt).width;
    const newLineWidth = gCtx.measureText(line).width;
    const posX = _getPosX(currLine, currLineWidth, newLineWidth);
    updateCurrLine(line, posX);
    renderCanvas();
}

function onChangeAlign(align) {
    const currMeme = getCurrMeme();
    const currLine = currMeme.lines[currMeme.selectedLineIdx];
    const currLineWidth = _getCurrLineWidth(currLine);
    let posX;
    switch (align) {
        case 'left':
            posX = 6;
            break;
        case 'center':
            posX = gCanvas.width / 2 - currLineWidth / 2;
            break;
        case 'right':
            posX = gCanvas.width - currLineWidth - 6;
            break;
    }
    updateCurrAlign(posX);
    renderCanvas();
}

function onChangeSize(isBigger) {
    const currMeme = getCurrMeme();
    const currLine = currMeme.lines[currMeme.selectedLineIdx];
    const currLineWidth = _getCurrLineWidth(currLine);
    let newSize = currLine.size + (isBigger ? 4 : -8);
    gCtx.font = `${newSize}px ${currLine.fontFamily}`;
    const newLineWidth = gCtx.measureText(currLine.txt).width;
    let posX = _getPosX(currLine, currLineWidth, newLineWidth);
    if (newLineWidth > gCanvas.width - 12) {
        newSize = currLine.size;
        posX = currLine.pos.x;
    }
    const diff = newSize - currLine.size;
    let posY = currLine.pos.y + diff / 2;
    if (posY < newSize + 6) posY = newSize + 6;
    if (posY > gCanvas.height - 6) posY = currLine.pos.y;
    updateCurrfontSize(newSize, posX, posY);
    renderCanvas();
}

function onChangeFont(font) {
    const currMeme = getCurrMeme();
    const currLine = currMeme.lines[currMeme.selectedLineIdx];
    const currLineWidth = _getCurrLineWidth(currLine);
    gCtx.font = `${currLine.size}px ${font}`;
    const newLineWidth = gCtx.measureText(currLine.txt).width;
    const posX = _getPosX(currLine, currLineWidth, newLineWidth);
    updateCurrfontFamily(font, posX);
    renderCanvas();
}

function onChangeColor(color, isStroke) {
    updateCurrColor(color, isStroke);
    renderCanvas();
}

function onDownload() {
    renderCanvas(true, false);
    renderCanvas();
}

function onStickerClicked(id) {
    addSticker(id);
    renderCanvas();
}

// drag functions

function setCursor(ev) {
    const res = isDragArea(getCurrMeme().lines, ev, true, setPointer);
    if (!res) isDragArea(getCurrMeme().stickers, ev, false, setPointer);
}

function setPointer() {
    gCanvas.classList.add('pointer');
}

function onRemoveSticker(ev) {
    ev.preventDefault();
    isDragArea(getCurrMeme().stickers, ev, false, doRemoveSticker);
}

function doRemoveSticker(isLines, idx) {
    removeSticker(idx);
    renderCanvas();
}

function onHandleMove(ev) {
    if (ev.type === 'mousedown' || ev.type === 'touchstart') {
        const currMeme = getCurrMeme();
        const res = isDragArea(currMeme.lines, ev, true, startMove);
        if (!res) isDragArea(currMeme.stickers, ev, false, startMove);
    } else if (ev.type === 'mousemove' || ev.type === 'mouseup' || ev.type === 'touchmove' || ev.type === 'touchend') {
        if (gLineToMove.idx !== null) endMove(gLineToMove, ev, true, moveLine);
        if (gStickerToMove.idx !== null) endMove(gStickerToMove, ev, false, moveSticker);
    }
}

function startMove(isLines, i, mouseX, mouseY) {
    isLines ? gLineToMove.idx = i : gStickerToMove.idx = i;
    isLines ? switchLine(i) : toggleMarkSticker(i);
    renderCanvas();
    isLines ? gLineToMove.offset.xStart = mouseX : gStickerToMove.offset.xStart = mouseX;
    isLines ? gLineToMove.offset.yStart = mouseY : gStickerToMove.offset.yStart = mouseY;
}

function endMove(objToMove, ev, isLines, func) {
    objToMove.offset.xEnd = ev.offsetX;
    objToMove.offset.yEnd = ev.offsetY;
    func('x', objToMove.offset.xEnd - objToMove.offset.xStart, objToMove.idx);
    func('y', objToMove.offset.yEnd - objToMove.offset.yStart, objToMove.idx);
    renderCanvas();
    objToMove.offset.xStart = ev.offsetX;
    objToMove.offset.yStart = ev.offsetY;
    isLines ? gLineToMove = objToMove : gStickerToMove = objToMove;

    if (ev.type === 'mouseup' || ev.type === 'touchend') {
        if (!isLines) {
            toggleMarkSticker(gStickerToMove.idx);
            renderCanvas();
        } else focusOnInput();
        objToMove = {
            idx: null,
            offset: {
                xStart: null,
                xEnd: null,
                yStart: null,
                yEnd: null
            }
        };
        isLines ? gLineToMove = objToMove : gStickerToMove = objToMove;
    }
}

function isDragArea(items, ev, isLines, func) {
    let width = 70;
    let height = 70;
    for (let i = 0; i < items.length; i++) {
        if (isLines) {
            gCtx.font = `${items[i].size}px ${items[i].fontFamily}`;
            width = gCtx.measureText(items[i].txt).width;
            height = items[i].size;
        }
        const xStart = items[i].pos.x;
        const mouseX = ev.offsetX;
        const xEnd = items[i].pos.x + width;
        const yStart = isLines ? items[i].pos.y - height : items[i].pos.y;
        const mouseY = ev.offsetY;
        const yEnd = isLines ? items[i].pos.y : items[i].pos.y + height;

        if (mouseX >= xStart && mouseX <= xEnd && mouseY >= yStart && mouseY <= yEnd) {
            func(isLines, i, mouseX, mouseY);
            return true;
        }
    }
    if (!isLines) gCanvas.classList.remove('pointer');
}

// render functions

function renderCanvas(isForDownload = false, isForSaving = false) {
    clearCanvas();
    drawCanvas(isForDownload, isForSaving);
}

function renderStickers() {
    const stickers = getStickers();
    let strHTML = stickers.map(sticker => {
        return `<img src="${sticker.url}" onclick="onStickerClicked(${sticker.id})" />`;
    }).join('');
    strHTML += '<span>To remove a sticker: right-click on it</span>';
    document.querySelector('.stickers').innerHTML = strHTML;
}

// draw functions

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}

function drawCanvas(isForDownload, isForSaving) {
    const currMeme = getCurrMeme();
    gCtx.drawImage(currMeme.selectedImg.img, 0, 0, gCanvas.width, gCanvas.height);
    if (currMeme.lines.length && !isForDownload && !isForSaving) drawMarkRect(currMeme);
    drawLines(currMeme.lines);
    currMeme.stickers.forEach(sticker => {
        if (sticker.isMark) drawMarkRectToSticker(sticker.pos.x, sticker.pos.y);
        gCtx.drawImage(sticker.stickerImg, sticker.pos.x, sticker.pos.y, 70, 70);
    });
    if (isForDownload) {
        const elDownload = document.querySelector('.download-link');
        const data = gCanvas.toDataURL();
        elDownload.href = data;
        elDownload.download = 'my-meme.jpg';
        elDownload.click();
    }
}

function drawMarkRect(currMeme) {
    gCtx.beginPath();
    const currLine = currMeme.lines[currMeme.selectedLineIdx];
    const rectPosY = currLine.pos.y - currLine.size;
    gCtx.font = `${currLine.size}px ${currLine.fontFamily}`;
    const rectWidth = gCtx.measureText(currLine.txt).width + 10;
    const rectHeight = currLine.size + 7;
    gCtx.rect(currLine.pos.x - 5, rectPosY, rectWidth, rectHeight);
    gCtx.fillStyle = '#ffffff6b';
    gCtx.fillRect(currLine.pos.x - 5, rectPosY, rectWidth, rectHeight);
}

function drawMarkRectToSticker(x, y) {
    gCtx.beginPath();
    gCtx.rect(x, y, 70, 70);
    gCtx.fillStyle = '#0000006b';
    gCtx.fillRect(x, y, 70, 70);
}

function drawLines(lines) {
    lines.forEach(line => {
        gCtx.beginPath();
        gCtx.lineWidth = '2';
        gCtx.font = `${line.size}px ${line.fontFamily}`;
        gCtx.strokeStyle = line.strokeColor;
        gCtx.fillStyle = line.fillColor;
        gCtx.fillText(line.txt, line.pos.x, line.pos.y);
        gCtx.strokeText(line.txt, line.pos.x, line.pos.y);
    });
}

// private functions

function _getCurrLineWidth(currLine) {
    gCtx.font = `${currLine.size}px ${currLine.fontFamily}`;
    return gCtx.measureText(currLine.txt).width;
}

function _getPosX(currLine, currLineWidth, newLineWidth) {
    const diff = newLineWidth - currLineWidth;
    let posX = currLine.pos.x - (diff / 2);
    if (posX < 6) posX += (diff / 2);
    if (posX + newLineWidth > gCanvas.width - 6) posX -= (diff / 2);
    return posX;
}