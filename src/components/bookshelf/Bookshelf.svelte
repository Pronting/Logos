<script lang="ts">
  import type { BookMeta, BookRating, BookTag } from "@/types/book";
  import BookCard from "./BookCard.svelte";
  import BookFilters from "./BookFilters.svelte";
  import BookDetail from "./BookDetail.svelte";

  interface Props {
    books: BookMeta[];
  }

  let { books }: Props = $props();

  let q = $state("");
  let tag = $state<BookTag | "all">("all");
  let rating = $state<BookRating | "all">("all");
  let selectedBook = $state<BookMeta | null>(null);

  const filtered = $derived(
    books.filter((book) => {
      if (q.trim()) {
        const haystack = `${book.title} ${book.author}`.toLowerCase();
        if (!haystack.includes(q.trim().toLowerCase())) return false;
      }
      if (tag !== "all" && !book.tags.includes(tag as BookTag)) return false;
      if (rating !== "all" && book.rating !== (rating as BookRating)) return false;
      return true;
    }),
  );

  const i18n = {
    searchPlaceholder: "搜索书名或作者...",
    filterTag: "领域",
    filterRating: "评价",
    ratingRecommended: "推荐",
    ratingNeutral: "中庸",
    ratingNotRecommended: "不行",
    ratingAll: "全部",
    tagAll: "全部",
    close: "关闭",
    readDate: "阅读时间",
    readTime: "阅读时长",
    year: "年份",
    author: "作者",
    summary: "简介",
    myReview: "我的书评",
    noResults: "未找到相关书籍",
  };

  function handleSelect(book: BookMeta) {
    selectedBook = book;
  }

  function handleCloseDetail() {
    selectedBook = null;
  }
</script>

<div class="space-y-6">
  <BookFilters
    bind:q
    bind:tag
    bind:rating
    searchPlaceholder={i18n.searchPlaceholder}
    filterTag={i18n.filterTag}
    filterRating={i18n.filterRating}
    ratingRecommended={i18n.ratingRecommended}
    ratingNeutral={i18n.ratingNeutral}
    ratingNotRecommended={i18n.ratingNotRecommended}
    ratingAll={i18n.ratingAll}
    tagAll={i18n.tagAll}
  />

  {#if filtered.length === 0}
    <p class="text-center text-[var(--text-color-70)] py-16">{i18n.noResults}</p>
  {:else}
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
      {#each filtered as book (book.id)}
        <BookCard book={book} onselect={handleSelect} />
      {/each}
    </div>
  {/if}

  {#if selectedBook}
    <BookDetail
      book={selectedBook}
      onclose={handleCloseDetail}
      closeLabel={i18n.close}
      readDateLabel={i18n.readDate}
      readTimeLabel={i18n.readTime}
      yearLabel={i18n.year}
      authorLabel={i18n.author}
      summaryLabel={i18n.summary}
      myReviewLabel={i18n.myReview}
      ratingRecommended={i18n.ratingRecommended}
      ratingNeutral={i18n.ratingNeutral}
      ratingNotRecommended={i18n.ratingNotRecommended}
    />
  {/if}
</div>
