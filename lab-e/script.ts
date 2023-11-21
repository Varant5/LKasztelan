document.addEventListener('DOMContentLoaded', function () {
    const linkIds = ['css1', 'css2', 'css3', 'css4'];

    const links = linkIds.map(id => document.getElementById(id) as HTMLAnchorElement);

    generateVisibleLinks(); // Generowanie linków na początku

    links.forEach((link, index) => {
        link?.addEventListener('click', function (event) {
            event.preventDefault();
            changeStyles(`style${index + 1}.css`);
            showLinks(link);
            const visibleLinks = generateVisibleLinks();
            updateLinksContainer(visibleLinks);
        });
    });

    function changeStyles(styleSheet: string) {
        const linkElement = document.querySelector('link[rel="stylesheet"]');
        if (linkElement) {
            linkElement.setAttribute('href', `./styles/${styleSheet}`);
        }
    }

    function showLinks(activeLink: HTMLAnchorElement) {
        links.forEach(link => {
            if (link !== activeLink) {
                link.style.display = 'inline-block';
            } else {
                link.style.display = 'none';
            }
        });
    }

    function generateVisibleLinks() {
        const visibleLinks = links.map(link => `<a href="#" id="${link.id}">${link.innerText}</a>`)
            .join(' | ');

        return visibleLinks;
    }

    function updateLinksContainer(links: string) {
        const linksContainer = document.getElementById('links-container');
        if (linksContainer) {
            linksContainer.innerHTML = links;
        }
    }
});
