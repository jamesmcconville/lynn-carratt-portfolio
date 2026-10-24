# Lynsey Carratt Portfolio

A static portfolio site built with Vite. The production build is a bundle of static files, so it can be hosted on Cloudflare Pages without a server or framework adapter.

## Run locally

```sh
npm install
npm run dev
```

Vite prints the local URL in the terminal (usually `http://localhost:5173`).

## Build and preview

```sh
npm run build
npm run preview
```

The deployable site is written to `dist/`.

## Deploy to Cloudflare Pages

### Connect a Git repository

1. Push this project to a GitHub or GitLab repository.
2. In Cloudflare, go to **Workers & Pages → Create → Pages → Connect to Git** and select the repository.
3. Set the build command to `npm run build` and the build output directory to `dist`.
4. Leave the root directory as `/` and deploy.

Cloudflare Pages will build and publish the site on each push. No environment variables or server-side runtime are required.

### Deploy from the command line

After creating a Pages project and authenticating Wrangler with Cloudflare, run:

```sh
npx wrangler pages deploy dist --project-name YOUR_CLOUDFLARE_PAGES_PROJECT
```

## Updating the portfolio

- The content is stored in `src/content/` and managed through [Pages CMS](https://pagescms.org/) using the root `.pages.yml` configuration.
- After pushing the repo to GitHub, visit [app.pagescms.org](https://app.pagescms.org), sign in with GitHub, grant the Pages CMS GitHub App access to the repository, and open the repo. The editor will expose the work collection, profile/contact settings, and print archive.
- Pages CMS commits edits to GitHub; Cloudflare Pages then builds the updated site on each push.
- See [`src/content/README.md`](src/content/README.md) for the file layout and local editing workflow.
- `index.html` contains the page structure; `src/main.js` renders the content files and handles tabs and filters.
- Edit visual styles in `styles.css`.
- Keep `dist/` out of source control; Vite generates it during each build.

This directory is not connected to a GitHub repository yet. Connect or push the project to GitHub before Pages CMS can provide the browser-based editor.
