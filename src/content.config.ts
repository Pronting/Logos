import { defineCollection, z } from 'astro:content'
import { glob } from "astro/loaders";

const blogCollection = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/blog" }),
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        draft: z.boolean().optional().default(false),
        description: z.string().optional().default(''),
        image: z.string().optional().default(''),
        slugId: z.string(),
        tags: z.array(z.string()).optional(),
        pinTop: z.number().optional().default(0),
    }),
})

const bookReviewCollection = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/book-review" }),
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        draft: z.boolean().optional().default(false),
        description: z.string().optional().default(''),
        image: z.string().optional().default(''),
        tags: z.array(z.string()).optional(),
        pinTop: z.number().optional().default(0),
        bookSlug: z.string(),
        rating: z.enum(['recommended', 'neutral', 'not-recommended']).optional(),
    }),
})

const specCollection = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/spec" }),
})

const booksCollection = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/books" }),
    schema: z.object({
        title: z.string(),
        author: z.string(),
        cover: z.string().optional(),
        tags: z.array(z.string()).nonempty(),
        rating: z.enum(['recommended', 'neutral', 'not-recommended']),
        summary: z.string().optional().default(''),
        readDate: z.date().optional(),
        readTimeMinutes: z.number().int().nonnegative().optional(),
        year: z.number().int().optional(),
        pinTop: z.number().int().optional().default(0),
        draft: z.boolean().optional().default(false),
    }),
})

const columnsCollection = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/columns" }),
    schema: z.object({
        title: z.string(),
        description: z.string().optional().default(''),
        icon: z.string().optional(),
        pinTop: z.number().int().optional().default(0),
        draft: z.boolean().optional().default(false),
    }),
})

const columnArticlesCollection = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/column-articles" }),
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        draft: z.boolean().optional().default(false),
        description: z.string().optional().default(''),
        image: z.string().optional().default(''),
        tags: z.array(z.string()).optional(),
        columnSlug: z.string(),
    }),
})

export const collections = {
    blog: blogCollection,
    spec: specCollection,
    books: booksCollection,
    bookReview: bookReviewCollection,
    columns: columnsCollection,
    columnArticles: columnArticlesCollection,
}