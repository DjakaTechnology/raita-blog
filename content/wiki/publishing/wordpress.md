---
title: "WordPress Publishing"
description: "Export to WordPress XML or publish directly via the REST API."
order: 1
draft: false
---


Raita supports two methods for getting articles into WordPress:

| Method | How | Best for |
|---|---|---|
| **XML Export** | Download a WordPress WXR file, import via WordPress admin | One-time or batch import without API setup |
| **Direct Upload** | Publish via WordPress REST API from Raita | Ongoing automated publishing |

---

## Method 1: XML Export

1. Select the articles you want to export (or select all)
2. Click **Export**
3. Choose **WordPress XML**
4. Download the `.xml` file

To import into WordPress:
1. In your WordPress admin, go to **Tools → Import**
2. Choose **WordPress** importer
3. Upload the `.xml` file
4. Map authors and click **Submit**

![Export dialog with WordPress selected](../images/export-dialog.png)

---

## Method 2: Direct Upload (WordPress REST API)

### Step 1: Configure Publish Settings

Go to **Sites** in the sidebar. Click on your WordPress site (or add one) and configure the **Publish Settings — WordPress** section:

- **WordPress Site URL** — your site domain (e.g. `raita.ai`)
- **Username** — your WordPress admin username
- **Application Password** — create one in WordPress under **Users → Profile → Application Passwords**
- **Default Publish Status** — Draft or Publish

Click **Save**.

![Publish Settings in Sites page with WordPress credentials](../images/wordpress-publish-settings.png)

### Step 2: Upload Articles

1. Go to your project and use **Bulk Upload** from the ⋮ menu, or click the upload button on individual articles
2. Enter your site **URL**, **Username**, and **Password** (pre-filled if configured in Sites)
3. Optionally enable **Upload images to WordPress** to push images to your media library
4. Configure **Scheduling & Distribution**:
   - **Distribution Type** — distribute equally or all at once
   - **Start/End Date** — schedule posts across a date range
   - **Max Posts per Day** — limit daily publishing rate
5. Configure **Content Details**:
   - **Publish Status** — Draft or Publish
   - **Category** — assign categories (toggle "Use Niche" to auto-fill)
6. Click **Start Export**

![WordPress upload dialog with scheduling and distribution options](../images/wordpress-upload.png)

---

## Tips

- Direct upload requires the WordPress REST API to be enabled (it is on by default in WordPress 5.6+)
- Use **Draft** status for review before publishing live
- If upload fails with a 401 error, double-check your application password
