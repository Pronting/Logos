import type { CollectionEntry } from "astro:content";

/**
 * 书籍分类（领域 tag）。
 * 后续可扩展，例如加入「艺术」「计算机」「科普」等。
 */
export type BookTag =
    | "心理学"
    | "历史学"
    | "哲学"
    | "文学"
    | "政治经济学"
    | "社会学"
    | "金融学";

/**
 * 我对这本书的个人评价。
 */
export type BookRating = "recommended" | "neutral" | "not-recommended";

/**
 * 书籍的元信息（来自 frontmatter）。
 * 字段保持精简并尽量 optional，方便后续扩展（出版社、ISBN、原版语言等）。
 */
export interface BookFrontmatter {
    title: string;
    author: string;
    cover?: string;
    tags: BookTag[];
    rating: BookRating;
    summary?: string;
    readDate?: Date;
    readTimeMinutes?: number;
    year?: number;
    pinTop?: number;
    draft?: boolean;
}

export type BookEntry = CollectionEntry<"books">;

/** 传给前端组件使用的轻量元信息 */
export interface BookMeta {
    id: string;
    slug: string;
    title: string;
    author: string;
    cover: string;
    tags: BookTag[];
    rating: BookRating;
    summary: string;
    readDate: Date | null;
    readTimeMinutes: number | null;
    year: number | null;
    pinTop: number;
}

/** 筛选条件 */
export interface BookFilter {
    q?: string;
    tag?: BookTag | "all";
    rating?: BookRating | "all";
}

/** 所有可用的 tag（与 schema 保持同步） */
export const ALL_BOOK_TAGS: BookTag[] = [
    "心理学",
    "历史学",
    "哲学",
    "文学",
    "政治经济学",
    "社会学",
    "金融学",
];

/** 所有可用的 rating */
export const ALL_BOOK_RATINGS: BookRating[] = [
    "recommended",
    "neutral",
    "not-recommended",
];
