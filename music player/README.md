<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/jerichd4c/web-audio-manager">
    <img src="resources/default-cover.jpg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Web Audio Manager 🎵</h3>

  <p align="center">
    A playlist management system and local audio player based on IndexedDB. It features a modern dark mode aesthetic and native browser APIs to handle audio playback, metadata extraction, and local storage.
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#technical-notes">Technical Notes</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

[![Web Audio Manager Screen Shot][product-screenshot]](https://github.com/jerichd4c/web-audio-manager)

Web Audio Manager is a robust client-side audio player that allows users to manage their music library directly in the browser. It prioritizes privacy and performance by using IndexedDB for storage and native Web Components for UI modularity.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![HTML5][HTML5-badge]][HTML5-url]
* [![CSS3][CSS3-badge]][CSS3-url]
* [![JavaScript][JS-badge]][JS-url]
* [![IndexedDB][IndexedDB-badge]][IndexedDB-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need a local web server to run this project because ES6 modules and IndexedDB require it. You can use:
* **Live Server** (VS Code extension)
* **Python**
  ```sh
  python -m http.server
  ```
* **Node.js (http-server)**
  ```sh
  npx http-server
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/jerichd4c/web-audio-manager.git
   ```
2. Open `index.html` via your local web server.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

1. Use the **Playlist Manager** on the left to create and organize playlists.
2. Select a Playlist, then click **➕** to upload local audio files (MP3, WAV, FLAC, etc.).
3. Click any song to start playback.
4. Use the **Main Player** bar at the bottom for volume, progress, shuffle, and loop controls.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FEATURES -->
## Features

- **Song List**: Central hub with **Theme Toggle** (🌙/☀️).
- **Playlist Manager**: Search, edit labels (🛠️), and delete lists.
- **Main Player**: Persistent bottom-bar with **Shuffle** (🔀) and **Loop** (🔁/🔂).
- **Metadata Editing**: Intuitive modal for editing titles, artists, and genres.
- **Responsive Layout**: Locked, full-screen interface (`100vw`/`100vh`).
- **Persistence**: All data stored locally via **IndexedDB**.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- TECHNICAL NOTES -->
## Technical Notes

- **Architecture**: Modular component-based architecture using native **Web Components**.
- **Data Storage**: Uses **IndexedDB** for offline storage of BLOBs and metadata.
- **Styling**: Modular CSS design with a pristine dark theme.
- **State Management**: Event-driven patterns using `CustomEvents` for synchronization.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [jsmediatags](https://github.com/aadsm/jsmediatags) — For reading ID3 audio metadata dynamically.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/jerichd4c/web-audio-manager.svg?style=for-the-badge
[contributors-url]: https://github.com/jerichd4c/web-audio-manager/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/jerichd4c/web-audio-manager.svg?style=for-the-badge
[forks-url]: https://github.com/jerichd4c/web-audio-manager/network/members
[stars-shield]: https://img.shields.io/github/stars/jerichd4c/web-audio-manager.svg?style=for-the-badge
[stars-url]: https://github.com/jerichd4c/web-audio-manager/stargazers
[issues-shield]: https://img.shields.io/github/issues/jerichd4c/web-audio-manager.svg?style=for-the-badge
[issues-url]: https://github.com/jerichd4c/web-audio-manager/issues
[license-shield]: https://img.shields.io/github/license/jerichd4c/web-audio-manager.svg?style=for-the-badge
[license-url]: https://github.com/jerichd4c/web-audio-manager/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/jerichd4c
[product-screenshot]: resources/sample_screenshot.png

[HTML5-badge]: https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white
[HTML5-url]: https://developer.mozilla.org/en-US/docs/Web/HTML
[CSS3-badge]: https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white
[CSS3-url]: https://developer.mozilla.org/en-US/docs/Web/CSS
[JS-badge]: https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E
[JS-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[IndexedDB-badge]: https://img.shields.io/badge/IndexedDB-blue?style=for-the-badge&logo=databricks&logoColor=white
[IndexedDB-url]: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API