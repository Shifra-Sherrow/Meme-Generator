'use strict';

var gSavedMemes;

// get functions

function getSavedMemes() {
    return gSavedMemes;
}

// set functions

function initSavedMemes() {
    gSavedMemes = loadFromStorage('saved-memes') || [];
    if (gSavedMemes.length) {
        gSavedMemes.forEach(meme => {
            const imgs = getImgs();
            meme.selectedImg.img = new Image();
            meme.selectedImg.img.src = imgs.find(img => img.id === meme.selectedImg.id).url;

            if (meme.stickers.length) {
                meme.stickers.forEach((sticker, idx) => {
                    const stickers = getStickers();
                    meme.stickers[idx].stickerImg = new Image();
                    meme.stickers[idx].stickerImg.src = stickers.find(s => s.id === sticker.id).url;
                });
            }
        });
    }
    _saveSavedMemesToStorage();
}

function saveMeme(canvasImgUrl) {
    let newMeme = deepCopy(getCurrMeme());
    resetCurrMeme();
    newMeme.canvasImgUrl = canvasImgUrl;
    gSavedMemes.push(newMeme);
    _saveSavedMemesToStorage();
}

function deleteMeme(idx) {
    gSavedMemes.splice(idx, 1);
    _saveSavedMemesToStorage();
}

// private functions

function _saveSavedMemesToStorage() {
    saveToStorage('saved-memes', gSavedMemes);
}