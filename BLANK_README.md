<a id="readme-top"></a>

<div align="center">
  <h3 align="center">Graph Tree Assignment</h3>

  <p align="center">
    A C++ analytical project demonstrating robust Graph implementations via Adjacency Lists and Matrices.
  </p>
</div>

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
    <li><a href="#license">License</a></li>
  </ol>
</details>

## About The Project

This project contains foundational C++ algorithms crafted to model explicit directional logic:
- **`GrafoListaAdyecente.cpp`**: Evaluates optimal pathing and node mapping utilizing sparse Adjacency Lists.
- **`GrafoMatriz.cpp`**: Establishes rapid dense state lookup utilizing contiguous Adjacency Matrix structures.

### Built With

* [![C++][Cpp-shield]][Cpp-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

To get a local copy up and running, format and compile the source code natively via GCC/G++.

### Prerequisites

* GCC / G++ (MinGW on Windows)
* C++11 or higher

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/jerichd4c/graph-tree-assignment.git
   ```
2. Navigate to the branch
   ```sh
   cd graph-tree-assignment
   ```
3. Target compilation output into the `bin/` directory
   ```sh
   # Compile Adjacency List Graph
   g++ src/GrafoListaAdyecente.cpp -o bin/GrafoListaAdyecente.exe
   
   # Compile Matrix Graph
   g++ src/GrafoMatriz.cpp -o bin/GrafoMatriz.exe
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Execute the preferred binary to run the interactive console environment:

```sh
# Run List Architecture
./bin/GrafoListaAdyecente.exe

# Run Matrix Architecture
./bin/GrafoMatriz.exe
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[Cpp-shield]: https://img.shields.io/badge/c++-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white
[Cpp-url]: https://isocpp.org/