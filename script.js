document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");
    const addNoteBtn = document.getElementById("addNote");
    const notesContainer = document.getElementById("notesContainer");
    const body = document.body;
    // Initialize theme
    const savedTheme = localStorage.getItem("theme") || "light";
    body.setAttribute("data-theme", savedTheme);
    themeToggle.addEventListener("click", () => {
        const currentTheme = body.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";
        body.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });
    // Load notes from localStorage
    const loadNotes = () => {
        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        notes.forEach(note => createNoteElement(note.id, note.content));
    };
    const saveNotes = () => {
        const notes = Array.from(notesContainer.children).map(note => ({
            id: note.dataset.id,
            content: note.querySelector("textarea").value
        }));
        localStorage.setItem("notes", JSON.stringify(notes));
    };
    const createNoteElement = (id, content = "") => {
        const note = document.createElement("div");
        note.className = "note";
        note.dataset.id = id;
        const textarea = document.createElement("textarea");
        textarea.value = content;
        textarea.addEventListener("input", saveNotes);
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerText = "✖";
        deleteBtn.addEventListener("click", () => {
            if (confirm("Delete this note?")) {
                note.remove();
                saveNotes();
            }
        });
        const moveLeftBtn = document.createElement("button");
        moveLeftBtn.className = "move-btn";
        moveLeftBtn.innerText = "⬅";
        moveLeftBtn.addEventListener("click", () => moveNoteLeft(note));
        const moveRightBtn = document.createElement("button");
        moveRightBtn.className = "move-btn";
        moveRightBtn.innerText = "➡";
        moveRightBtn.addEventListener("click", () => moveNoteRight(note));
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "button-container";
        buttonContainer.appendChild(moveLeftBtn);
        buttonContainer.appendChild(moveRightBtn);
        note.appendChild(textarea);
        note.appendChild(deleteBtn);
        note.appendChild(buttonContainer);
        notesContainer.appendChild(note);
    };
    const moveNoteLeft = (note) => {
        const previousNote = note.previousElementSibling;
        if (previousNote) {
            notesContainer.insertBefore(note, previousNote);
            saveNotes();
        }
    };
    const moveNoteRight = (note) => {
        const nextNote = note.nextElementSibling;
        if (nextNote) {
            notesContainer.insertBefore(nextNote, note);
            saveNotes();
        }
    };
    addNoteBtn.addEventListener("click", () => {
        const id = Date.now().toString();
        createNoteElement(id);
        saveNotes();
    });
    loadNotes();
});