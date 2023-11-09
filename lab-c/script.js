document.addEventListener("DOMContentLoaded", function () {
    let map = L.map('map').setView([53.430127, 14.564802], 18);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(map);

    let puzzlePieces = [];
    let isDropAreaOccupied = {};

    for (let i = 1; i <= 16; i++) {
        isDropAreaOccupied[i] = false;
    }

    let puzzlePiecesBottom = document.querySelectorAll('.map-puzzle-piece');
    let targets = document.querySelectorAll(".drag-target");

    let puzzleDropAreas = document.querySelectorAll('.puzzle-drop-area');

    function addDragDropHandlers() {
        let puzzlePiecesBottom = document.querySelectorAll('.map-puzzle-piece');
        let dropAreas = document.querySelectorAll(".puzzle-drop-area");

        for (let puzzlePiece of puzzlePiecesBottom) {
            puzzlePiece.addEventListener("dragstart", function (event) {
                this.style.border = "5px dashed #D8D8FF";
                event.dataTransfer.setData("text", this.id);
            });

            puzzlePiece.addEventListener("dragend", function (event) {
                this.style.borderWidth = "0";
            });
        }

        dropAreas.forEach(function (dropArea) {
            dropArea.addEventListener("dragenter", function (event) {
                this.style.border = "2px solid #7FE9D9";
            });

            dropArea.addEventListener("dragleave", function (event) {
                this.style.border = "2px dashed #7f7fe9";
            });

            dropArea.addEventListener("dragover", function (event) {
                event.preventDefault();
                this.style.border = "2px solid #7FE9D9";
            });

            dropArea.addEventListener("drop", function (event) {
                event.preventDefault();

                if (!isDropAreaOccupied[event.currentTarget.dataset.index]) {
                    if (event.dataTransfer && event.dataTransfer.getData) {
                        let puzzlePieceId = event.dataTransfer.getData('text');
                        let originalPieceId = event.dataTransfer.getData('original-id');

                        let myElement = document.getElementById(puzzlePieceId);

                        if (myElement) {
                            let originalPiece = document.getElementById(originalPieceId);
                            let currentIndex = parseInt(event.currentTarget.dataset.index);

                            if (!isDropAreaOccupied[currentIndex]) {
                                this.appendChild(originalPiece);
                                this.style.border = "2px dashed #7f7fe9";
                                isDropAreaOccupied[currentIndex] = true;

                                myElement.setAttribute('data-original-id', this.id);
                                originalPiece.setAttribute('data-original-id', originalPieceId);

                                if (myElement.parentElement.classList.contains('puzzle-drop-area')) {
                                    let previousDropAreaIndex = parseInt(myElement.parentElement.dataset.index);
                                    isDropAreaOccupied[previousDropAreaIndex] = false;
                                }
                            } else {
                                let targetElement = document.getElementById(this.id).querySelector('.map-puzzle-piece');

                                if (targetElement) {
                                    this.removeChild(targetElement);
                                    this.appendChild(originalPiece);

                                    myElement.setAttribute('data-original-id', this.id);
                                    originalPiece.setAttribute('data-original-id', originalPieceId);

                                    let targetDropAreaIndex = parseInt(targetElement.parentElement.dataset.index);
                                    isDropAreaOccupied[targetDropAreaIndex] = false;
                                    isDropAreaOccupied[currentIndex] = true;
                                }
                            }

                            // Po upuszczeniu puzzla, sprawdź poprawność ułożenia
                            displayCompletionMessage();
                        } else {
                            console.error("Nie znaleziono elementu o id", puzzlePieceId);
                        }
                    } else {
                        console.error("Brak danych 'text' w zdarzeniu.");
                    }
                }
            }, false);
        });
    }

    addDragDropHandlers();

    function createPuzzlePieces(image) {
        const pieces = [];
        const pieceWidth = image.width / 4;
        const pieceHeight = image.height / 4;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const canvas = document.createElement('canvas');
                canvas.width = pieceWidth;
                canvas.height = pieceHeight;
                const context = canvas.getContext('2d');
                context.drawImage(
                    image,
                    j * pieceWidth,
                    i * pieceHeight,
                    pieceWidth,
                    pieceHeight,
                    0,
                    0,
                    pieceWidth,
                    pieceHeight
                );

                const puzzleNumber = i * 4 + j + 1; // Numeracja od 1 do 16
                canvas.setAttribute('data-number', puzzleNumber);

                pieces.push(canvas);
            }
        }

        return pieces;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function renderPuzzlePieces(pieces, containerId, pieceClass) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        pieces.forEach((piece, index) => {
            const puzzlePiece = document.createElement('div');
            puzzlePiece.className = pieceClass;
            puzzlePiece.draggable = true;
            puzzlePiece.id = `puzzle-${index + 1}`;
            puzzlePiece.style.backgroundImage = `url(${piece.toDataURL()})`;

            const row = Math.floor(index / 4);
            const col = index % 4;
            puzzlePiece.style.left = `${col * 25}%`;
            puzzlePiece.style.top = `${row * 33.33}%`;

            const canvas = piece; // Pobierz canvas zamiast diva
            puzzlePiece.setAttribute('data-original-id', puzzlePiece.id);
            puzzlePiece.setAttribute('data-number', canvas.getAttribute('data-number'));

            container.appendChild(puzzlePiece);

            puzzlePiece.addEventListener("dragstart", function (event) {
                this.style.border = "5px dashed #D8D8FF";
                event.dataTransfer.setData("text", this.id);
                event.dataTransfer.setData("original-id", this.getAttribute('data-original-id'));
            });

            puzzlePiece.addEventListener("dragend", function (event) {
                this.style.borderWidth = "0";
            });
        });
    }

    document.getElementById("myLocationButton").addEventListener("click", function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;

                map.setView([lat, lon]);
            }, function (error) {
                console.error("Błąd pobierania lokalizacji:", error);
            });
        } else {
            console.error("Twoja przeglądarka nie obsługuje geolokalizacji.");
        }
    });
    document.getElementById("saveButton").addEventListener("click", function () {
        leafletImage(map, function (err, canvas) {
            let rasterMap = document.createElement('canvas');
            rasterMap.width = canvas.width;
            rasterMap.height = canvas.height;
            let rasterContext = rasterMap.getContext("2d");

            rasterContext.drawImage(canvas, 0, 0);

            // Utwórz puzzle
            puzzlePieces = createPuzzlePieces(rasterMap);
            shuffleArray(puzzlePieces);
            renderPuzzlePieces(puzzlePieces, "map-puzzle-container", "map-puzzle-piece");

            // Skopiuj obraz z canvasa dla puzzli do canvasa dla pełnej mapy
            let fullMapCanvas = document.getElementById("fullMapCanvas");
            fullMapCanvas.width = canvas.width;
            fullMapCanvas.height = canvas.height;
            let fullMapContext = fullMapCanvas.getContext("2d");
            fullMapContext.drawImage(canvas, 0, 0);
        });
    });

    let dropAreas = document.querySelectorAll(".puzzle-drop-area");

    dropAreas.forEach(function (dropArea) {
        dropArea.addEventListener("dragenter", function (event) {
            this.style.border = "2px solid #7FE9D9";
        });

        dropArea.addEventListener("dragleave", function (event) {
            this.style.border = "2px dashed #7f7fe9";
        });

        dropArea.addEventListener("dragover", function (event) {
            event.preventDefault();
            this.style.border = "2px solid #7FE9D9";
        });
    });

    // Funkcja sprawdzająca, czy puzle są poukładane w odpowiedniej kolejności
    function checkPuzzleOrder() {
        let correctlyPlaced = true;
        for (let i = 1; i <= 16; i++) {
            const puzzlePiece = document.querySelector(`.map-puzzle-piece[data-number="${i}"]`);
            const dropAreaIndex = parseInt(puzzlePiece.parentElement.dataset.index);
            if (dropAreaIndex !== i) {
                correctlyPlaced = false;
                break;
            }
        }
        return correctlyPlaced;
    }

    // Funkcja wyświetlająca komunikat
    function displayCompletionMessage() {
        if (checkPuzzleOrder()) {
            console.log("Udało się ułożyć puzle!!!")
            // Sprawdź, czy użytkownik zezwolił na pokazywanie notyfikacji
            if (Notification.permission === "granted") {
                // Wyświetl notyfikację
                new Notification("Udało się ułożyć puzle!!!");
            } else if (Notification.permission !== "denied") {
                // Poproś użytkownika o zezwolenie
                Notification.requestPermission().then(function (permission) {
                    if (permission === "granted") {
                        // Wyświetl notyfikację
                        new Notification("Udało się ułożyć puzle!!!");
                    }
                });
            }
        }
    }

});
