<script lang="ts">
  import type { BookMeta, BookRating } from "@/types/book";
  import Icon from "@iconify/svelte";

  interface Props {
    book: BookMeta | null;
    closeLabel: string;
    readDateLabel: string;
    readTimeLabel: string;
    yearLabel: string;
    authorLabel: string;
    summaryLabel: string;
    myReviewLabel: string;
    ratingRecommended: string;
    ratingNeutral: string;
    ratingNotRecommended: string;
    onclose: () => void;
  }

  let {
    book = null,
    closeLabel,
    readDateLabel,
    readTimeLabel,
    yearLabel,
    authorLabel,
    summaryLabel,
    myReviewLabel,
    ratingRecommended,
    ratingNeutral,
    ratingNotRecommended,
    onclose,
  }: Props = $props();

  const ratingLabelMap: Record<BookRating, string> = {
    recommended: ratingRecommended,
    neutral: ratingNeutral,
    "not-recommended": ratingNotRecommended,
  };

  const ratingColor: Record<string, string> = {
    recommended: "bg-emerald-500/80",
    neutral: "bg-amber-400/80",
    "not-recommended": "bg-rose-400/80",
  };

  function closeModal() {
    document.body.style.overflow = "";
    onclose();
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      closeModal();
    }
  }

  function onBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) closeModal();
  }

  // Lock scroll + register Escape listener when modal opens
  $effect(() => {
    if (book) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", onKeydown);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", onKeydown);
      };
    }
  });
</script>

{#if book}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-[200] flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
    aria-label={book.title}
  >
    <!-- Backdrop -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onclick={onBackdropClick}
    ></div>

    <!-- Modal Card -->
    <div class="relative bg-[var(--bg-color)] rounded-2xl border border-[var(--button-border-color)] shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto mx-4">
      <button
        class="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--button-hover-color)] hover:bg-[var(--button-border-color)] transition-colors"
        onclick={closeModal}
        aria-label={closeLabel}
      >
        <Icon icon="fa6-solid:xmark" class="w-4 h-4" />
      </button>

      <div class="p-6 md:p-8 space-y-5">
        <div class="flex flex-col sm:flex-row gap-5">
          <div class="w-28 h-40 shrink-0 rounded-lg overflow-hidden border border-[var(--button-border-color)] bg-[var(--button-hover-color)] flex items-center justify-center">
            {#if book.cover}
              <img src={book.cover} alt={book.title} class="w-full h-full object-cover" />
            {:else}
              <Icon icon="fa6-solid:book" class="w-8 h-8 text-[var(--text-color-70)]" />
            {/if}
          </div>

          <div class="flex-1 min-w-0 space-y-2.5">
            <h2 class="text-xl font-bold text-[var(--text-color)] leading-snug pr-8">{book.title}</h2>
            <p class="text-sm text-[var(--text-color-70)]">
              <span class="font-medium text-[var(--text-color)]">{authorLabel}:</span> {book.author}
            </p>

            <div class="flex flex-wrap gap-1.5">
              {#each book.tags as tag}
                <span class="text-xs px-2 py-0.5 rounded-full bg-[var(--button-hover-color)] text-[var(--text-color-70)] border border-[var(--button-border-color)]">
                  {tag}
                </span>
              {/each}
            </div>

            <span class="inline-block text-xs px-2.5 py-1 rounded-full text-white {ratingColor[book.rating] ?? 'bg-gray-400'}">
              {ratingLabelMap[book.rating] ?? book.rating}
            </span>

            <div class="grid grid-cols-2 gap-2 text-sm text-[var(--text-color-70)] pt-1">
              {#if book.readDate}
                <div>
                  <span class="font-medium text-[var(--text-color)]">{readDateLabel}:</span>
                  {" "}{new Date(book.readDate).toLocaleDateString("zh-CN")}
                </div>
              {/if}
              {#if book.readTimeMinutes}
                <div>
                  <span class="font-medium text-[var(--text-color)]">{readTimeLabel}:</span>
                  {" "}{book.readTimeMinutes} 分钟
                </div>
              {/if}
              {#if book.year}
                <div>
                  <span class="font-medium text-[var(--text-color)]">{yearLabel}:</span>
                  {" "}{book.year}
                </div>
              {/if}
            </div>
          </div>
        </div>

        {#if book.summary}
          <div>
            <h3 class="text-sm font-semibold text-[var(--text-color)] mb-2">{summaryLabel}</h3>
            <p class="text-sm text-[var(--text-color-70)] leading-relaxed">{book.summary}</p>
          </div>
        {/if}

        <div>
          <h3 class="text-sm font-semibold text-[var(--text-color)] mb-2">{myReviewLabel}</h3>
          <p class="text-sm text-[var(--text-color-70)] leading-relaxed italic">
            书评内容将在后续版本中支持 Markdown 富文本渲染。
          </p>
        </div>
      </div>
    </div>
  </div>
{/if}
