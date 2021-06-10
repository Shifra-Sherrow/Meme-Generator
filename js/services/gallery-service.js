'use strict';

var gKeywords;
var gCurrIdx = 1;
var gLastIdx;

var gImgs;
var gFilter = 'all';
var gSearch = '';

// get functions

function getKeywords() {
    return gKeywords;
}

function getCurrIdx() {
    return gCurrIdx;
}

function getImgs() {
    return gImgs;
}

function getImgsByFilter() {
    const filteredImgs = gImgs.filter(img => img.keywords.includes(gFilter));
    return filteredImgs.filter(img => img.name.includes(gSearch));
}

// set functions

function initKeywords() {
    gKeywords = _createKeywords();
    _saveKeywordsToStorage();
}

function initImgs() {
    gImgs = _createImgs();
    _saveImgsToStorage();
}

function updateSearch(searchBy) {
    gSearch = searchBy;
}

function updateCurrKeyword(keyword) {
    if (gKeywords[keyword] <= 20 && keyword !== 'all') {
        gKeywords[keyword] += 5;
        _saveKeywordsToStorage();
    }
    gFilter = keyword;
}

function setLastIdx(lastIdx) {
    gLastIdx = lastIdx;
}

function setNextIdx() {
    gCurrIdx = gCurrIdx === gLastIdx ? 1 : gCurrIdx + 1;
}

function addImg(img) {
    gImgs.push(img);
    _saveImgsToStorage();
}

function deleteImg(imgId) {
    const idx = gImgs.findIndex(i => i.id === imgId);
    gImgs.splice(idx, 1);
    _saveImgsToStorage();
}

// private functions

function _createKeywords() {
    let keywords = loadFromStorage('keywords');
    if (!keywords) {
        keywords = {
            'all': 20, 'woman': 25, 'man': 15, 'animal': 20, 'cute': 25, 'relationships': 15, 'celebration': 20, 'sport': 20, 'politics': 25, 'laugh': 25, 'kid': 15, 'baby': 20, 'funny': 20, 'success': 15, 'surprise': 15, 'towering': 20, 'conspiracy': 25, 'dilemma': 15, 'heroism': 25, 'cheers': 20, 'tired': 15, 'fact': 20, 'oops': 25, 'victory': 15, 'happy': 20, 'sad': 15, 'naive': 20, 'begging': 15, 'mony': 25, 'scene': 20
        };
    }
    return keywords;
}

function _createImgs() {
    let imgs = loadFromStorage('imgs');
    if (!imgs || !imgs.length) {
        imgs = [
            { id: 1, name: 'trump', url: 'imgs/gallery/trump.jpg', keywords: ['all', 'man', 'trump', 'funny'] },
            { id: 2, name: 'dogs', url: 'imgs/gallery/dogs.jpg', keywords: ['all', 'animal', 'cute'] },
            { id: 3, name: 'baby and dog', url: 'imgs/gallery/baby and dog.jpg', keywords: ['all', 'baby', 'animal', 'cute', 'tired'] },
            { id: 4, name: 'cat', url: 'imgs/gallery/cat.jpg', keywords: ['all', 'animal', 'cute', 'tired'] },
            { id: 5, name: 'success', url: 'imgs/gallery/success.jpg', keywords: ['all', 'kid', 'success'] },
            { id: 6, name: 'surprise', url: 'imgs/gallery/surprise.jpg', keywords: ['all', 'kid', 'surprise', 'cute'] },
            { id: 7, name: 'advice animals', url: 'imgs/gallery/advice animals.jpg', keywords: ['all', 'man', 'towering', 'advice animals'] },
            { id: 8, name: 'conspiracy', url: 'imgs/gallery/conspiracy.jpg', keywords: ['all', 'kid', 'laugh', 'conspiracy'] },
            { id: 9, name: 'obama', url: 'imgs/gallery/obama.jpg', keywords: ['all', 'man', 'obama', 'laugh'] },
            { id: 10, name: 'hecht', url: 'imgs/gallery/hecht.jpg', keywords: ['all', 'man', 'hecht', 'dilemma'] },
            { id: 11, name: 'dicaprio', url: 'imgs/gallery/dicaprio.jpg', keywords: ['all', 'man', 'dicaprio', 'celebration', 'cheers'] },
            { id: 12, name: 'matrix', url: 'imgs/gallery/matrix.jpg', keywords: ['all', 'man', 'matrix', 'fact'] },
            { id: 13, name: 'lord of the rings', url: 'imgs/gallery/lord of the rings.jpg', keywords: ['all', 'man', 'lord of the rings', 'mordor'] },
            { id: 14, name: 'oops', url: 'imgs/gallery/oops.jpg', keywords: ['all', 'man', 'perry', 'oops', 'laugh'] },
            { id: 15, name: 'putin', url: 'imgs/gallery/putin.jpg', keywords: ['all', 'man', 'putin', 'victory'] },
            { id: 16, name: 'toy story', url: 'imgs/gallery/toy story.jpg', keywords: ['all', 'toy story', 'sad', 'happy'] },
            { id: 17, name: 'yonit is surprised', url: 'imgs/gallery/yonit is surprised.jpg', keywords: ['all', 'surprise', 'woman'] },
            { id: 18, name: 'muppets', url: 'imgs/gallery/muppets.jpg', keywords: ['all', 'muppets', 'word games'] },
            { id: 19, name: 'bling bling', url: 'imgs/gallery/bling bling.jpg', keywords: ['all', 'woman', 'celebration', 'victory', 'success'] },
            { id: 20, name: 'shut up and take my money', url: 'imgs/gallery/shut up and take my money.jpg', keywords: ['all', 'man', 'towering', 'mony'] },
            { id: 21, name: 'skeptical baby', url: 'imgs/gallery/skeptical baby.jpg', keywords: ['all', 'kid', 'cute', 'funny', 'sureness'] },
            { id: 22, name: 'grandma finds the internet', url: 'imgs/gallery/grandma finds the internet.jpg', keywords: ['all', 'woman', 'funny', 'surprise', 'internet', 'naive'] },
            { id: 23, name: 'shrek\'s cat begs', url: 'imgs/gallery/shrek\'s cat begs.jpg', keywords: ['all', 'animal', 'cat', 'cute', 'begging'] },
            { id: 24, name: 'all the things', url: 'imgs/gallery/all the things.jpg', keywords: ['all', 'hyperbole and a half', 'clean'] },
            { id: 25, name: 'scene', url: 'imgs/gallery/scene.jpg', keywords: ['all', 'animal', 'scene', 'relationships'] },
            { id: 26, name: 'lior shlain', url: 'imgs/gallery/lior shlain.jpg', keywords: ['all', 'man', 'tired', 'laugh', 'towering', 'fact', 'politics'] },
            { id: 27, name: 'the handmaid\'s tale', url: 'imgs/gallery/the handmaid\'s tale.jpg', keywords: ['all', 'woman', 'heroism', 'sad', 'beyond ability', 'suffering'] }
        ];
    }
    return imgs;
}

function _saveKeywordsToStorage() {
    saveToStorage('keywords', gKeywords);
}

function _saveImgsToStorage() {
    saveToStorage('imgs', gImgs);
}