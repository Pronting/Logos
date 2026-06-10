import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { i18n } from "astro:config/client";

import type { BookEntry, BookFilter, BookMeta, BookRating, BookTag } from "@/types/book";

/**
 * 把 CollectionEntry 转成轻量 BookMeta，传给客户端组件。
 */
export function toBookMeta(entry: CollectionEntry<"books">): BookMeta {
    const data = entry.data;
    return {
        id: entry.id,
        slug: entry.id,
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
    };
}

/**
 * 加载某一语言下的所有书籍。
 * - 默认语言走 fallback 策略
 * - 按 pinTop 降序 + readDate 降序排列
 */
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

/**
 * 纯函数：根据筛选条件过滤书籍。
 * 后续扩展（tag 多选 / 排序 / 年份）都挂在这个函数上。
 */
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

        if (tag !== "all" && !data.tags?.includes(tag as BookTag)) {
            return false;
        }

        if (rating !== "all" && data.rating !== (rating as BookRating)) {
            return false;
        }

        return true;
    });
}
