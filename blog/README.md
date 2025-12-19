# Blog Posts - Ramadan Giving

This folder contains all blog posts for the Ramadan Giving website.

## How to Add a New Blog Post

### Step 1: Create the Post Content File

1. Create a new HTML file in the `posts/` folder
2. Name it using the slug format: `your-post-slug.html`
3. Write your content using HTML

**Example content structure:**

```html
<article class="blog-post-content">
    <p class="lead">
        Your introduction paragraph here. This will appear slightly larger.
    </p>

    <h2>Section Heading</h2>
    <p>Your paragraph content here.</p>

    <blockquote>
        "A memorable quote from the article."
        <cite>— Attribution</cite>
    </blockquote>

    <h2>Another Section</h2>
    <p>More content...</p>
</article>
```

### Step 2: Add Entry to posts.json

Add a new entry to the `posts.json` file with the following structure:

```json
{
  "id": "unique-post-id",
  "slug": "url-friendly-slug",
  "title": "Your Post Title",
  "excerpt": "A brief summary of the post (1-2 sentences)",
  "content": "your-post-slug.html",
  "image": "../assets/years/image.jpg",
  "category": "announcement",
  "categoryLabel": "Announcement",
  "author": "Author Name",
  "date": "2025-12-25",
  "featured": false
}
```

### Available Categories

| Category ID   | Display Label    |
|--------------|------------------|
| announcement | Announcement     |
| relief       | Relief Effort    |
| program      | Programs         |
| community    | Community        |
| volunteer    | Volunteer Story  |

### Image Guidelines

- Use images from `assets/years/` or `assets/images/`
- Recommended aspect ratio: 16:10 or 16:9
- Path should be relative to the blog.html file (use `../assets/...`)

### Setting a Featured Post

To feature a post at the top of the blog page, set `"featured": true` in the post entry.
Only one post should be featured at a time.

## File Structure

```
blog/
├── README.md          # This file
├── posts.json         # All posts metadata
└── posts/             # Individual post content files
    ├── ramadan-2025-record-year.html
    ├── gaza-relief-gala.html
    └── ...
```

## Tips

1. **Dates**: Use ISO format (YYYY-MM-DD) for dates
2. **Slugs**: Use lowercase letters, numbers, and hyphens only
3. **Images**: Test that your image path works before publishing
4. **Excerpts**: Keep them under 200 characters for best display

