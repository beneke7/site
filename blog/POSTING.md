# Posting Guide (iPad + Git)

This guide shows how to create new posts from your iPad and push them via Git. It also includes a ready-to-copy HTML post template with:
- Centered image framed with NES.css
- KaTeX formulas (inline and display)
- NES-styled lists

The home page automatically sets the Featured Post to the newest post using the `data-date` attribute.

## New: Dynamic Posts (fragments + index.json)

Posts are now separate HTML fragments under the `posts/` folder and listed in `posts/index.json`. On page load, `index.html` fetches `posts/index.json`, loads each fragment, injects it into the right category, rebuilds the article chooser lists, re-renders KaTeX, and then updates the Featured post.

Important: Fetch requires serving the site over HTTP. Opening `index.html` directly with `file://` may block requests. Use a simple static server (e.g., Netlify, GitHub Pages, or a local dev server) to preview.

## iPad Workflow (Working Copy)

- Install "Working Copy" (iOS) from the App Store.
- Clone your repository into Working Copy.
- Edit files directly in Working Copy or use it alongside a text editor app.
- Add images to the repo (e.g., in an `images/` folder).
- Commit and push your changes.

### Steps
1. Open Working Copy and pull the latest.
2. Add your image(s) to `images/` or the repo root.
3. Create a new fragment file: `posts/<category>/<your-id>.html` using the template below.
4. Add an entry to `posts/index.json` with fields: `id`, `title`, `date` (YYYY-MM-DD), `category` (one of `physics`, `building`, `philosophy`, `music`), and `path` to the fragment.
5. Commit: "Add post: <title>".
6. Push to your remote. If hosted (e.g., GitHub Pages/Netlify), your site updates automatically.

## Post Fragment Template

Create this as a standalone file under `posts/<category>/` where `<category>` is one of `physics`, `building`, `philosophy`, or `music`. Make sure `data-date` is correct so it becomes the newest.

```html
<div class="post nes-container is-rounded with-title" id="your-article-id" data-date="YYYY-MM-DD">
  <p class="title">Article</p>
  <h2 class="post-title">Your Post Title</h2>
  <div class="post-meta">Posted on Month DD, YYYY</div>
  <div class="post-content">
    <p>Your introduction paragraph. Keep it concise.</p>

    <!-- Centered image with NES frame -->
    <div class="center">
      <div class="image-frame nes-container is-rounded with-title">
        <p class="title">Optional Caption</p>
        <img src="images/your-image.png" alt="Description" />
      </div>
    </div>

    <!-- Display formula (KaTeX) -->
    <div class="formula-block" style="margin-top: 15px;">
      <p>Display formula:</p>
      \[ e^{i\pi} + 1 = 0 \]
      <p>Inline example: \( a^2 + b^2 = c^2 \)</p>
    </div>

    <!-- NES-styled list -->
    <p>Highlights:</p>
    <ul class="nes-list is-disc">
      <li>First bullet</li>
      <li>Second bullet</li>
      <li>Third bullet</li>
    </ul>
  </div>
</div>
```

## Notes
- `data-date` must be in ISO format `YYYY-MM-DD` so the site can detect the newest post.
- Featured Post is automatically populated from the newest post when the page loads.
- Images: place under `images/` and reference with a relative path like `images/photo.png`.
- Formulas: you can use `\( ... \)` or `$...$` for inline, and `\[ ... \]` or `$$ ... $$` for display. KaTeX is already included.
- Article chooser lists are NES-styled via `ul.nes-list.is-disc` and have no arrow characters.

## Optional: Hosting
- GitHub Pages: serve from the default branch and ensure `index.html` is at the repo root.
- Netlify: drag-and-drop or connect your repo; it will auto-deploy on push.
