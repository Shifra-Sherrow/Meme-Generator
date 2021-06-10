'use strict';

// events functions

async function onSave() {
    renderCanvas(false, true);
    const canvasImgUrl = await getCanvas().toDataURL();
    saveMeme(canvasImgUrl);
    renderNumOfSavedMemes();
    renderSavedMemes();
    openSavedMemes();
}

function onSetMeme(idx) {
    setMeme(idx);
    const currMemeLineIdx = getCurrMeme().selectedLineIdx;
    if (currMemeLineIdx !== null) onSwitchLine(currMemeLineIdx);
}

function onDeleteMeme(ev, idx) {
    ev.stopPropagation();
    deleteMeme(idx);
    renderNumOfSavedMemes();
    renderSavedMemes();
}

// render functions

function renderNumOfSavedMemes() {
    document.querySelector('.nav .saved-memes-li span').innerText = `(${getSavedMemes().length})`;
}

function renderSavedMemes() {
    const savedMemes = getSavedMemes();
    let strHTML;
    if (savedMemes.length) {
        strHTML = '<ul class="flex-center wrap">';
        strHTML += savedMemes.map((meme, idx) => {
            return `<li onclick="onSetMeme(${idx})">
                        <img src="${meme.canvasImgUrl}" />
                        <i class="far fa-trash-alt" onclick="onDeleteMeme(event, ${idx})"></i>
                    </li>`;
        }).join('');
        strHTML += '</ul>';
    } else strHTML = '<span class="no-memes flex-center">No memes saved yet</span>';
    document.querySelector('.saved-memes').innerHTML = strHTML;
}