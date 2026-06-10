<script lang="ts">
  import type { BookMeta } from "@/types/book";
  import Icon from "@iconify/svelte";

  interface Props {
    book: BookMeta;
    onselect: (book: BookMeta) => void;
  }

  let { book, onselect }: Props = $props();
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

  <div class="p-4 space-y-1">
    <h3 class="font-semibold text-[var(--text-color)] line-clamp-2 leading-snug">{book.title}</h3>
    <p class="text-sm text-[var(--text-color-70)]">{book.author}</p>
  </div>
</button>
