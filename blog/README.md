# Retro Ocean Blog

A minimalist retro-style blog using NES.css with an ocean tile background and LaTeX formula support.

## Features

- **NES.css Styling**: Classic 8-bit aesthetic with white content blocks and black borders
- **Ocean Background**: Tiled water background for a peaceful retro atmosphere
- **LaTeX Support**: Write mathematical formulas using KaTeX
- **Featured Post Auto-Select**: The newest post (by `data-date`) is shown as the Featured Post on the home page

## How to Use LaTeX Formulas

### Inline Formulas
Use `\( ... \)` or `$ ... $` for inline formulas:
```
The equation \(E = mc^2\) is famous.
```

### Display Formulas
Use `\[ ... \]` or `$$ ... $$` for centered display formulas:
```
\[
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
\]
```

### Example Formulas

- Quadratic formula: `\(x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}\)`
- Euler's identity: `\[e^{i\pi} + 1 = 0\]`
- Summation: `\[\sum_{i=1}^{n} i = \frac{n(n+1)}{2}\]`
- Matrix: `\[\begin{pmatrix} a & b \\ c & d \end{pmatrix}\]`

## Running the Blog

Simply open `index.html` in a web browser. No build process required!

## Posting from iPad (Git workflow) and Post Template

See `POSTING.md` for:

- iPad + Git workflow (Working Copy)
- Ready-to-copy post template with:
  - Centered image with NES frame
  - KaTeX formulas (inline and display)
  - NES-styled lists

## Customization

- **Background tile size**: Adjust `background-size` in the CSS (currently 64px)
- **Colors**: Modify the white backgrounds and black text in the CSS
- **Content**: Edit the HTML to add your own blog posts

## Technologies Used

- [NES.css](https://nostalgic-css.github.io/NES.css/) - NES-style CSS framework
- [KaTeX](https://katex.org/) - Fast math typesetting for the web
- Press Start 2P font from Google Fonts
