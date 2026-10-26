/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DriveFileInfo, DriveSavedSpot } from '../types';

const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
const DRIVE_FILES_URL = 'https://www.googleapis.com/drive/v3/files';

/**
 * List files created or accessible in Google Drive
 */
export async function listAppDriveFiles(accessToken: string): Promise<DriveFileInfo[]> {
  try {
    const query = encodeURIComponent("name contains '100_Bob' or name contains '100_KSh' or name contains 'Kibanda'");
    const res = await fetch(
      `${DRIVE_FILES_URL}?q=${query}&fields=files(id,name,mimeType,modifiedTime,webViewLink)&orderBy=modifiedTime desc`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to list files (${res.status})`);
    }

    const data = await res.json();
    return data.files || [];
  } catch (error: any) {
    console.error('Error listing Drive files:', error);
    throw error;
  }
}

/**
 * Save or export food spots list to Google Drive as Markdown file
 */
export async function saveSpotsToDrive(
  accessToken: string,
  spots: DriveSavedSpot[],
  fileName: string = '100_Bob_Meals_Kenya_Saved_Spots.md'
): Promise<DriveFileInfo> {
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const now = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' });
  const content = `# 🇰🇪 100 Bob Meals Kenya — My Saved Food Spots
Generated on: ${now} (EAT)
Official App: 100-KSH MEAL (Always Fresh • Never Frozen • Real Kenyan Food)

---

## 🍽️ Summary
- **Total Saved Spots**: ${spots.length}
- **Maximum Price per Meal**: 100 KSh (100 Bob)
- **Currency**: Kenyan Shillings (KES / KSh)

---

## 📍 Saved Spots & Kibandas

${spots
  .map(
    (s, idx) => `### ${idx + 1}. ${s.spotName} — ${s.city} (${s.neighborhood})
- **Signature 100 Bob Dish**: ${s.meal}
- **Price**: ${s.price} KSh
- **Location**: ${s.neighborhood}, ${s.city}
${s.notes ? `- **My Notes & Tips**: ${s.notes}` : ''}
- **Saved Date**: ${s.savedAt}
`
  )
  .join('\n\n')}

---
*Created with 100-KSH MEAL Kenya. Always fresh, simple, affordable street dining.*
`;

  const metadata = {
    name: fileName,
    mimeType: 'text/markdown',
    description: 'Saved authentic 100 KSh meal spots and vibandas across Kenya.',
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/markdown\r\n\r\n' +
    content +
    closeDelimiter;

  const res = await fetch(DRIVE_UPLOAD_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create file on Google Drive (${res.status})`);
  }

  return await res.json();
}

/**
 * Export full Kenya 100 KSh Street Food Survival Guide to Google Drive
 */
export async function exportSurvivalGuideToDrive(
  accessToken: string,
  guideTitle: string = '100_Bob_Kenya_Street_Food_Guide.md'
): Promise<DriveFileInfo> {
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const dateStr = new Date().toISOString().split('T')[0];

  const guideContent = `# 🇰🇪 THE OFFICIAL 100 BOB MEALS SURVIVAL GUIDE (KENYA)
*Edition: ${dateStr} | Under 100 KSh Daily Budget Food Map*

Welcome to the definitive guide to eating fresh, delicious, filling meals in Kenya for 100 Kenyan Shillings or less!

---

## 🏆 Top 5 Legendary 100 Bob Combos

### 1. Chapo Madondo (The King of Vibanda) — 80 KSh
- **What it is**: Two hot, flaky, coiled wheat chapatis served on a plastic plate drowned in slow-simmered yellow beans gravy.
- **Where to find**: Nairobi CBD (River Road & Fire Station), Ngara Fig Tree, Westlands Mpaka Rd alleys.
- **Pro Tip**: Ask for *"Sababisha"* (a splash of free rich meat broth over your beans).

### 2. Double Smocha Deluxe — 70 KSh
- **What it is**: Kenyan campus invention! A hot chapati rolled around 2 steamed smokies, freshly sliced red onion and tomato kachumbari, tomato sauce, and mild chilli.
- **Where to find**: Roysambu, Madaraka, Odeon Stage, Bamburi (Mombasa).
- **Pro Tip**: Eat while standing right next to the trolley for peak freshness.

### 3. Ugali Sukuma Wiki & Beef Gravy — 90 KSh
- **What it is**: Steaming hot mountain of white cornmeal ugali paired with flash-sautéed collard greens and savory bone soup.
- **Where to find**: Industrial Area Enterprise Rd, Kisumu Bus Park, Nakuru Section 58.
- **Pro Tip**: Roll the ugali into a small ball with your right hand and make a dip for the gravy.

### 4. Githeri Special na Avocado — 85 KSh
- **What it is**: Boiled tender maize kernels and red kidney beans stewed with chopped tomatoes, dhania, and a rich golden Hass avocado slice.
- **Where to find**: Upper Hill construction joints, Ngara Market, Eldoret Zion Mall back alley.
- **Pro Tip**: Healthy, high protein, keeps you full until evening.

### 5. Chips Mwitu na Sausage Box — 90 KSh
- **What it is**: Golden hand-cut street fries cooked right before your eyes, tossed with salt, pepper, kachumbari, and one fried beef sausage.
- **Where to find**: Tom Mboya St Nairobi, Mombasa Mwembe Tayari.

---

## 🗺️ Key Food Hotspots by City

### Nairobi
- **Nairobi CBD**: Fire Station Vibanda, Odeon Alleys, River Road junction.
- **Ngara**: Fig Tree Market & Stima Plaza back gate (famous for Chapo Beans & Pilau).
- **Westlands**: Mpaka Road rear kibanda row (serving tech workers and drivers alike).
- **Eastleigh**: 1st & 2nd Avenue (Somali and Swahili budget grills).

### Mombasa
- **Old Town & Kibokoni**: Viazi Karai with ukwaju sauce (50 KSh), Mahamri & Chai (40 KSh).
- **Mwembe Tayari**: Pilau Ndogo with beef soup (100 KSh).

### Kisumu
- **Kisumu Bus Park**: Steaming Ugali Omena in tomato onion reduction (90 KSh).
- **Oile Park**: Fresh Sukuma & Ugali with sour milk (Maziwa Lala) (95 KSh).

---
*Stored safely in your Google Drive via 100-KSH MEAL Kenya.*
`;

  const metadata = {
    name: guideTitle,
    mimeType: 'text/markdown',
    description: 'Comprehensive 100 Bob Kenyan food guide and budget directory.',
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/markdown\r\n\r\n' +
    guideContent +
    closeDelimiter;

  const res = await fetch(DRIVE_UPLOAD_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to export guide to Google Drive (${res.status})`);
  }

  return await res.json();
}

/**
 * Delete a file on Google Drive (destructive operation requiring explicit user confirmation)
 */
export async function deleteDriveFile(
  accessToken: string,
  fileId: string
): Promise<void> {
  const res = await fetch(`${DRIVE_FILES_URL}/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to delete file from Google Drive (${res.status})`);
  }
}
