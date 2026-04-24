class Geolocator extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        // Variable to store the watch ID for geolocation
        this.watchId = null;
        this.isMinimized = false; // Track the minimized state of the component
    }

    connectedCallback() {
        this.render();
        this.initComponent();
    }

    disconnectedCallback() {
        // Stop GPS tracker if component is removed from the DOM
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            console.log('Geolocation tracking stopped.');
        }
        // Clean up event listeners
        this.closeBtn.removeEventListener('click', this.handleClose);
        this.refreshBtn.removeEventListener('click', this.handleRefresh);
        this.minimizeBtn.removeEventListener('click', this.handleMinimize);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="Geolocator.css">

            <div class="header">
             <button class="action-btn" id="minimize-btn">_</button>
             <button class="action-btn" id="close-btn">X</button>
            </div>

            <div class="body-content" id="body-content">
             <div class="map-container" id="map-container">
              <div class="marker-idle" id="marker"></div>
             </div>

             <div class="controls">

              <div class="input-group">
                <label for="lat">Latitude:</label>
                <input type="number" id="lat" step="any" placeholder="10.63">
               </div>

               <div class="input-group">
                <label for="lon">Longitude:</label>
                <input type="number" id="lon" step="any" placeholder="-71.64">
               </div>


               <button class="refresh-btn" id="refresh-btn">Refresh</button>
             </div>
            </div>
           `;
    }

    initComponent() {
        this.closeBtn = this.shadowRoot.getElementById('close-btn');
        this.minimizeBtn = this.shadowRoot.getElementById('minimize-btn');
        this.refreshBtn = this.shadowRoot.getElementById('refresh-btn');
        this.inputLat = this.shadowRoot.getElementById('lat');
        this.inputLon = this.shadowRoot.getElementById('lon');
        this.mapContainer = this.shadowRoot.getElementById('map-container');
        this.hostElement = this.shadowRoot.host; // Store reference to the host element for later use

        // Binding event handlers
        this.handleClose = () => this.remove();
        this.handleMinimize = () => this.toggleMinimize();
        this.handleRefresh = () => this.processRefresh();

        this.closeBtn.addEventListener('click', this.handleClose);
        this.minimizeBtn.addEventListener('click', this.handleMinimize);
        this.refreshBtn.addEventListener('click', this.handleRefresh);
    }

    toggleMinimize() {
        this.isMinimized = !this.isMinimized;

        if (this.isMinimized) {
            this.hostElement.classList.add('minimized');
            this.minimizeBtn.textContent = '▢'; // Change to maximize icon
        } else {
            this.hostElement.classList.remove('minimized');
            this.minimizeBtn.textContent = '_'; // Change back to minimize icon
        }
    }

    processRefresh() {
        const latVal = this.inputLat.value;
        const lonVal = this.inputLon.value;

        // If theres already values in the inputs, use them to update the marker position
        if (latVal !== '' && lonVal !== '') {
            this.updateMap(parseFloat(latVal), parseFloat(lonVal));
        }

        // If there are no values in the inputs, start tracking the user's location
        else {
            this.refreshBtn.textContent = 'Tracking...';

        // Start tracking the user's location

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.extractPositionData(position);
                this.refreshBtn.textContent = 'Refresh';

                //Start watching the user's location
                //this.startContinuousTracking();
            },
            (error) => {
                console.error('Error getting geolocation:', error);
                alert('Unable to retrieve your location. Please allow location access and try again.');
                this.refreshBtn.textContent = 'Refresh';
            },
            { enableHighAccuracy: true }
          );
       }
    }

    extractPositionData(position) {
        // Destructure the position object to get latitude and longitude
        const { 
            latitude, 
            longitude, 
            accuracy, 
            altitude, 
            altitudeAccuracy, 
            heading, 
            speed
        } = position.coords;
        
        const timestamp = position.timestamp;
        
        this.inputLat.value = latitude;
        this.inputLon.value = longitude;

        // Draw the map

        this.updateMap(latitude, longitude);

        // DEBUG: register extra properties in the console
        console.log('Geolocation data:');
        console.log(`Latitude: ${latitude}`);
        console.log(`Longitude: ${longitude}`);
        console.log(`Accuracy: ${accuracy} meters`);
        console.log(`Altitude: ${altitude || 'N/A'}`);
        console.log(`Altitude Accuracy: ${altitudeAccuracy || 'N/A'}`);
        console.log(`Heading: ${heading || 'N/A'}`);
        console.log(`Speed: ${speed || 'N/A'}`);
        console.log(`Timestamp: ${timestamp }`);
    }

    // startContinuousTracking() {
    //     if (this.watchId !== null) 
    //         return; // Already tracking

    //     this.watchId = navigator.geolocation.watchPosition(
    //         (position) => {
    //             // Update coordinates silenty without changing the button text
    //             this.inputLat.value = position.coords.latitude;
    //             this.inputLon.value = position.coords.longitude;
    //         },
    //         (error) => console.error('Error in watchPosition:', error),
    //         { enableHighAccuracy: true }
    //     );
    // }

    updateMap(lat, lon) {
        // Insert the map directly 
        const iframe = document.createElement('iframe');
        iframe.width = '100%';
        iframe.height = '100%';

        // Make a bounding box around the coordinates to ensure the marker is visible
        const offset = 0.0005; // Adjust this value to change the zoom level
        const bbox = `${lon - offset},${lat - offset},${lon + offset},${lat + offset}`;
        iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;

        this.mapContainer.innerHTML = ''; // Clear previous map
        this.mapContainer.appendChild(iframe);
    }
}

customElements.define('geo-locator', Geolocator);