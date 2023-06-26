const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'Bookshelf_Apps';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

generateId = () => +new Date();


function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function findBook(bookId) {
    for (const booksItem of books) {
        if (booksItem.id === bookId) {
            return booksItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = `Penulis : ${bookObject.author}`;

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun : ${bookObject.year}`;

    const tbutton = document.createElement('div');
    tbutton.classList.add('action')

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textTitle, textTimestamp, textYear, tbutton);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');

        undoButton.innerText = "Belum selesai dibaca"
        undoButton.addEventListener('click', () => undoTaskFromCompleted(bookObject.id));

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = "hapus"

        deleteButton.addEventListener('click', () => removeTaskFromCompleted(bookObject.id));
        tbutton.append(undoButton, deleteButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('green');
        checkButton.innerText = "Selesai Dibaca"

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = "hapus"

        deleteButton.addEventListener('click', () => removeTaskFromCompleted(bookObject.id));
        checkButton.addEventListener('click', () => addTaskToCompleted(bookObject.id))

        tbutton.append(checkButton, deleteButton);
    }
    return container;
}


const checkType = document.getElementById("inputBookIsComplete");
checkType.addEventListener("click", () =>
    checkType.checked ? document.getElementById("belum-dibaca").innerText = "Selesai Dibaca" : document.getElementById("belum-dibaca").innerText = "Belum Dibaca");

function searchBookTitle() {
    const searchBookTitle = document.getElementById('searchBookTitle').value.toLocaleLowerCase();
    const book_item = document.getElementsByClassName('book_item');
    for (i = 0; i < book_item.length; i++) {
        let bookTitle = book_item[i].getElementsByTagName('h3');
        if (bookTitle[0].innerHTML.toLocaleLowerCase().indexOf(searchBookTitle) > -1) {
            book_item[i].style.display = '';
        } else {
            book_item[i].style.display = 'none';
        }
    }
}

function addBook() {
    const textBook = document.getElementById('inputBookTitle').value;
    const timestamp = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();

    const bookObject = generateBookObject(generatedID, textBook, timestamp, bookYear, isCompleted);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addTaskToCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeTaskFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }

    const searchBook = document.getElementById('searchBook');
    searchBook.addEventListener('submit', function (e) {
        e.preventDefault();
        searchBookTitle();
    })
});

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
    uncompletedBOOKList.innerHTML = '';
    const completedBOOKList = document.getElementById('completeBookshelfList');
    completedBOOKList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedBOOKList.append(bookElement);
        } else
            completedBOOKList.append(bookElement);
    }
});



