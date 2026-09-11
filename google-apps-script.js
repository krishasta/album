/**
 * =========================================================================
 * Google Apps Script for Anbudan Photos - Real-time Google Drive Sync
 * =========================================================================
 * 
 * Main Folder: Website work
 * Folder Link: https://drive.google.com/drive/folders/1C99Je4_Xfc5k_1Hcpd0de1_AJzhrjHgY
 * 
 * Home Page / Hero Carousel Folder: 
 * Folder Link: https://drive.google.com/drive/folders/158SNnhmVffD5SO3bPyYpt0PQ5SPhCM82
 */

const MAIN_DRIVE_FOLDER_ID = "1C99Je4_Xfc5k_1Hcpd0de1_AJzhrjHgY";
const HERO_FOLDER_ID = "158SNnhmVffD5SO3bPyYpt0PQ5SPhCM82"; // Dedicated Hero Carousel Folder

function doGet(e) {
  try {
    const mainFolder = DriveApp.getFolderById(MAIN_DRIVE_FOLDER_ID);
    const subfolders = mainFolder.getFolders();
    const albums = [];
    const heroPhotos = [];

    // 1. Fetch Dedicated Hero Carousel Photos if folder exists
    if (HERO_FOLDER_ID) {
      try {
        const heroFolder = DriveApp.getFolderById(HERO_FOLDER_ID);
        const heroFiles = heroFolder.getFiles();
        while (heroFiles.hasNext()) {
          const file = heroFiles.next();
          const mimeType = file.getMimeType();
          if (mimeType.indexOf("image/") !== -1 || /\.(jpe?g|png|webp|gif|bmp)$/i.test(file.getName())) {
            heroPhotos.push({
              id: file.getId(),
              name: file.getName().replace(/\.[^/.]+$/, ""),
              url: "https://lh3.googleusercontent.com/d/" + file.getId() + "=w1600",
              thumbnail: "https://lh3.googleusercontent.com/d/" + file.getId() + "=w400"
            });
          }
        }
        heroPhotos.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));
      } catch (heroErr) {
        // Fallback silently if hero folder is private or not found
      }
    }

    // 2. Fetch All Subfolder Albums
    while (subfolders.hasNext()) {
      const folder = subfolders.next();
      const folderName = folder.getName();
      const files = folder.getFiles();
      const photos = [];

      while (files.hasNext()) {
        const file = files.next();
        const mimeType = file.getMimeType();

        // Include all image types
        if (mimeType.indexOf("image/") !== -1 || /\.(jpe?g|png|webp|gif|bmp)$/i.test(file.getName())) {
          photos.push({
            id: file.getId(),
            name: file.getName().replace(/\.[^/.]+$/, ""),
            url: "https://lh3.googleusercontent.com/d/" + file.getId() + "=w1600",
            thumbnail: "https://lh3.googleusercontent.com/d/" + file.getId() + "=w400"
          });
        }
      }

      // Sort photos alphabetically
      photos.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));

      // If this folder is named "Home Page" and heroPhotos is empty, use its photos as heroPhotos
      if (/home\s*page/i.test(folderName) && heroPhotos.length === 0) {
        photos.forEach(p => heroPhotos.push(p));
      }

      // Add to albums list
      if (!/home\s*page/i.test(folderName)) {
        albums.push({
          name: folderName, // Shows as Album Name on website
          title: folderName,
          photos: photos,
          cover: photos.length > 0 ? photos[0].url : ""
        });
      }
    }

    // Sort albums alphabetically by folder name
    albums.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));

    const responsePayload = {
      heroPhotos: heroPhotos,
      albums: albums
    };

    return ContentService.createTextOutput(JSON.stringify(responsePayload))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
