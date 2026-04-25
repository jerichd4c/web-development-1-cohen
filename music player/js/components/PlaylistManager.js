export class PlaylistManager extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.init();
        this.currentPLaylist = [];
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="./css/components/PlaylistManager.css">

            <div class="playlist-manager">
                <div class="header">
                    <h3>Playlist Manager</h3>
                    <div class="actions">
                        <button id="add-btn" title="New Playlist">➕</button>
                        <button id="delete-mode-btn" title="Delete Playlist">🗑️</button>
                    </div>
                </div>

                <div class="search-bar">
                    <input type="text" id="search-input" placeholder="Search playlist... 🔎">
                </div>
                
                <div id="delete-all-container" style="display: none; text-align: right; margin-bottom: 10px; padding-right: 24px;">
                    <button id="delete-all-btn" style="color: red; cursor: pointer; background: none; border: 1px solid red; padding: 5px 10px; border-radius: 5px;">🗑️ Delete All</button>
                </div>

                <div id="playlist-list" class="scrollable-list">
                    <!-- Playlists will be dynamically added here -->
                </div>

                <div id="new-playlist-dialog" class="dialog hidden">
                    <h4>New Playlist</h4>
                    <label>Name:</label>
                    <input type="text" id="playlist-name-input">
                    <div class="dialog-actions">
                        <button id="cancel-btn">Cancel</button>
                        <button id="accept-btn">Accept</button>
                    </div>
                </div>
            </div>
        `;
    }

    init() {
        this.addBtn = this.shadowRoot.getElementById('add-btn');
        this.dialog = this.shadowRoot.getElementById('new-playlist-dialog');
        this.cancelBtn = this.shadowRoot.getElementById('cancel-btn');
        this.acceptBtn = this.shadowRoot.getElementById('accept-btn');
        this.nameInput = this.shadowRoot.getElementById('playlist-name-input');
        this.deleteModeBtn = this.shadowRoot.getElementById('delete-mode-btn');

        const searchInput = this.shadowRoot.getElementById('search-input');
        const deleteAllContainer = this.shadowRoot.getElementById('delete-all-container');
        const deleteAllBtn = this.shadowRoot.getElementById('delete-all-btn');

        this.isDeleteMode = false;

        // Handle search filtering
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredPlaylists = this.currentPlaylists.filter(p => p.name.toLowerCase().includes(searchTerm));
            this.renderPlaylists(filteredPlaylists);
        });

        // Show new playlist dialog 
        this.addBtn.addEventListener('click', () => {
            this.dialog.classList.remove('hidden');
            this.nameInput.focus();
        });

        // Hide dialog on cancel
        
        this.cancelBtn.addEventListener('click', () => {
            this.dialog.classList.add('hidden');
            this.nameInput.value = '';
        });

        // Handle new playlist creation
        this.acceptBtn.addEventListener('click', () => this.createNewPlaylist());

        // Delete playlist mode toggle
        this.deleteModeBtn.addEventListener('click', () => {
            this.isDeleteMode = !this.isDeleteMode;
            this.deleteModeBtn.style.color = this.isDeleteMode ? 'red' : 'black';
            deleteAllContainer.style.display = this.isDeleteMode ? 'block' : 'none';
            this.dispatchEvent(new CustomEvent('request-refresh-playlist', { bubbles: true, composed: true }));
        });

        // Cascade deletetion
        deleteAllBtn.addEventListener('click', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filtered = this.currentPlaylists.filter(p => p.name.toLowerCase().includes(searchTerm));

            if (filtered.length === 0) return;

            if (confirm(`¿Are you sure you want to delete all filtered playlists (${filtered.length}) and their songs?`)) {
                filtered.forEach(p => {
                    this.dispatchEvent(new CustomEvent('request-delete-playlist', {
                        detail: { id: p.id },
                        bubbles: true,
                        composed: true
                    }));
                });
            }
        });
    }

    createNewPlaylist() {
        const name = this.nameInput.value.trim();
        if (!name) return;

        // New event
        const createEvent = new CustomEvent('request-create-playlist', {
            detail: { name: name, songIds: [] }, 
            bubbles: true,
            composed: true 
        });
        this.dispatchEvent(createEvent);

        // Clean and hide dialog
        this.nameInput.value = '';
        this.dialog.classList.add('hidden');
    }

    updateList(playlists) {
        this.currentPlaylists = playlists;
        this.shadowRoot.getElementById('search-input').value = '';
        this.renderPlaylists(playlists);
    }

    renderPlaylists(playlistsToRender) {
        const listContainer = this.shadowRoot.getElementById('playlist-list');
        listContainer.innerHTML = ''; // Clear current list
        
        if (playlistsToRender.length === 0) {
            listContainer.innerHTML = '<p class="empty-msg" style="color: #888;">No playlists found.</p>';
            return; 
        }

        playlistsToRender.forEach(playlist => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            if (this.activePlaylistId === playlist.id) {
                item.classList.add('active');
            }
            item.dataset.id = playlist.id;

            // Name container
            const nameSpam = document.createElement('span');
            nameSpam.textContent = playlist.name;
            nameSpam.style.flex = '1';

            // Btn Container
            const btnContainer = document.createElement('div');
            btnContainer.style.display = 'flex';
            btnContainer.style.gap = '5px';

            // Edit Button
            const editBtn = document.createElement('button');
            editBtn.textContent = '🛠️';
            editBtn.className = 'delete-item-btn'; // Reusing style for consistency
            editBtn.title = 'Edit Playlist Name';

            editBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                const newName = prompt('Enter new playlist name:', playlist.name);
                if (newName && newName.trim() && newName.trim() !== playlist.name) {
                    this.dispatchEvent(new CustomEvent('request-update-playlist', {
                        detail: { id: playlist.id, name: newName.trim() },
                        bubbles: true,
                        composed: true
                    }));
                }
            });
            btnContainer.appendChild(editBtn);

            // Delete Button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑️';
            deleteBtn.className = 'delete-item-btn';
            deleteBtn.style.display = this.isDeleteMode ? 'block' : 'none';
            
            btnContainer.appendChild(deleteBtn);

            item.appendChild(nameSpam);
            item.appendChild(btnContainer);

            // Event for selecting a playlist
            nameSpam.addEventListener('click', () => {
                if (!this.isDeleteMode) {
                    this.dispatchEvent(new CustomEvent('request-select-playlist', {
                        detail: { playlist: playlist },
                        bubbles: true,
                        composed: true
                    }));
                }
            });

            // Event to delete a playlist
            deleteBtn.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent triggering the select event
                if (confirm(`Are you sure you want to delete the playlist "${playlist.name}"?`)) {
                    this.dispatchEvent(new CustomEvent('request-delete-playlist', {
                        detail: { id: playlist.id },
                        bubbles: true,
                        composed: true
                    }));
                }
            });

            listContainer.appendChild(item);
        });
    }

    setActivePlaylist(id) {
        this.activePlaylistId = id;
        const items = this.shadowRoot.querySelectorAll('.playlist-item');
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