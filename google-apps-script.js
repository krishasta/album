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

/**
 * Automatically sends email notifications for website booking inquiries
 */
function doPost(e) {
  try {
    let data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    const recipient = "vashokphotos@gmail.com";
    const clientName = data.name || "Valued Client";
    const clientPhone = data.phone || "Not provided";
    const clientEmail = data.email || "Not provided";
    const clientService = data.service || "General Photography";
    const clientDate = data.eventDate || "To be discussed";
    const clientMessage = data.message || "No additional notes provided.";

    const subject = "📸 New Booking Inquiry: " + clientName + " - " + clientService;
    
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
        <div style="background-color: #c81e28; color: #ffffff; padding: 20px 24px; text-align: center;">
          <h2 style="margin: 0; font-size: 20px; letter-spacing: 1px;">ANBUDAN PHOTOS</h2>
          <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">New Website Booking Inquiry</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff; color: #1e293b; line-height: 1.6;">
          <h3 style="color: #0f172a; margin-top: 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Client Information</h3>
          <p style="margin: 8px 0;"><strong>👤 Client Name:</strong> ${clientName}</p>
          <p style="margin: 8px 0;"><strong>📞 Phone / WhatsApp:</strong> <a href="tel:${clientPhone}" style="color: #0284c7;">${clientPhone}</a></p>
          <p style="margin: 8px 0;"><strong>✉️ Email:</strong> <a href="mailto:${clientEmail}" style="color: #0284c7;">${clientEmail}</a></p>
          <p style="margin: 8px 0;"><strong>🏷️ Service Requested:</strong> <span style="background-color: #fee2e2; color: #991b1b; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${clientService}</span></p>
          <p style="margin: 8px 0;"><strong>📅 Event Date:</strong> ${clientDate}</p>
          
          <h3 style="color: #0f172a; margin-top: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Requirements & Notes</h3>
          <div style="background-color: #f8fafc; padding: 14px; border-radius: 8px; border-left: 4px solid #c81e28; margin: 10px 0;">
            ${clientMessage.replace(/\n/g, '<br/>')}
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <a href="https://wa.me/${clientPhone.replace(/[^0-9]/g, '')}" style="display: inline-block; background-color: #22c55e; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-right: 10px;">💬 Chat Client on WhatsApp</a>
            <a href="mailto:${clientEmail}?subject=Re:%20Anbudan%20Photos%20Booking%20Inquiry" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">✉️ Reply via Email</a>
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 12px 24px; text-align: center; font-size: 11px; color: #64748b;">
          Anbudan Photos Studio & Cinematography • Coimbatore, Tamil Nadu
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: htmlBody
    });

    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "Email delivered to " + recipient 
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      error: err.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

