<script lang="ts">
  import type { BookMeta, BookRating } from "@/types/book";
  import { ALL_BOOK_RATINGS } from "@/types/book";

  interface Props {
    books: BookMeta[];
    q: string;
    tag: string | "all";
    rating: BookRating | "all";
    searchPlaceholder: string;
    filterTag: string;
    filterRating: string;
    ratingRecommended: string;
    ratingNeutral: string;
    ratingNotRecommended: string;
    ratingAll: string;
    tagAll: string;
    statsRead: string;
    statsRecommended: string;
    statsDomains: string;
  }

  let {
    books,
    q = $bindable(""),
    tag = $bindable("all" as string | "all"),
    rating = $bindable("all" as BookRating | "all"),
    searchPlaceholder,
    filterTag,
    filterRating,
    ratingRecommended,
    ratingNeutral,
    ratingNotRecommended,
    ratingAll,
    tagAll,
    statsRead,
    statsRecommended,
    statsDomains,
  }: Props = $props();

  const tagCounts = $derived(() => {
    const counts = new Map<string, number>();
    for (const book of books) {
      for (const t of book.tags) {
        counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag, count]) => ({ tag, count }));
  });

  const stats = $derived(() => {
    const total = books.length;
    const recommended = books.filter((b) => b.rating === "recommended").length;
    const domains = tagCounts().length;
    return { total, recommended, domains };
  });

  const ratingLabelMap: Record<BookRating, string> = $derived({
    recommended: ratingRecommended,
    neutral: ratingNeutral,
    "not-recommended": ratingNotRecommended,
  });

  function toggleTag(t: string | "all") {
    tag = tag === t ? "all" : t;
  }

  function toggleRating(r: BookRating | "all") {
    rating = rating === r ? "all" : r;
  }
</script>

<div class="space-y-4 mb-8">
  <div class="flex flex-wrap items-center gap-3 text-sm text-[var(--text-color-70)]">
    <span class="font-medium text-[var(--text-color)]">{stats().total} {statsRead}</span>
    <span class="text-[var(--button-border-color)]">·</span>
    <span>{stats().recommended} {statsRecommended}</span>
    <span class="text-[var(--button-border-color)]">·</span>
    <span>{stats().domains} {statsDomains}</span>
  </div>

  <input
    type="search"
    bind:value={q}
    placeholder={searchPlaceholder}
    class="w-full px-4 py-2.5 rounded-lg border border-[var(--button-border-color)] bg-[var(--bg-color)] text-[var(--text-color)] placeholder:text-[var(--text-color-70)] focus:outline-none focus:ring-2 focus:ring-[var(--link-color)] transition-colors text-sm"
  />

  <div>
    <div class="flex items-center gap-2 text-[var(--text-color)] font-bold mb-3 border-b border-[var(--button-border-color)] pb-2 text-sm uppercase tracking-wider">
      {filterTag}
    </div>
    <div class="flex flex-wrap gap-2">
      <button
        onclick={() => toggleTag("all")}
        class="px-3 py-1 text-xs rounded-md transition-all border inline-flex items-center gap-1.5
        {tag === 'all'
          ? 'bg-[var(--link-color)] text-white border-[var(--link-color)]'
          : 'hover:border-[var(--link-color)] border-[var(--button-border-color)] text-[var(--text-color)]'}"
      >
        {tagAll}
      </button>
      {#each tagCounts() as { tag: t, count } (t)}
        <button
          onclick={() => toggleTag(t)}
          class="px-3 py-1 text-xs rounded-md transition-all border inline-flex items-center gap-1.5
          {tag === t
            ? 'bg-[var(--link-color)] text-white border-[var(--link-color)]'
            : 'hover:border-[var(--link-color)] border-[var(--button-border-color)] text-[var(--text-color)]'}"
        >
          <span>{t}</span>
          <span class="opacity-70 text-[10px] tabular-nums">({count})</span>
        </button>
      {/each}
    </div>
  </div>

  <div>
    <div class="flex items-center gap-2 text-[var(--text-color)] font-bold mb-3 border-b border-[var(--button-border-color)] pb-2 text-sm uppercase tracking-wider">
      {filterRating}
    </div>
    <div class="flex flex-wrap gap-2">
      <button
        onclick={() => toggleRating("all")}
        class="px-3 py-1 text-xs rounded-md transition-all border inline-flex items-center gap-1.5
        {rating === 'all'
          ? 'bg-[var(--link-color)] text-white border-[var(--link-color)]'
          : 'hover:border-[var(--link-color)] border-[var(--button-border-color)] text-[var(--text-color)]'}"
      >
        {ratingAll}
      </button>
      {#each ALL_BOOK_RATINGS as r}
        <button
          onclick={() => toggleRating(r)}
          class="px-3 py-1 text-xs rounded-md transition-all border inline-flex items-center gap-1.5
          {rating === r
            ? 'bg-[var(--link-color)] text-white border-[var(--link-color)]'
            : 'hover:border-[var(--link-color)] border-[var(--button-border-color)] text-[var(--text-color)]'}"
        >
          <span>{ratingLabelMap[r]}</span>
        </button>
      {/each}
    </div>
  </div>
</div>
