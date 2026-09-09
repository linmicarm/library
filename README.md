# 📚 Library

A small library app for tracking books you've read and want to read. Add books through a modal form, mark them read or unread, and remove them — with everything saved to your browser so your shelf persists between visits.

**[🔗 Live demo](https://linmicarm.github.io/library/)**

![Screenshot of the library app](![alt text](image.png))

## Features

- Add books via a native `<dialog>` modal with form validation
- Mark books as read / unread
- Remove books from the shelf
- Persists across page reloads using `localStorage`
- Fully responsive card grid — no media queries needed
- Each book gets a unique, stable color spine

## What this project practices

This started as a [The Odin Project](https://www.theodinproject.com/) assignment and grew into a study of core front-end concepts:

- **Separation of data and display** — an array is the single source of truth; the DOM is rebuilt from it on every change, never edited piecemeal ("UI is a function of state")
- **Constructors and prototypes** — books are created with a `Book` constructor and share a `toggleRead` method via the prototype
- **Event delegation** — a single listener on the container handles all book actions, using event bubbling and `data-` attributes instead of one listener per button
- **Serialization and rehydration** — books are saved as JSON and rebuilt as real `Book` instances on load, so their prototype methods survive the round trip

## Built with

- Vanilla JavaScript (no frameworks)
- HTML & CSS (CSS Grid, custom properties)
- `localStorage` for persistence

## Running locally

Clone the repo and open `index.html` in your browser — no build step, no dependencies.

\`\`\`bash
git clone https://github.com/linmicarm/library.git
cd library
\`\`\`