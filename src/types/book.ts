import type { CollectionEntry } from "astro:content";

export type BookRating = "recommended" | "neutral" | "not-recommended";

export interface BookFrontmatter {
    title: string;
    author: string;
    cover?: string;
    tags: string[];
    rating: BookRating;
    summary?: string;
    readDate?: Date;
    readTimeMinutes?: number;
    year?: number;
    pinTop?: number;
    draft?: boolean;
}

export type BookEntry = CollectionEntry<"books">;

export interface BookReviewLink {
    title: string;
    url: string;
    pubDate: Date;
}

export interface BookMeta {
    id: string;
    slug: string;
    title: string;
    author: string;
    cover: string;
    tags: string[];
    rating: BookRating;
    summary: string;
    readDate: Date | null;
    readTimeMinutes: number | null;
    year: number | null;
    pinTop: number;
    reviewLinks: BookReviewLink[];
}

export interface BookFilter {
    q?: string;
    tag?: string | "all";
    rating?: BookRating | "all";
}

export const ALL_BOOK_RATINGS: BookRating[] = [
    "recommended",
    "neutral",
    "not-recommended",
];
