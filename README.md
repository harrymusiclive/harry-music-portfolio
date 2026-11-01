# Harry Music Portfolio

The source for the Harry Music portfolio. This is a static site built with Vite; all artwork and logos used by the page are in `assets/`.

## Run it locally

Install [Node.js](https://nodejs.org/) 20 or newer, then run:

```sh
npm install
npm run dev
```

To make a production build locally:

```sh
npm run build
```

Vite writes the ready-to-serve site to `dist/`.

## Publish on GitHub Pages

1. Create a GitHub repository and upload the contents of this folder to its default branch (`main`).
2. In the repository, open **Settings → Pages** and set the source to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds the site and publishes it on each push to `main`.

The Vite config uses relative asset URLs so the site works at a GitHub project URL as well as at a custom domain. To use a custom domain, add it in **Settings → Pages** and configure the DNS records shown by GitHub.
