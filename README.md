# **TailBlazer**

TailBlazer is a fully client-side web application built with React, TypeScript, and Leaflet that allows users to report and track lost animals.

Users can

- Submit lost pet reports with photos, descriptions, and contact details
- Select the last known location on an interactive map
- View all reported animals on a live map
- Browse reports in a filterable list (by animal type and status)
- Mark pets as found using a password-based verification system

Allow up to 5 secs for loading of report forms and map pointers

### **Set up**

- `npm install`
- `npm run dev`

Setup `.env`

- check `.env-example`
- `VITE_IMGBB_KEY` is the imgbb api key
- `VITE_JSONBIN_KEY` is the jsonbin api x-master-key (use `\` before each `$`)
- `VITE_JSONBIN_ID` is the bin id created in jsonbin

* JSONBin initial structure:

```bash
{
  "reports": []
}
```

## **Navigation**

- `/browse` browse reports
- `/report/:id` view a specific report with specified `id`
- `/report/new` make a new report

### **AI Usage**

- github copilot inline suggestions were used.
