export class SongList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentSongs = []; 
    }

    connectedCallback() {
        this.render();
        this.init();
    }

    render() {
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="./css/components/SongList.css">

        <div class="song-list-container">
            <div class="header">
                <h2>My Songs</h2>
                <div class="actions">
                    <button id="theme-toggle-btn" title="Toggle Light/Dark Mode">🌙</button>
                    <button id="add-btn" title="Add local file">➕</button>
                    <button id="delete-mode-btn" title="Delete Song">🗑️</button>
                </div>
            </div>

            <div class="search-bar">
                <input type="text" id="search-input" placeholder="Search song... 🔎">
            </div>

            <div id="delete-all-container" style="display: none; text-align: right; margin-bottom: 10px;">
                <button id="delete-all-btn" style="color: red; cursor: pointer; background: none; border: 1px solid red; padding: 5px 10px; border-radius: 5px;">🗑️ Delete All</button>
            </div>

            <input type="file" id="file-input" accept="audio/mp3, audio/m4a, audio/flac, audio/wav, audio/ogg" multiple hidden>

            <div id="list-container"></div>

            <dialog id="edit-metadata-modal" style="border-radius: 8px; border: 1px solid #ccc; padding: 20px; width: 320px; background: white; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
                    <h3 style="margin-top: 0; text-align: center;">Edit Metadata</h3>
                    
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <input type="text" id="edit-title" placeholder="Song Title" style="padding: 8px; border: 1px solid #aaa; border-radius: 4px; width: 100%; box-sizing: border-box;">
                        <input type="text" id="edit-artist" placeholder="Artist" style="padding: 8px; border: 1px solid #aaa; border-radius: 4px; width: 100%; box-sizing: border-box;">
                        <input type="text" id="edit-genre" placeholder="Genre" style="padding: 8px; border: 1px solid #aaa; border-radius: 4px; width: 100%; box-sizing: border-box;">
                        
                        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px;">
                            <button id="cancel-edit-btn" style="cursor: pointer; padding: 6px 15px; border-radius: 4px; border: 1px solid #ccc; background: #f0f0f0;">Cancel</button>
                            <button id="save-metadata-btn" style="cursor: pointer; background: #222; color: white; border: none; padding: 6px 15px; border-radius: 4px; font-weight: bold;">Save</button>
                        </div>
                    </div>
                </dialog>
            </div>
        `;
    }

    init() {
        const addBtn = this.shadowRoot.getElementById('add-btn');
        const fileInput = this.shadowRoot.getElementById('file-input');
        const searchInput = this.shadowRoot.getElementById('search-input');
        const deleteAllContainer = this.shadowRoot.getElementById('delete-all-container');
        const deleteAllBtn = this.shadowRoot.getElementById('delete-all-btn');

        this.deleteModeBtn = this.shadowRoot.getElementById('delete-mode-btn');
        this.isDeleteMode = false;

        const themeToggleBtn = this.shadowRoot.getElementById('theme-toggle-btn');
        themeToggleBtn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('request-theme-toggle', {
                bubbles: true,
                composed: true
            }));
            
            // Toggle icon locally for immediate feedback
            const currentIcon = themeToggleBtn.textContent;
            themeToggleBtn.textContent = currentIcon === '🌙' ? '☀️' : '🌙';
        });

        this.deleteModeBtn.addEventListener('click', () => {
            this.isDeleteMode = !this.isDeleteMode;
            this.deleteModeBtn.style.color = this.isDeleteMode ? 'red' : 'black';

            deleteAllContainer.style.display = this.isDeleteMode ? 'block' : 'none';
            
            // Render songs again to update the delete buttons visibility
            const searchTerm = searchInput.value.toLowerCase();
            const filteredSongs = this.currentSongs.filter(song => {
                const titleMatch = song.title && song.title.toLowerCase().includes(searchTerm);
                const artistMatch = song.artist && song.artist.toLowerCase().includes(searchTerm);
                const genreMatch = song.genre && song.genre.toLowerCase().includes(searchTerm);
                return titleMatch || artistMatch || genreMatch;
            });
            this.renderSongs(filteredSongs);
        });

        // Cascade deletion
        deleteAllBtn.addEventListener('click', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredSongs = this.currentSongs.filter(song => {
                const titleMatch = song.title && song.title.toLowerCase().includes(searchTerm);
                const artistMatch = song.artist && song.artist.toLowerCase().includes(searchTerm);
                const genreMatch = song.genre && song.genre.toLowerCase().includes(searchTerm);
                return titleMatch || artistMatch || genreMatch;
            });

            if (filteredSongs.length === 0) return;

            if (confirm(`Are you sure you want to delete all ${filteredSongs.length} songs in this list? This action cannot be undone.`)) {
                filteredSongs.forEach(song => {
                    this.dispatchEvent(new CustomEvent('request-remove-song', {
                        detail: { songId: song.id },
                        bubbles: true,
                        composed: true
                    }));
                });
            }
        });
    
        addBtn.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (event) => this.handleFiles(event));

        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredSongs = this.currentSongs.filter(song => {
                const titleMatch = song.title && song.title.toLowerCase().includes(searchTerm);
                const artistMatch = song.artist && song.artist.toLowerCase().includes(searchTerm);
                const genreMatch = song.genre && song.genre.toLowerCase().includes(searchTerm);
                return titleMatch || artistMatch || genreMatch;
            });
            this.renderSongs(filteredSongs);
        });
    }

    handleFiles(event) {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        //Composed: true allows the event to bypass the shadow DOM and be listened to by other components
        const addSongEvent = new CustomEvent('request-add-song', {
            detail: { files },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(addSongEvent);

        event.target.value = ''; // Reset the file input for future uploads
    }

    updateList(songs) {
        this.currentSongs = songs;
        this.shadowRoot.getElementById('search-input').value = ''; // Clear search input
        this.renderSongs(songs);
    }

    renderSongs(songsToRender) {
        const container = this.shadowRoot.getElementById('list-container');
        const editModal = this.shadowRoot.getElementById('edit-metadata-modal');
        const editTitleInput = this.shadowRoot.getElementById('edit-title');
        const editArtistInput = this.shadowRoot.getElementById('edit-artist');
        const editGenreInput = this.shadowRoot.getElementById('edit-genre');
        const cancelEditBtn = this.shadowRoot.getElementById('cancel-edit-btn');
        const saveMetadataBtn = this.shadowRoot.getElementById('save-metadata-btn');

        container.innerHTML = ''; 

        if (songsToRender.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #888;">No songs available.</p>';
            return;
        } 

        let songToEdit = null;

        cancelEditBtn.onclick = () => editModal.close();
        saveMetadataBtn.onclick = () => {
            if (songToEdit) {
                songToEdit.title = editTitleInput.value.trim() || songToEdit.title;
                songToEdit.artist = editArtistInput.value.trim();
                songToEdit.genre = editGenreInput.value.trim();

                this.dispatchEvent(new CustomEvent('request-update-song', {
                    detail: { song: songToEdit },
                    bubbles: true, composed: true
                }));
                editModal.close();
            }
        };

        songsToRender.forEach(song => {
            if (!song || !song.file || !song.title) return;

            const item = document.createElement('div');
            item.className = 'song-item';
            if (this.activeSongId === song.id) {
                item.classList.add('active');
            }
            item.dataset.id = song.id;
            item.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                border-bottom: 1px solid #ccc;
                cursor: pointer;
                transition: background-color 0.2s;
            `;

            const nameSpan = document.createElement('div');
            nameSpan.className = 'song-name';
            
            const genreText = song.genre || 'Unknown genre';
            const artistText = song.artist || 'Unknown Artist';
            nameSpan.innerHTML = `<div class="song-title" style="font-weight: 500;">${song.title}</div><div class="song-meta" style="font-size: 13px; color: #aaa; margin-top: 4px; font-weight: 400;">${artistText} • ${genreText}</div>`;
            
            nameSpan.style.flexGrow = '1';
            nameSpan.style.cursor = 'pointer';
            nameSpan.style.overflow = 'hidden';

            const btnContainer = document.createElement('div');
            btnContainer.style.display = 'flex';
            btnContainer.style.gap = '5px';

            const editBtn = document.createElement('button');
            editBtn.textContent = '🛠️';
            editBtn.className = 'delete-item-btn';
            editBtn.title = 'Editar metadatos';
            
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                songToEdit = song;
                editTitleInput.value = song.title || '';
                editArtistInput.value = song.artist || '';
                editGenreInput.value = song.genre || '';
                editModal.showModal();
            });
            btnContainer.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑️';
            deleteBtn.className = 'delete-item-btn';
            deleteBtn.style.display = this.isDeleteMode ? 'block' : 'none';

            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`Are you sure you want to remove "${song.title}" from this list?`)) {
                    this.dispatchEvent(new CustomEvent('request-remove-song', {
                        detail: { songId: song.id },
                        bubbles: true,
                        composed: true
                    }));
                }
            });
            btnContainer.appendChild(deleteBtn);

            item.appendChild(nameSpan);
            item.appendChild(btnContainer);

            nameSpan.addEventListener('click', () => {
                if (!this.isDeleteMode) {
                    this.dispatchEvent(new CustomEvent('request-play', {
                    detail: { song: song },
                    bubbles: true,
                    composed: true
                    }));
                } 
            });

            container.appendChild(item);
        });
    }

    setActiveSong(id) {
        this.activeSongId = id;
        const items = this.shadowRoot.querySelectorAll('.song-item');
        items.forEach(item => {
            if (item.dataset.id == id) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }   

    disconnectedCallback() {
        // Clean up any event listeners if necessary
    }
}