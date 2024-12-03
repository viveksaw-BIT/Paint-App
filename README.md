# Paint App

A simple **Paint App** built with HTML5, CSS, and JavaScript using the **Canvas** element. This project is bundled with **Webpack** to handle JavaScript and CSS files, and serves the app locally using **http-server** for production builds.

## Features

- Draw circles on the canvas using the mouse.
- Auto-fill circles with random colors.
- Displays "Hit" or "Miss" and Option to delete depending on whether the click is on an existing circle.
- Reset the canvas with a button.

## Prerequisites

Make sure you have **Node.js** and **npm** installed. If not, download and install from [Node.js website](https://nodejs.org).

##### Note: You can directly access /dist folder to checkout the paint app

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/paint-app.git
cd paint-app
```

### 2. Install Dependencies

Run the following command to install the necessary dependencies for the project.

```bash
npm install
```

### 3. Available Scripts

Here are the npm scripts defined in the `package.json`:

- **`npm start`**:
  Starts the development server using **Webpack Dev Server**. It will automatically open the app in the default browser and provide live reloading for easy development.

  ```bash
  npm start
  ```

- **`npm run build`**:
  Creates a production-ready build of the app in the `dist/` directory, optimized and minified for performance.

  ```bash
  npm run build
  ```

- **`npm run build:start`**:
  Builds the app for production and serves it using **http-server** from the `dist/` directory. This simulates how the app would behave in a real production environment.

  ```bash
  npm run build:start
  ```

### 4. Usage

1. Run `npm start` to begin development. The app will be hosted at `http://localhost:8080`.
2. To prepare the app for deployment, run `npm run build` to generate a production-ready version in the `dist/` folder.
3. To serve the production build, run `npm run build:start` which will use `http-server` to serve the files from `dist/`.

## Technologies Used

- **HTML5 Canvas**: To create the paint functionality.
- **CSS3**: For styling the app.
- **JavaScript (ES6)**: Core logic for drawing, color generation, and user interaction.
- **Webpack**: Module bundler used to handle JavaScript and CSS assets.
- **http-server**: To serve the production build.
