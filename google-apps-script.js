/**
 * =========================================================================
 * Google Apps Script for Anbudan Photos - Real-time Google Drive Sync
 * =========================================================================
 * 
 * Main Folder: Website work
 * Folder Link: https://drive.google.com/drive/folders/1C99Je4_Xfc5k_1Hcpd0de1_AJzhrjHgY
 */

const MAIN_DRIVE_FOLDER_ID = "1C99Je4_Xfc5k_1Hcpd0de1_AJzhrjHgY";

function doGet(e) {
  try {
    const mainFolder = DriveApp.getFolderById(MAIN_DRIVE_FOLDER_ID);
    const subfolders = mainFolder.getFolders();
    const albums = [];

    while (subfolders.hasNext()) {
      const folder = subfolders.next();
      const folderName = folder.getName(); // <-- REAL DRIVE FOLDER NAME
      const files = folder.getFiles();
      const photos = [];

      while (files.hasNext()) {
        const file = files.next();
        const mimeType = file.getMimeType();

        // Include all image types
        if (mimeType.indexOf("image/") !== -1 || /\.(jpe?g|png|webp|gif|bmp)$/i.test(file.getName())) {
          photos.push({
            id: file.getId(),
            name: file.getName().replace(/\.[^/.]+$/, ""), // Photo name without extension
            url: "https://lh3.googleusercontent.com/d/" + file.getId() + "=w1600",
            thumbnail: "https://lh3.googleusercontent.com/d/" + file.getId() + "=w400"
          });
        }
      }

      // Sort photos alphabetically
      photos.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));

      albums.push({
        name: folderName, // Shows as Album Name on website
        title: folderName,
        photos: photos,
        cover: photos.length > 0 ? photos[0].url : ""
      });
    }

    // Sort albums alphabetically by folder name
    albums.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));

    return ContentService.createTextOutput(JSON.stringify(albums))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
