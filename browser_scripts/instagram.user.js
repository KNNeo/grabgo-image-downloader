// ==UserScript==
// @name         Grab & Go Image Downloader - instagram.com
// @namespace    http://tampermonkey.net/
// @version      2026-01-21
// @description  try to take over the world!
// @author       You
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('scroll', function() {
        let menus = Array.from(document.querySelectorAll('article')).map(a => a.querySelector('svg[aria-label="More Options"]'));
        for(let menu of menus) {
            let art = menu.closest('article');
            if(!art.getAttribute('data-index')) {
                let wrapper = document.createElement('div');
                wrapper.style.position = 'absolute';
                wrapper.style.right = '3em';
                wrapper.style.zIndex = '9';
                wrapper.style.display = 'flex';
                wrapper.style.flexDirection = 'column';

                let solo = document.createElement('button');
                solo.style.all = 'unset';
                solo.style.cursor = 'pointer';
                solo.innerText = '👤';
                solo.oncontextmenu = function() {
                    event.preventDefault();
                    let art = event.target.closest('article');
                    let sections = art.querySelector('div:has(> :nth-child(3))');
                    let gallery = sections.children[1];
                    let idx = parseInt(art.getAttribute('data-index'));
                    let item = gallery.querySelectorAll('li[class]')[idx > 0 ? 1 : 0];
                    let image = item?.querySelector('img') || gallery?.querySelector('img');
                    if(window.innerWidth < 640 || !image.src.includes('_e35_tt6')) {
                        return alert('maximize window for largest file output!');
                    }
                    let source = image.src.slice(0, image.src.lastIndexOf('?'));
                    let user = art.querySelector(':has(img)').innerText;
                    let folder = mapper(user);
                    if(!folder) {
                        let result = prompt('mapping not found! enter mapping in format [handle]/[folder] or as [folder] for one-time add');
                        if(result) {
                            let sections = result.split('/');
                            if(sections.length == 2) {
                                list[sections[0]] = sections[1];
                                localStorage.setItem('insta-monkey-action-mapper', JSON.stringify(list));
                                user = sections[0];
                                folder = mapper(user);
                            }
                            else if (sections.length == 1) {
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
                    .replace('{link}', encodeURIComponent(image.src))
                    .replace('{filename}', encodeURIComponent(source.slice(source.lastIndexOf('/')+1)))
                    .replace('{user}', encodeURIComponent('SEIYUU/' + folder));
                    console.log(url);
                    window.location.href = url;
                };
                wrapper.appendChild(solo);
                art.insertBefore(wrapper, art.childNodes[0]);
            }

            menu.closest('article').setAttribute('data-index', 0);

            let prev = menu.closest('article').querySelector('button[aria-label="Previous"]');
            if(prev) {
                prev.onclick = function() {
                    let art = event.target.closest('article');
                    let idx = parseInt(art.getAttribute('data-index'));
                    art.setAttribute('data-index', idx <= 1 ? 0 : idx - 1);
                };
            }
            let next = menu.closest('article').querySelector('button[aria-label="Next"]');
            if(next) {
                next.onclick = function() {
                    let art = event.target.closest('article');
                    let idx = parseInt(art.getAttribute('data-index'));
                    let count = art.querySelectorAll('li[class]').length;
                    art.setAttribute('data-index', idx >= count - 1 ? count - 1 : idx + 1);
                };
            }
        }
        console.log('scrolling');
    });
})();

var mapper = function(data) {
    list = localStorage.getItem('insta-monkey-action-mapper') ? JSON.parse(localStorage.getItem('insta-monkey-action-mapper')) : list;
    console.log('insta-monkey-action-mapper', list);
    for(let key of Object.keys(list)) {
        if(data.includes(key)) {
            return list[key];
        }
    }
    return null;
};

var list = {};