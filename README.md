# Roadmapper (Temporary Name)

## Overview

This repository contains the frontend for a study roadmap dashboard built with Next.js. The dashboard allows users to add classes via a modal form and displays each class as a card with a circular progress meter. The project is designed with a sleek, neon-orange-on-black aesthetic.

> **Note:** The name "Roadmapper" is temporary and subject to change.

## Getting Started

1. **Install Dependencies:**  
   Run the following command to install the required packages:

   ```bash
   npm i
   ```

2. **Run the Development Server:**  
   Start the Next.js development server with:
   ```bash
   npm run dev
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000).

## Accessing the Dashboard

- To access the dashboard, click the **TESTING DASHBOARD** button in the navbar.
- The dashboard features a header area with a radial dotted background behind the title, description, and a "Sync with Canvas" button.

## Dashboard Details

### Header Section

- **Background:**  
  The header has a radial dotted background created with CSS background properties. This background covers the header area behind the h2 title, descriptive text, and the button.
- **Content:**  
  The header displays:
  - A large title ("Your Classes")
  - A descriptive paragraph explaining the purpose of the dashboard
  - A button ("Sync with Canvas") that opens the Add Class modal

### Class Cards

- **Layout:**  
  Class cards are arranged in rows of 4. If fewer than 4 classes exist, the first empty card is interactive (labeled "Add Class"), while remaining placeholders display "Empty".
- **Filled Card Design:**
  - **Appearance:** A black card with a neon orange border and glow.
  - **Content:**
    - The class name is displayed prominently in extra-large, bold text.
    - The professor’s name is shown below the class name, formatted as "F. Last".
    - A thin divider separates the header content from the progress area.
    - The progress area features a circular progress meter with the current percentage in large, bold text.
    - A button at the bottom toggles between "Generate Roadmap" and "View Roadmap" depending on the class’s progress status.

## Add Class Form

### How It Works

- The **Add Class modal form** is opened when the user clicks the interactive "Add Class" card or the "Sync with Canvas" button in the header.
- The form collects:
  - **Class Name:** Must be in the format `ABC 123` (three letters, a space, and three digits). The letters are automatically converted to uppercase.
  - **Professor Name:** Requires at least two words (first and last names), each with more than 2 characters.
  - **Session:** Dropdown with options A, B, or C.
  - **Semester:** Dropdown with options Fall, Spring, or Summer.
  - **Syllabus Upload:** A file input styled to show "Choose File" initially and display "Upload Successful" after a file is selected.
- The form uses validation to ensure the class name and professor name meet the required formats before submission.

### Integration with Backend

- Teammates will need to connect the form's submit handler (`handleAddClass`) with the backend API to persist class data and handle file uploads.
- Adjustments to API endpoints and data handling should be made in the submit function.

## Testing the Progress Circle

To test the progress circle functionality:

1. **Add a Class:**  
   Open the Add Class modal and submit a valid form to add a new class.
2. **Simulate Progress:**  
   On the new class card, click the "Generate Roadmap" button. Each click will increment the progress by 10%.
3. **Observe:**  
   The circular progress meter will fill with neon orange, and the percentage inside the circle will update accordingly. Once progress begins, the button text changes to "View Roadmap".

## Summary

- **Dashboard Access:** Click the "TESTING DASHBOARD" button in the navbar.
- **Add Class:** Use the modal form to add a class with specific format requirements.
- **Progress Circle Testing:** Simulate progress updates by clicking the roadmap button.
- **Backend Integration:** Teammates are expected to integrate their backend logic into the form submission and class data display.
