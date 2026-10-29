# Portfolio content files

The portfolio is file-managed. Pages CMS provides a browser editor for these same files once the project is connected to GitHub. You can also edit the JSON directly, preview with Vite, then commit and push the changes.

## `site.json`

Holds the name, role, location, short introduction, alternate-byline note, contact link, About copy, topic list, and archive links. Lynn Carratt is the main portfolio name; some earlier work is published as Lynsey Carratt. Keep every individual clip’s credit exactly as shown by its publisher. The contact destination is currently Lynn’s Instagram profile.

## `work/`

Each JSON file in this folder is one published piece. In Pages CMS, add a new item to the **Online work** collection; when editing files directly, copy an existing object to a new JSON file and update its fields:

```json
{
  "title": "Published headline",
  "url": "https://publisher.example/story",
  "category": "features",
  "kind": "Interview",
  "date": "2026-04",
  "credit": "By Lynn Carratt",
  "linkLabel": "Publication name",
  "description": "A short, factual description of the piece."
}
```

- `category` must be `features`, `reviews`, or `news` to match the portfolio filters.
- `date` can be a year (`2026`) or year and month (`2026-04`).
- Set `"featured": true` on one item to give it the larger lead treatment.
- For reviews or contributions that are not Lynn’s byline, describe the role accurately in `credit` and `linkLabel`.
- Use plain text for titles and descriptions; the site renders these safely without HTML.

## `print.json`

Contains the magazine role, context, source link, and archive status. Add scans as PDFs or images using the **Scanned clippings** field in Pages CMS. The uploaded file is stored under `public/clippings/` and its reference is added to the `clippings` array:

```json
{
  "title": "Feature title — magazine name",
  "year": "2013",
  "file": "/clippings/feature-scan.pdf"
}
```

Only files under `/clippings/` are linked in the portfolio. Confirm image and reproduction rights before publishing scans. Set `status` to reflect what the archive contains.

## Preview changes

Run `npm run dev`, edit the JSON file, and refresh the page. Check `npm run build` before pushing; Cloudflare Pages will publish the update after the push.
