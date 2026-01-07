# Writing Blog Posts

This folder contains all blog posts for Ramadan Giving in Markdown format.

## Quick Start

### Create a New Post

**Option 1: Use the script (recommended)**
```bash
npm run new-post "Your Post Title Here"
```

**Option 2: Manual creation**
1. Create a new `.md` file in this folder (use kebab-case: `my-post-title.md`)
2. Copy the frontmatter template below
3. Write your content in Markdown

## Frontmatter Template

Every post must start with this YAML frontmatter:

```yaml
---
title: "Your Post Title"
excerpt: "A brief 1-2 sentence summary of your post."
image: "/assets/years/2025.jpg"
category: "announcement"
categoryLabel: "Announcement"
author: "Ramadan Giving Team"
date: "2025-01-15"
featured: false
---
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | The post title (displayed on blog listing and post page) |
| `excerpt` | Yes | A short summary (shown in blog cards and meta description) |
| `image` | Yes | Path to the featured image (from `/public/` folder) |
| `category` | Yes | Category ID (see below) |
| `categoryLabel` | Yes | Human-readable category name |
| `author` | Yes | Author name |
| `date` | Yes | Publication date (YYYY-MM-DD format) |
| `featured` | No | Set `true` for the hero post (only one at a time) |

### Available Categories

| Category ID | Label | Use For |
|-------------|-------|---------|
| `announcement` | Announcements | News, updates, announcements |
| `program` | Programs | Camp days, food distribution, etc. |
| `community` | Community | Community events, iftars, etc. |
| `relief` | Relief | Emergency relief, humanitarian aid |
| `volunteer` | Volunteer Stories | Volunteer spotlights and stories |

## Markdown Tips

### Headers
```markdown
## Main Section (H2)
### Subsection (H3)
#### Minor Section (H4)
```

### Emphasis
```markdown
**bold text**
*italic text*
```

### Lists
```markdown
- Bullet point
- Another point
  - Nested point

1. Numbered item
2. Another item
```

### Blockquotes
```markdown
> "This is a quote that will be styled beautifully."
```

### Links
```markdown
[Link text](https://example.com)
[Internal link](/donate)
```

### Tables
```markdown
| Column 1 | Column 2 |
|----------|----------|
| Data     | Data     |
```

### Horizontal Rule
```markdown
---
```

## Publishing Workflow

1. **Write your post** in this folder
2. **Run the generator**: `npm run posts`
3. **Preview locally**: `npm run dev`
4. **Commit and push** to deploy

## Images

Store images in `/public/assets/` and reference them as:
```yaml
image: "/assets/years/2025.jpg"
```

In post content:
```markdown
![Alt text](/assets/images/my-image.jpg)
```

## Example Post Structure

```markdown
---
title: "New Program Launch"
excerpt: "We're excited to announce our new initiative."
image: "/assets/years/2025.jpg"
category: "announcement"
categoryLabel: "Announcement"
author: "Ramadan Giving Team"
date: "2025-01-20"
featured: false
---

## Introduction

Opening paragraph here...

### The Problem

Explain the context...

### Our Solution

Describe what you're doing...

> "A meaningful quote from the team or community."

### Impact

- First impact point
- Second impact point
- Third impact point

### How You Can Help

Call to action...

---

*For the community, by the community.* 🌙
```

