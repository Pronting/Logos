<script lang="ts">
  import type { BookMeta } from "@/types/book";
  import Icon from "@iconify/svelte";

  interface Props {
    book: BookMeta;
    onselect: (book: BookMeta) => void;
  }

  let { book, onselect }: Props = $props();

  const ratingLabel: Record<string, string> = {
    recommended: "推荐",
    neutral: "中庸",
    "not-recommended": "不行",
  };

  const ratingColor: Record<string, string> = {
    recommended: "bg-emerald-500/80",
    neutral: "bg-amber-400/80",
    "not-recommended": "bg-rose-400/80",
  };
</script>

<button
  class="block w-full text-left rounded-xl border border-[var(--button-border-color)] bg-[var(--bg-color)] overflow-hidden shadow hover:shadow-md transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[var(--link-color)]"
  onclick={() => onselect(book)}
  data-aos="fade-up"
>
  <div class="aspect-[2/3] bg-[var(--button-hover-color)] flex items-center justify-center overflow-hidden">
    {#if book.cover}
      <img src={book.cover} alt={book.title} class="w-full h-full object-cover" loading="lazy" />
    {:else}
      <Icon icon="fa6-solid:book" class="w-12 h-12 text-[var(--text-color-70)]" />
    {/if}
  </div>

  <div class="p-4 space-y-2">
    <h3 class="font-semibold text-[var(--text-color)] line-clamp-2 leading-snug">{book.title}</h3>

    <p class="text-sm text-[var(--text-color-70)]">{book.author}</p>

    <div class="flex flex-wrap gap-1.5 pt-1">
      {#each book.tags as tag}
        <span class="text-xs px-2 py-0.5 rounded-full bg-[var(--button-hover-color)] text-[var(--text-color-70)] border border-[var(--button-border-color)]">
          {tag}
        </span>
      {/each}
    </div>

    <span class="inline-block text-xs px-2 py-0.5 rounded-full text-white {ratingColor[book.rating] ?? 'bg-gray-400'}">
      {ratingLabel[book.rating] ?? book.rating}
    </span>
  </div>
</button>
