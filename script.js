const myLibrary = [];

function Book(author, title, pages, isRead = false) {
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

function addBookToLibrary(author, title, pages, isRead) {
  const newBook = new Book(author, title, pages, isRead);
  myLibrary.push(newBook);
}

const libraryContainer = document.querySelector("#library");

function render() {
  libraryContainer.textContent = "";

  myLibrary.forEach((book) => {
    const card = document.createElement("div");
    card.textContent = `${book.title} by ${book.author}, ${book.pages} pages — ${book.isRead ? "Read" : "Not read yet"}`;
    libraryContainer.append(card);
  });
}

addBookToLibrary("Tolkien", "The Hobbit", 310, true);
addBookToLibrary("Andy Weir", "Project Hail Mary", 496, false);

render();