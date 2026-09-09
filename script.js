// The array is our single source of truth. Every book lives here.
// The DOM is just a view of this array — when this changes, we re-render.
const myLibrary = [];

// Constructor for a single book. Call with `new Book(...)`.
// Capitalized name signals "use with new" (forgetting `new` fails silently).
function Book(author, title, pages, isRead = false) {
  // Generated inside the constructor so uniqueness is guaranteed in one place,
  // never fumbled by the caller. Used later to find/delete specific books.
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead; // boolean; defaults to false (a new book is unread)
}

// A method shared by ALL Book instances via the prototype (stored once, not
// copied onto every book). This is what ES6 `class` methods compile down to.
// `this` refers to whichever book the method is called on.
Book.prototype.toggleRead = function () {
  this.isRead = !this.isRead; // flip the boolean: true→false, false→true
};

// Separate from the constructor on purpose: the constructor only *builds* a book,
// this function builds one AND stores it. Keeps responsibilities separated.
function addBookToLibrary(author, title, pages, isRead) {
  const newBook = new Book(author, title, pages, isRead);
  myLibrary.push(newBook);
}

// Grab the container once, up front, so render() can reuse it.
const libraryContainer = document.querySelector("#library");

// Wipes the screen and rebuilds every card from the array.
// "UI is a function of state": call this after ANY change to myLibrary.
function render() {
  // Clear first, then rebuild — otherwise re-rendering stacks duplicate cards.
  libraryContainer.textContent = "";

  myLibrary.forEach((book) => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.dataset.id = book.id;

    // A colored spine accent down the left edge. We derive a hue from the
    // book's id so each book gets its own consistent color, like real spines.
    const spine = document.createElement("div");
    spine.className = "book-spine";
    // Turn the first chunk of the id into a number, then into a hue (0–359).
    const hue = parseInt(book.id.slice(0, 8), 16) % 360;
    spine.style.setProperty("--spine-hue", hue);

    // Title — the prominent line.
    const title = document.createElement("h3");
    title.className = "book-title";
    title.textContent = book.title;

    // Author — quieter, secondary.
    const author = document.createElement("p");
    author.className = "book-author";
    author.textContent = book.author;

    // Meta row: page count + the read-status pill.
    const meta = document.createElement("div");
    meta.className = "book-meta";

    const pages = document.createElement("span");
    pages.className = "book-pages";
    pages.textContent = `${book.pages} pages`;

    const status = document.createElement("span");
    // Two classes: a base "pill" plus a state class we style differently.
    status.className = `status-pill ${book.isRead ? "is-read" : "is-unread"}`;
    status.textContent = book.isRead ? "Read" : "Unread";

    meta.append(pages, status);

    // Action buttons.
    const actions = document.createElement("div");
    actions.className = "book-actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "btn-toggle";
    toggleBtn.textContent = "Toggle read";
    toggleBtn.dataset.action = "toggle";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.dataset.action = "delete";

    actions.append(toggleBtn, deleteBtn);

    // Assemble the card in order.
    card.append(spine, title, author, meta, actions);
    libraryContainer.append(card);
  });
}

// EVENT DELEGATION: one listener on the container handles every book button.
// Clicks bubble up from a button to this container, so we attach here once and
// inspect each click — instead of adding a listener to every button on every
// render. Bonus: this works even though the buttons don't exist yet when this
// listener is attached, because the listener lives on the container, not the buttons.
libraryContainer.addEventListener("click", (event) => {
  // event.target = the exact element clicked (e.g. a specific button).
  // Read its data-action; if there isn't one, the click was on empty space or
  // the text — a guard clause bails early so we don't error below.
  const action = event.target.dataset.action;
  if (!action) return;

  // Climb from the clicked button up to its card, then read the book's id.
  // .closest() walks up the ancestors to the nearest element matching [data-id].
  const card = event.target.closest("[data-id]");
  const id = card.dataset.id;
  const book = myLibrary.find((b) => b.id === id);

  if (action === "delete") {
    // Locate the book's position, then remove 1 item there (mutates in place).
    const index = myLibrary.findIndex((b) => b.id === id);
    myLibrary.splice(index, 1);
  } else if (action === "toggle") {
    book.toggleRead(); // prototype method flips isRead on this specific book
  }

  render(); // change the data first, then re-render once so the view matches
});

// Grab the dialog-related elements once, up front, so handlers can reuse them.
const newBookBtn = document.querySelector("#new-book-btn");
const bookDialog = document.querySelector("#book-dialog");
const bookForm = document.querySelector("#book-form");
const cancelBtn = document.querySelector("#cancel-btn");

// Open the dialog when "New Book" is clicked.
// showModal() (not show()) dims the background and traps focus for accessibility.
newBookBtn.addEventListener("click", () => {
  bookDialog.showModal();
});

// Close the dialog when "Cancel" is clicked, without adding a book.
cancelBtn.addEventListener("click", () => {
  bookDialog.close();
});

// Runs when the form is submitted (Add Book clicked, or Enter pressed).
// Listening for "submit" on the FORM (not click on the button) also catches
// the user pressing Enter inside a field.
bookForm.addEventListener("submit", (event) => {
  // Stop the browser's default submit-and-reload, which would wipe myLibrary.
  event.preventDefault();

  // Read the values the user typed. .value is always a STRING.
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  // Pages comes in as a string ("310"), so convert to a real number.
  const pages = Number(document.querySelector("#pages").value);
  // A checkbox has no meaningful .value — we read .checked, which is a boolean.
  const isRead = document.querySelector("#isRead").checked;

  // Update the data (source of truth)...
  addBookToLibrary(author, title, pages, isRead);
  // ...then update the view.
  render();

  // Clear the fields so the form is fresh next time, and close the dialog.
  bookForm.reset();
  bookDialog.close();
});

// Initial render — runs on an empty library, so it just clears the container.
// Safe to call before any books exist.
render();