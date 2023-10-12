const booksArray = [];

const addDialog = document.querySelector('dialog');
const booksGrid = document.querySelector('.books-grid');

/*dialog inputs*/
const nameInput = document.querySelector('#book-name');
const descInput = document.querySelector('#book-desc');
const maxPagesInput = document.querySelector('#max-pages');
const curPagesInput = document.querySelector('#current-page');
const readInput = document.querySelector('#read-status');
const addButton = document.querySelector('.submit-dialog-btn');

let visibilityType = 0;

class Book {
    constructor(title, description, currentPage, maxPages, readStatus) {
        this.title = title;
        this.description = description;
        this.currentPage = currentPage;
        this.maxPages = maxPages;
        this.readStatus = readStatus;
    }

    set maxPages(value) {
        console.log(this.currentPage, value);
        if (this.currentPage > value || value < 1)
            return;

        this._maxPages = value;
    }

    get maxPages() {
        return this._maxPages;
    }

    set currentPage(value) {
        if (value < 0)
            return;

        this._currentPage = value;
    }

    get currentPage() {
        return this._currentPage;
    }
}

function addBook() {
    const bookName = nameInput.value;
    const bookDesc = descInput.value;
    const maxPages = Number(maxPagesInput.value);
    const curPage = Number(curPagesInput.value);
    const read = readInput.checked;

    const newBook = new Book(bookName, bookDesc, curPage, maxPages, read);
    booksArray.push(newBook);
}

function checkValidation() {

    function checkInputs() {

        if (nameInput.value.length < 1)
            return false;

        if (descInput.value.length < 1)
            return false;

        if (Number(maxPagesInput.value) < 1)
            return false;

        if (Number(curPagesInput.value) < 0)
            return false;

        if (Number(maxPagesInput.value) < Number(curPagesInput.value))
            return false;

        return true;
    }

    if (checkInputs()) {
        addButton.disabled = false;
    } else {
        addButton.disabled = true;
    }
}

//0 - all, 1 - only completed, 2 - uncompleted
function drawBooks() {

    booksGrid.innerHTML = '';

    for (let i = 0; i < booksArray.length; i++) {

        if (visibilityType === 1) {
            if (!booksArray[i].readStatus)
                continue;
        } else if (visibilityType === 2) {
            if (booksArray[i].readStatus)
                continue;
        }

        const newCardHtml = `
        <div class="book-card" data-book-id='${i}'>
            <div class="card-line ${booksArray[i].readStatus ? 'read' : 'not-read'}"></div>
            <div class="card-content">
            <p class="book-title">${booksArray[i].title}</p>
            
            <p class="book-description">
                ${booksArray[i].description}
            </p>
            <p class="pages-text">
                <span class="read-pages">${booksArray[i].currentPage}</span>
                of <span class="max-pages">${booksArray[i].maxPages}</span></span> pages
            </p>
            <p class="read-text">${booksArray[i].readStatus ? 'read' : 'not read'}</p>
            <div class="button-row">
                <button class="add-button" ${booksArray[i].currentPage === booksArray[i].maxPages ? 'disabled' : ''}>+</button>
                <button class="remove-button" ${booksArray[i].currentPage > 0 ? '' : 'disabled'}>-</button>
                <button class="mark-button">Mark read</button>
            </div>
            </div>
            <button class="delete-book-button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>close</title><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg></button>
        </div>`;

        booksGrid.innerHTML += newCardHtml;
    }

    document.querySelectorAll('.delete-book-button').forEach((element, index) => {
        element.addEventListener('click', (event) => {
            booksArray.splice(index, 1);
            document.querySelector(`.book-card[data-book-id="${index}"]`).remove();
        });
    });

    document.querySelectorAll('.add-button').forEach((element, index) => {
        element.addEventListener('click', (event) => {
            if (booksArray[index].currentPage < booksArray[index].maxPages) {
                booksArray[index].currentPage++;
                document.querySelector(`.book-card[data-book-id="${index}"] .read-pages`).textContent = String(booksArray[index].currentPage);

                element.disabled = booksArray[index].currentPage === booksArray[index].maxPages;
                document.querySelector(`.book-card[data-book-id="${index}"] .remove-button`).disabled = booksArray[index].currentPage === 0;
            }
        });
    });

    document.querySelectorAll('.remove-button').forEach((element, index) => {
        element.addEventListener('click', (event) => {
            if (booksArray[index].currentPage > 0) {
                booksArray[index].currentPage--;
                document.querySelector(`.book-card[data-book-id="${index}"] .read-pages`).textContent = String(booksArray[index].currentPage);

                element.disabled = booksArray[index].currentPage === 0;
                document.querySelector(`.book-card[data-book-id="${index}"] .add-button`).disabled = booksArray[index].currentPage === booksArray[index].maxPages;
            }
        });
    });

    document.querySelectorAll('.mark-button').forEach((element, index) => {
        element.addEventListener('click', (event) => {
            booksArray[index].readStatus = !booksArray[index].readStatus;

            const cardLine = document.querySelector(`.book-card[data-book-id="${index}"] .card-line`);

            if (booksArray[index].readStatus) {
                cardLine.classList.remove('not-read');
                cardLine.classList.add('read');
            } else {
                cardLine.classList.add('not-read');
                cardLine.classList.remove('read');
            }

            document.querySelector(`.book-card[data-book-id="${index}"] .read-text`).textContent = booksArray[index].readStatus ? 'read' : 'not read';
        });
    });
}

document.querySelector('.add-book').addEventListener('click', (event) => {
    addDialog.showModal();
});

document.querySelector('.cancel-dialog-btn').addEventListener('click', (event) => {
    addDialog.close();
});

addDialog.addEventListener('submit', (event) => {
    event.preventDefault();

    addBook();

    nameInput.value = '';
    descInput.value = '';
    maxPagesInput.value = '0';
    curPagesInput.value = '0';
    readInput.checked = false;

    addDialog.close();

    drawBooks();
});

document.querySelector('.visibility-button').addEventListener('click', () => {
    if (visibilityType === 2)
        visibilityType = 0;
    else
        visibilityType++;

    const visibilityText = document.querySelector('.visible-state-text');
    visibilityText.textContent = visibilityType === 0 ? 'All Visible' : visibilityType === 1 ? 'Only Completed' : 'Only not Completed';

    drawBooks();
});

nameInput.addEventListener('input', checkValidation);
descInput.addEventListener('input', checkValidation);
maxPagesInput.addEventListener('input', checkValidation);
curPagesInput.addEventListener('input', checkValidation);
