# Nisarg Click Photography Website

## Add photos without editing HTML

The portfolio is now generated automatically from these folders:

- `Portrait` → Portrait
- `Weddings` → Wedding
- `Event` → Event
- `Birthday` → Birthday
- `Baby` → Baby Shower

Supported image formats: JPG, JPEG, PNG, WEBP, AVIF and GIF.

### Easiest Windows workflow

1. Copy new photos into the correct folder.
2. Double-click `UPDATE_GALLERY.bat`.
3. Open `portfolio.html` to check the gallery.
4. Upload/push your changed website files as usual.

You do **not** need to add `<img>` tags to `portfolio.html` anymore.

### One-click GitHub publishing

This project is connected to the GitHub repository `nisargclick-source/nisargclick` on branch `main`.

After adding photos, double-click `PUBLISH_WEBSITE.bat`. It will:

1. Rebuild `gallery-data.js`.
2. Add changed/new files to Git.
3. Commit them with the message `Update photography gallery`.
4. Push to `origin main`.

GitHub may ask you to sign in the first time. If your hosting deploys automatically from the GitHub repository, the live site will update after the push.

### Command-line alternative

```bash
python update_gallery.py
```

The generated file is `gallery-data.js`. Do not edit that file manually; it is rebuilt from the category folders.
