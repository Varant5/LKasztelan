/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


document.addEventListener('DOMContentLoaded', function () {
  var linkIds = ['css1', 'css2', 'css3', 'css4'];
  var links = linkIds.map(function (id) {
    return document.getElementById(id);
  });
  generateVisibleLinks(); // Generowanie linków na początku
  links.forEach(function (link, index) {
    link === null || link === void 0 ? void 0 : link.addEventListener('click', function (event) {
      event.preventDefault();
      changeStyles("style".concat(index + 1, ".css"));
      showLinks(link);
      var visibleLinks = generateVisibleLinks();
      updateLinksContainer(visibleLinks);
    });
  });
  function changeStyles(styleSheet) {
    var linkElement = document.querySelector('link[rel="stylesheet"]');
    if (linkElement) {
      linkElement.setAttribute('href', "./styles/".concat(styleSheet));
    }
  }
  function showLinks(activeLink) {
    links.forEach(function (link) {
      if (link !== activeLink) {
        link.style.display = 'inline-block';
      } else {
        link.style.display = 'none';
      }
    });
  }
  function generateVisibleLinks() {
    var visibleLinks = links.map(function (link) {
      return "<a href=\"#\" id=\"".concat(link.id, "\">").concat(link.innerText, "</a>");
    }).join(' | ');
    return visibleLinks;
  }
  function updateLinksContainer(links) {
    var linksContainer = document.getElementById('links-container');
    if (linksContainer) {
      linksContainer.innerHTML = links;
    }
  }
});
/******/ })()
;