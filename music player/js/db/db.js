export class MusicDB {
    constructor() {
        this.dbName = 'MusicDB';
        this.dbVersion = 2;
        this.db = null;
    }

    init () {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                console.error('Error opening database:', event.target.error);
                reject("Error opening database");
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('Database opened successfully');
                resolve();
            };

            // If DB doesnt exist or version is updated
            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create object store for songs
                if (!db.objectStoreNames.contains('songs')) {
                    db.createObjectStore('songs', { keyPath: 'id', autoIncrement: true });
                }

                // Store obejct store for playlists
                if (!db.objectStoreNames.contains('playlists')) {
                    const playlistsStore = db.createObjectStore('playlists', { keyPath: 'id', autoIncrement: true });
                    // Create index to make searching by name easier
                    playlistsStore.createIndex('name', 'name', { unique: false });
                }
            };
        });
    }

    async addSong(songData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['songs'], 'readwrite');
            const store = transaction.objectStore('songs');

            const request = store.add(songData);

            request.onsuccess = () => resolve (request.result); // Returns ID
            request.onerror = (event) => reject( "Error adding song: " + event.target.error);
        });
    }

    async getAllSongs() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['songs'], 'readonly');
            const store = transaction.objectStore('songs');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject("Error fetching songs: " + event.target.error);
        });
    }

    async addPlaylist(playlistData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['playlists'], 'readwrite');
            const store = transaction.objectStore('playlists');
            const request = store.add(playlistData);

            request.onsuccess = () => resolve(request.result); // Returns ID
            request.onerror = (event) => reject("Error adding playlist: " + event.target.error);
        });
    }

    async getAllPlaylists() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['playlists'], 'readonly');
            const store = transaction.objectStore('playlists');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject("Error fetching playlists: " + event.target.error);
        });
    }  

    async updatePlaylist(playlistData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['playlists'], 'readwrite');
            const store = transaction.objectStore('playlists');
            const request = store.put(playlistData); // put only updates if the ID already exists

            request.onsuccess = () => resolve();
            request.onerror = (event) => reject("Error updating playlist: " + event.target.error);
        });
    }
    
    async getSongsByIds(idsArray) {
        if (!idsArray || idsArray.length === 0) return [];

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['songs'], 'readonly');
            const store = transaction.objectStore('songs');
            const results = [];
            let completedRequests = 0;
        
            idsArray.forEach(id => {
                const request = store.get(id);
                request.onsuccess = () => {
                    if (request.result) results.push(request.result);
                    completedRequests++;
                    // Once all requests are completed, resolve the promise with the songs array
                    if (completedRequests === idsArray.length) {
                        resolve(results);
                    }
                };
                request.onerror = () => {
                    completedRequests++;
                    if (completedRequests === idsArray.length) resolve(results);
                };
            });
        });
    }
    
    async deletePlaylist(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['playlists'], 'readwrite');
            const store = transaction.objectStore('playlists');
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = (event) => reject("Error deleting playlist: " + event.target.error);
        });
    }

    async deleteSong(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['songs'], 'readwrite');
            const store = transaction.objectStore('songs');
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = (event) => reject("Error deleting song: " + event.target.error);
        });
    }

    async updateSong(songData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['songs'], 'readwrite');
            const store = transaction.objectStore('songs');
            const request = store.put(songData); // put only updates if the ID already exists

            request.onsuccess = () => resolve();
            request.onerror = (event) => reject("Error updating song: " + event.target.error);
        });
    }

}