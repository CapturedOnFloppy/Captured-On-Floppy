---
layout: none
title: Camera Model Name
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{{ page.title }}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      background: #fff;
      color: #000;
      font-family: Verdana, Arial, Helvetica, sans-serif;
      font-size: 16px;
      margin: 0;
      padding: 0;
    }
    .banner {
      background: #003366;
      color: #fff;
      padding: 0.7em 0;
      text-align: center;
      font-size: 2em;
      font-family: Arial, Helvetica, sans-serif;
      letter-spacing: 0.07em;
      border-bottom: 4px solid #6699cc;
    }
    .navbar {
      background: #e0e8f0;
      border-bottom: 2px solid #6699cc;
      font-size: 1.1em;
      font-family: Verdana, Arial, Helvetica, sans-serif;
      text-align: center;
      padding: 0.3em 0;
    }
    .navbar a {
      display: inline-block;
      color: #003366;
      background: #d6e2f5;
      text-decoration: none;
      padding: 0.7em 2em;
      margin: 0 0.2em;
      font-weight: bold;
      border: 1px solid #6699cc;
      border-radius: 7px;
      transition: background 0.2s, color 0.2s;
    }
    .navbar a:hover, .navbar a:focus {
      background: #c7daf5;
      color: #000;
      text-decoration: underline;
    }
    .main-content {
      background: #fff;
      max-width: 840px;
      margin: 2em auto 2em auto;
      border: 1px solid #b2c3e6;
      border-radius: 8px;
      padding: 2em 2em 2em 2em;
      box-shadow: 0 2px 8px rgba(102,153,204,0.06);
    }
    .main-content img {
      max-width: 100%;
      border: 1px solid #b2c3e6;
      background: #fff;
      margin-bottom: 1.2em;
    }
    .main-content table {
      border-collapse: collapse;
      margin-bottom: 2em;
      width: 100%;
    }
    .main-content th, .main-content td {
      border: 1px solid #b2c3e6;
      padding: 0.5em 1em;
      text-align: left;
      background: #f8f8ff;
    }
    .main-content th {
      background: #e0e8f0;
      color: #003366;
    }
    .main-content h1, .main-content h2, .main-content h3 {
      color: #003366;
      margin-top: 1.5em;
    }
    footer {
      background: #e0e8f0;
      color: #003366;
      text-align: center;
      font-size: 0.95em;
      padding: 1em 0 1.5em 0;
      margin-top: 2em;
      border-top: 2px solid #6699cc;
    }
  </style>
</head>
<body>
  <div class="banner">
    Mavica Camera Club
    <div style="font-size:0.5em; color:#cce;">Enthusiasts & Resources</div>
  </div>

  <nav class="navbar">
    <a href="/">Home</a>
    <a href="/about.html">About</a>
    <a href="/gallery.html">Gallery</a>
    <a href="/contact.html">Contact</a>
  </nav>

  <div class="main-content">
    <h1>Camera Model Name</h1>

    <div style="display: flex; gap: 32px; flex-wrap: wrap; margin-bottom: 1.5em;">
      <img src="/assets/images/camera-front.jpg" alt="Camera Model front" style="max-width: 260px;">
      <img src="/assets/images/camera-back.jpg" alt="Camera Model back" style="max-width: 260px;">
    </div>

    <h2>About the Camera</h2>
    <p>
      Brief description of the camera, when it was released, its main feature, and why it’s interesting or important.
    </p>

    <h2>Key Features</h2>
    <ul>
      <li><strong>Year Released:</strong> 19XX</li>
      <li><strong>Image Sensor:</strong> Type, resolution</li>
      <li><strong>Lens:</strong> Focal length, optical zoom if any</li>
      <li><strong>Storage:</strong> Floppy disk/CD/Memory Stick/etc.</li>
      <li><strong>Image Format:</strong> JPEG/other</li>
      <li><strong>Power:</strong> Battery type</li>
      <li><strong>Notes:</strong> Unique facts or trivia</li>
    </ul>

    <h2>Operation &amp; Experience</h2>
    <ul>
      <li><strong>Image Quality:</strong> Your summary here</li>
      <li><strong>Handling:</strong> Notes on using the camera</li>
      <li><strong>Transfer:</strong> How easy it is to get images off the camera</li>
    </ul>

    <h2>Sample Image</h2>
    <img src="/assets/images/sample-photo.jpg" alt="Sample photo taken with Camera Model" style="max-width: 360px;">

    <h2>Technical Specifications</h2>
    <table>
      <tr><th>Feature</th><th>Details</th></tr>
      <tr><td>Year Released</td><td>19XX</td></tr>
      <tr><td>Sensor</td><td>Type, resolution</td></tr>
      <tr><td>Lens</td><td>Specs</td></tr>
      <tr><td>Storage</td><td>Type</td></tr>
      <tr><td>Image Format</td><td>JPEG/other</td></tr>
      <tr><td>Battery</td><td>Type</td></tr>
      <tr><td>Weight</td><td>XXXg</td></tr>
    </table>

    <h2>Manual</h2>
    <p>
      <a href="https://link-to-manual.pdf" target="_blank"><strong>Download the official manual (PDF)</strong></a>
    </p>
  </div>

  <footer>
    &copy; 2025 Mavica Camera Club &mdash; All rights reserved.
  </footer>
</body>
</html>

