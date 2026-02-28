// ==UserScript==
// @name         Grab & Go Image Downloader - Twitter/X
// @namespace    http://tampermonkey.net/
// @version      2026-01-21
// @description  GitHub KNNeo
// @author       One click image processor to downloader script
// @match        https://twitter.com/i/lists/*
// @match        https://twitter.com/*/status/*
// @match        https://x.com/i/lists/*
// @match        https://x.com/*/status/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('scroll', function() {
        let format = '.jpeg'; // can change to .png or .jpg
        let arts = Array.from(document.querySelectorAll('article'));
        for(let art of arts) {
            if(art.getAttribute('data-index')) continue;
            art.setAttribute('data-index', 1);
            let menus = Array.from(document.querySelectorAll('img[src*="media"]'));
            for(let menu of menus) {
                let solo = art.querySelector('.monkey-action-solo') || document.createElement('button');
                solo.style.cursor = 'pointer';
                solo.style.position = 'absolute';
                solo.style.zIndex = '9';
                solo.style.fontSize = '1.2rem';
                solo.className = 'monkey-action-solo';
                solo.innerText = '👤';
                solo.onclick = function() {
                    event.preventDefault();
                    let img = event.target.parentElement.querySelector('img');
                    let imgUrl = new URL(img.src);
                    imgUrl.searchParams.set("name", "large");
                    let fullSizeImg = imgUrl.toString();
                    let source = fullSizeImg.slice(fullSizeImg.indexOf('/media/')+7, fullSizeImg.indexOf('?')) + format;
                    let art = event.target.closest('article');
                    let user = art.querySelector('[data-testid="User-Name"]').innerText;
                    let folder = mapper(user);
                    if(!folder) {
                        let result = prompt('mapping not found! enter mapping in format [handle]/[folder] or as [folder] for one-time add');
                        if(result) {
                            let sections = result.split('/');
                            if(sections.length == 2) {
                                list[sections[0]] = sections[1];
                                localStorage.setItem('x-monkey-action-mapper', JSON.stringify(list));
                                user = sections[0];
                                folder = mapper(user);
                            }
                            else if(sections.length == 1) {
                                folder = sections[0];
                            }
                            else {
                                return alert('mapping add failed! try again');
                            }
                        }
                        else {
                            return alert('mapping add failed! try again');
                        }
                    }
                    let url = 'dlapp://save?url={link}&name={filename}&user={user}'
                    .replace('{link}', encodeURIComponent(fullSizeImg))
                    .replace('{filename}', encodeURIComponent(source))
                    .replace('{user}', encodeURIComponent(folder));
                    console.log(url);
                    window.location.href = url;
                };
                if(!art.querySelector('.monkey-action-solo')) {
                    menu.parentElement.appendChild(solo);
                }
            }
        }
        console.log('scrolling');
    });
    console.log('grab n go image downloader for twitter/x loaded');
})();

var mapper = function(data) {
    list = localStorage.getItem('twitter-grabngo-action-mapper') ? JSON.parse(localStorage.getItem('twitter-grabngo-action-mapper')) : list;
    console.log('twitter-grabngo-action-mapper', list);
    for(let key of Object.keys(list)) {
        if(data.includes(key)) {
            return list[key];
        }
    }
    return null;
};

// add your own mappings here to prevent reliance on browser storage
var list = {};
