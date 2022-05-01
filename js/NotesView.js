export default class NotesView {
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;
        this.root.innerHTML = `
            <div class="sidebar">
                <button class="add" type="button">Add Note</button>
                <div class="list"></div>
            </div>
            <div class="note-preview">
                <input class="ttitle" type="text" placeholder="Enter a title"> 
                <textarea class="bbody">I am the god of programming</textarea>
            </div>
            
        `;

        const btnAddNote = this.root.querySelector(".add");
        const inpTitle = this.root.querySelector(".ttitle");
        const inpBody = this.root.querySelector(".bbody");

        btnAddNote.addEventListener("click", () => {
            this.onNoteAdd();
        });

        [inpTitle, inpBody].forEach(inputField => {
            inputField.addEventListener("blur", () => {
                const updatedTitle = inpTitle.value.trim();
                const updatedBody = inpBody.value.trim();

                this.onNoteEdit(updatedTitle, updatedBody);
            });
        }); 

        this.updateNotePreviewVisibility(false);
    }

    _createListItemHTML(id, title, body, updated) {
        const MAX_BODY_LENGTH = 60;

        return `
            <div class="list-item" data-note-id="${id}">
                <div class="small-title">${title}</div>
                <div class="small-body">
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? "..." : "..."}
                </div>
                <div class="small-updated">
                ${updated.toLocaleString('en-US', {dateStyle: 'long' , timeStyle: 'short'})}
                </div>
            </div>
        `;
    }

    updateNoteList(notes){
        const notesListContainer = this.root.querySelector(".list");

        // Lista vazia
        notesListContainer.innerHTML = "";
        
        for (const note of notes) {
            const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));
            
            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        // Adicionar select/delete events para cada nota da lista (.list-item)

        notesListContainer.querySelectorAll(".list-item").forEach(noteListItem => {
                noteListItem.addEventListener("click", () => {
                    this.onNoteSelect(noteListItem.dataset.noteId);
                });

                noteListItem.addEventListener("dblclick", () => {
                    const doDelete = confirm("Are you sure you want to delete this note?");

                    if(doDelete) {
                        this.onNoteDelete(noteListItem.dataset.noteId);
                    }
                });
        });
    }

    updateActiveNote(note) {
        this.root.querySelector(".ttitle").value = note.title;
        this.root.querySelector(".bbody").value = note.body;

        this.root.querySelectorAll(".list-item").forEach(noteListItem => {
            noteListItem.classList.remove("item-selected");
        });

        this.root.querySelector(`.list-item[data-note-id="${note.id}"]`).classList.add("item-selected");
    }

    updateNotePreviewVisibility(visible) {
        this.root.querySelector(".note-preview").style.visibility = visible ? "visible" : "hidden";
    }
}