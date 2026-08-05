# Incoming Assets Folder

Place raw screenshots or videos in subdirectories matching the project slug:

```text
incoming-assets/
  business-toolkit/
    desktop.png
    mobile.png
  mangal/
    desktop.png
  chess-insights/
    desktop.png
  offline-scanner/
    mobile.png
```

Then run `pnpm media:optimize` to automatically optimize images and move them into `public/projects/<slug>/`.
