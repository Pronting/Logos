import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { i18n } from "astro:config/client";

import type { BookEntry, BookFilter, BookMeta, BookRating, BookReviewLink } from "@/types/book";

export function toBookMeta(
    entry: CollectionEntry<"books">,
    reviewLinks?: BookReviewLink[],
): BookMeta {
    const data = entry.data;
    // 去掉 locale 后缀，得到纯 slug（如 "example-book/zh-cn" → "example-book"）
    const slug = entry.id.replace(/\/[^\/]+$/, "");
    return {
        id: entry.id,
        slug,
        title: data.title,
        author: data.author,
        cover: data.cover ?? "",
        tags: data.tags ?? [],
        rating: data.rating,
        summary: data.summary ?? "",
        readDate: data.readDate ?? null,
        readTimeMinutes: data.readTimeMinutes ?? null,
        year: data.year ?? null,
        pinTop: data.pinTop ?? 0,
        reviewLinks: reviewLinks ?? [],
    };
}

export async function getBooks(lang: string): Promise<BookEntry[]> {
    const targetLang = lang || i18n.defaultLocale;
    const all = await getCollection(
        "books",
        ({ data }) => (import.meta.env.PROD ? data.draft !== true : true),
    );

    const grouped = new Map<string, Record<string, CollectionEntry<"books">>>();
    for (const book of all) {
        const parts = book.id.split("/");
        const fileName = parts[parts.length - 1];
        const id = parts.slice(0, -1).join("/");
        const language: string = fileName.replace(/\.md$/, "");
        if (!grouped.has(id)) grouped.set(id, {});
        grouped.get(id)![language] = book;
    }

    const defaultLang = i18n.defaultLocale;
    const result: CollectionEntry<"books">[] = [];

    for (const [, locales] of grouped) {
        const picked = locales[targetLang] ?? locales[defaultLang];
        if (picked) {
            result.push(picked);
        }
    }

    result.sort((a, b) => {
        const pinA = a.data.pinTop ?? 0;
        const pinB = b.data.pinTop ?? 0;
        if (pinA !== pinB) return pinB - pinA;
        const dateA = a.data.readDate?.valueOf() ?? 0;
        const dateB = b.data.readDate?.valueOf() ?? 0;
        return dateB - dateA;
    });

    return result;
}

export function filterBooks(books: BookEntry[], filter: BookFilter): BookEntry[] {
    const q = (filter.q ?? "").trim().toLowerCase();
    const tag = filter.tag ?? "all";
    const rating = filter.rating ?? "all";

    return books.filter((book) => {
        const data = book.data;

        if (q) {
            const haystack = `${data.title} ${data.author}`.toLowerCase();
            if (!haystack.includes(q)) return false;
        }

        if (tag !== "all" && !data.tags?.includes(tag)) {
            return false;
        }

        if (rating !== "all" && data.rating !== (rating as BookRating)) {
            return false;
        }

        return true;
    });
}

export async function getBookReviews(
    lang: string,
): Promise<CollectionEntry<"bookReview">[]> {
    const targetLang = lang || i18n.defaultLocale;
    const all = await getCollection(
        "bookReview",
        ({ data }) => (import.meta.env.PROD ? data.draft !== true : true),
    );

    const grouped = new Map<string, Record<string, CollectionEntry<"bookReview">>>();
    for (const review of all) {
        const parts = review.id.split("/");
        const fileName = parts[parts.length - 1];
        const id = parts.slice(0, -1).join("/");
        const language: string = fileName.replace(/\.md$/, "");
        if (!grouped.has(id)) grouped.set(id, {});
        grouped.get(id)![language] = review;
    }

    const defaultLang = i18n.defaultLocale;
    const result: CollectionEntry<"bookReview">[] = [];

    for (const [, locales] of grouped) {
        const picked = locales[targetLang] ?? locales[defaultLang];
        if (picked) {
            result.push(picked);
        }
    }

    result.sort((a, b) => {
        const pinA = a.data.pinTop ?? 0;
        const pinB = b.data.pinTop ?? 0;
        if (pinA !== pinB) return pinB - pinA;
        const dateA = a.data.pubDate?.valueOf() ?? 0;
        const dateB = b.data.pubDate?.valueOf() ?? 0;
        return dateB - dateA;
    });

    return result;
}

export async function buildBookReviewMap(
    lang: string,
): Promise<Map<string, BookReviewLink[]>> {
    const reviews = await getBookReviews(lang);
    const map = new Map<string, BookReviewLink[]>();

    for (const review of reviews) {
        const slug = review.data.bookSlug;
        if (!slug) continue;
        const links = map.get(slug) ?? [];
        links.push({
            title: review.data.title,
            url: `/book-review/${review.id}`,
            pubDate: review.data.pubDate,
        });
        map.set(slug, links);
    }

    return map;
}
