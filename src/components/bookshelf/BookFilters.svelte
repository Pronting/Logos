<script lang="ts">
  import type { BookRating, BookTag } from "@/types/book";
  import { ALL_BOOK_TAGS, ALL_BOOK_RATINGS } from "@/types/book";

  interface Props {
    q: string;
    tag: BookTag | "all";
    rating: BookRating | "all";
    searchPlaceholder: string;
    filterTag: string;
    filterRating: string;
    ratingRecommended: string;
    ratingNeutral: string;
    ratingNotRecommended: string;
    ratingAll: string;
    tagAll: string;
  }

  let {
    q = $bindable(""),
    tag = $bindable("all" as BookTag | "all"),
    rating = $bindable("all" as BookRating | "all"),
    searchPlaceholder,
    filterTag,
    filterRating,
    ratingRecommended,
    ratingNeutral,
    ratingNotRecommended,
    ratingAll,
    tagAll,
  }: Props = $props();
</script>

<div class="flex flex-wrap gap-3 mb-8 items-center">
  <input
    type="search"
    bind:value={q}
    placeholder={searchPlaceholder}
    class="flex-1 min-w-[200px] px-4 py-2.5 rounded-lg border border-[var(--button-border-color)] bg-[var(--bg-color)] text-[var(--text-color)] placeholder:text-[var(--text-color-70)] focus:outline-none focus:ring-2 focus:ring-[var(--link-color)] transition-colors text-sm"
  />

  <select
    bind:value={tag}
    class="px-3 py-2.5 rounded-lg border border-[var(--button-border-color)] bg-[var(--bg-color)] text-[var(--text-color)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--link-color)]"
    title={filterTag}
  >
    <option value="all">{tagAll}</option>
    {#each ALL_BOOK_TAGS as t}
      <option value={t}>{t}</option>
    {/each}
  </select>

  <select
    bind:value={rating}
    class="px-3 py-2.5 rounded-lg border border-[var(--button-border-color)] bg-[var(--bg-color)] text-[var(--text-color)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--link-color)]"
    title={filterRating}
  >
    <option value="all">{ratingAll}</option>
    <option value="recommended">{ratingRecommended}</option>
    <option value="neutral">{ratingNeutral}</option>
    <option value="not-recommended">{ratingNotRecommended}</option>
  </select>
</div>
