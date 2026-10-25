// The example website taught in Part 8 and used as the starting point
// for the final project. Kept as data so a test can check that every
// link and image path works in the folder structure shown.

export const SITE_TREE = `
my-website/
├── index.html
├── about.html
├── contact.html
└── images/
    └── computer.jpg
`;

/** Every file in SITE_TREE, as a path from the my-website folder. */
export const SITE_PATHS = ["index.html", "about.html", "contact.html", "images/computer.jpg"];

export const SITE_FILES: Record<"index.html" | "about.html" | "contact.html", string> = {
  "index.html": `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home – My First Website</title>
</head>
<body>
    <nav>
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
    </nav>

    <h1>Welcome to my website</h1>
    <p>Hi! I'm learning to build websites with HTML.</p>

    <img src="images/computer.jpg" alt="A laptop computer on a desk" width="400">

    <h2>On this site</h2>
    <ul>
        <li><a href="about.html">About me</a> and what I'm learning</li>
        <li><a href="contact.html">How to contact me</a></li>
    </ul>
</body>
</html>
`,
  "about.html": `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About me – My First Website</title>
</head>
<body>
    <nav>
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
    </nav>

    <h1>About me</h1>
    <p>I'm a beginner web developer based in Nigeria.</p>

    <h2>My learning plan</h2>
    <ol>
        <li>Learn HTML</li>
        <li>Learn CSS</li>
        <li>Learn JavaScript</li>
    </ol>
</body>
</html>
`,
  "contact.html": `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact – My First Website</title>
</head>
<body>
    <nav>
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
    </nav>

    <h1>Contact me</h1>
    <p>I'd love to hear from you.</p>

    <ul>
        <li>Email: <a href="mailto:hello@example.com">hello@example.com</a></li>
        <li>Best time to reach me: weekday evenings</li>
    </ul>
</body>
</html>
`,
};
