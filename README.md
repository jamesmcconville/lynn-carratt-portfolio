# Lynn Carratt Portfolio

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

### Connect a Git repository (recommended)

This gives a production URL and rebuilds automatically whenever Pages CMS commits an edit.

1. In Cloudflare, go to **Workers & Pages → Create → Pages → Connect to Git**.
2. Authorise GitHub and select `jamesmcconville/lynn-carratt-portfolio`.
3. Project name: `lynn-carratt` (this becomes `lynn-carratt.pages.dev`).
4. Production branch: `main`.
5. Framework preset: **None** (or Vite). Build command: `npm run build`. Build output directory: `dist`. Root directory: `/`.
6. Add an environment variable `NODE_VERSION` = `22.16.0` so Vite 7 builds on a supported Node release.
7. Select **Save and Deploy**.

Cloudflare Pages will build and publish the site on each push. No server-side runtime is required.

> Do not create the project with Wrangler/Direct Upload first. Cloudflare does not allow converting a Direct Upload project to Git integration later — you would have to create a second project.

### Deploy from the command line (manual)

Only use this if you deliberately want a Direct Upload project. It will not rebuild when content changes:

```sh
npm run build
npx wrangler pages project create lynn-carratt --production-branch main
npx wrangler pages deploy dist --project-name lynn-carratt
```

## Updating the portfolio

- The content is stored in `src/content/` and managed through [Pages CMS](https://pagescms.org/) using the root `.pages.yml` configuration.
- After pushing the repo to GitHub, visit [app.pagescms.org](https://app.pagescms.org), sign in with GitHub, grant the Pages CMS GitHub App access to the repository, and open the repo. The editor will expose the work collection, profile/contact settings, and print archive.
- Pages CMS commits edits to GitHub; Cloudflare Pages then builds the updated site on each push.
- See [`src/content/README.md`](src/content/README.md) for the file layout and local editing workflow.
- `index.html` contains the page structure; `src/main.js` renders the content files and handles tabs and filters.
- Edit visual styles in `styles.css`.
- Keep `dist/` out of source control; Vite generates it during each build.

The source is public at [github.com/jamesmcconville/lynn-carratt-portfolio](https://github.com/jamesmcconville/lynn-carratt-portfolio). Cloudflare Pages still needs to be connected to publish the site; Pages CMS also needs GitHub App authorization before its browser editor can access the repository.
