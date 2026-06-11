<script lang="ts">
  interface Props {
    dates: { date: string; count: number }[];
  }
  let { dates }: Props = $props();

  const CELL = 14, GAP = 3, WEEKS = 53;
  const DAY_LABELS = ["一","二","三","四","五","六","日"];
  const LIGHT = ["#ebedf0","#9be9a8","#40c463","#216e39"];
  const DARK  = ["#1b1f23","#0e4429","#006d32","#26a641"];
  const SNAKE = "#f85149";
  const HEAD  = "#ff6b6b";
  const BODY_LEN = 5;
  const STEP_MS = 160;

  // ---- dates ----
  const today = new Date(); today.setHours(0,0,0,0);
  const todayStr = today.toISOString().slice(0,10);
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (WEEKS * 7 - 1));
  const sdow = startDate.getDay();
  startDate.setDate(startDate.getDate() + (sdow === 0 ? -6 : 1 - sdow));

  const countMap = new Map<string,number>();
  for (const d of dates) countMap.set(d.date, d.count);

  function level(c: number) { return c===0?0 : c===1?1 : c===2?2 : 3; }

  interface Cell { date:string; count:number; level:number; row:number; col:number; }

  const grid: (Cell|null)[][] = [];
  const contribCells: Cell[] = [];

  for (let row=0; row<7; row++) {
    grid[row]=[];
    for (let col=0; col<WEEKS; col++) {
      const d=new Date(startDate); d.setDate(d.getDate()+col*7+row);
      if (d>today) { grid[row][col]=null; continue; }
      const ds=d.toISOString().slice(0,10), cnt=countMap.get(ds)||0;
      const c:Cell={date:ds,count:cnt,level:level(cnt),row,col};
      grid[row][col]=c;
      if (cnt>0) contribCells.push(c);
    }
  }
  contribCells.sort((a,b)=>a.date.localeCompare(b.date));

  // month labels
  const monthLabels: {label:string;col:number}[] = [];
  let lastM=-1;
  for (let col=0; col<WEEKS; col++) {
    const d=new Date(startDate); d.setDate(d.getDate()+col*7);
    if (d.getMonth()!==lastM) { lastM=d.getMonth(); monthLabels.push({label:`${d.getMonth()+1}月`,col}); }
  }

  // ---- snake path ----
  function walkPath(): Cell[] {
    if (contribCells.length===0) return [];
    const path: Cell[] = [];
    const flat = grid.flat().filter(Boolean) as Cell[];
    let cur: Cell|null = null;
    for (const tgt of contribCells) {
      if (!cur) { cur=tgt; path.push(cur); continue; }
      const si = flat.findIndex(c=>c.row===cur!.row&&c.col===cur!.col);
      const ei = flat.findIndex(c=>c.row===tgt.row&&c.col===tgt.col);
      if (si>=0 && ei>=0) {
        const step = si<ei ? 1 : -1;
        for (let i=si+step; step>0?i<=ei:i>=ei; i+=step) path.push(flat[i]);
      }
      cur=tgt;
    }
    return path;
  }

  // ---- reactive state ----
  let snakeHead = $state(0);
  let eatenMap = $state(new Map<string,number>());

  // ---- canvas ref ----
  let canvasEl: HTMLCanvasElement;
  let animId = 0;
  let lastTick = 0;

  function tick(ts: number) {
    const path = walkPath();
    if (path.length===0) { animId=requestAnimationFrame(tick); return; }
    if (ts - lastTick > STEP_MS) {
      const head = path[snakeHead % path.length];
      if (head.count > 0) {
        eatenMap = new Map(eatenMap.set(head.date, head.level));
      }
      snakeHead = (snakeHead + 1) % path.length;
      lastTick = ts;
    }
    draw(path);
    animId = requestAnimationFrame(tick);
  }

  function draw(path: Cell[]) {
    const cvs = canvasEl;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0,0,cvs.width,cvs.height);

    const head = path[snakeHead % path.length];
    if (!head) return;

    // body
    for (let i=1; i<=BODY_LEN; i++) {
      const idx = (snakeHead - i + path.length) % path.length;
      const cell = path[idx];
      const alpha = 1 - i/(BODY_LEN+1);
      const x=cell.col*(CELL+GAP)+1, y=cell.row*(CELL+GAP)+1;
      ctx.fillStyle=SNAKE; ctx.globalAlpha=alpha*0.55;
      ctx.beginPath(); ctx.roundRect(x,y,CELL-2,CELL-2,3); ctx.fill();
    }
    // head
    const hx=head.col*(CELL+GAP), hy=head.row*(CELL+GAP);
    ctx.globalAlpha=1;
    ctx.fillStyle=HEAD;
    ctx.beginPath(); ctx.roundRect(hx,hy,CELL,CELL,4); ctx.fill();
    // eyes
    ctx.fillStyle="#fff";
    ctx.beginPath(); ctx.arc(hx+CELL*.35,hy+CELL*.35,2,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(hx+CELL*.65,hy+CELL*.35,2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#1a1a2e";
    ctx.beginPath(); ctx.arc(hx+CELL*.35,hy+CELL*.35,1,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(hx+CELL*.65,hy+CELL*.35,1,0,Math.PI*2); ctx.fill();
  }

  $effect(() => {
    if (!canvasEl) return;
    lastTick = performance.now();
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  });

  // ---- tooltip ----
  let tooltip = $state<{x:number;y:number;text:string}|null>(null);
  function show(e:MouseEvent, cell:Cell) {
    const r=(e.target as HTMLElement).getBoundingClientRect();
    tooltip={x:r.left+r.width/2, y:r.top-32, text:`${cell.date}  ${cell.count} 篇`};
  }
</script>

<div class="hm-wrap">
  <div class="hm-inner">
    <div class="hm-months" style="margin-left:30px;position:relative;height:18px;">
      {#each monthLabels as ml}
        <span class="hm-month" style="position:absolute;left:{ml.col*(CELL+GAP)}px;">{ml.label}</span>
      {/each}
    </div>
    <div style="display:flex;">
      <div class="hm-days">
        {#each DAY_LABELS as day,i}
          <span class="hm-day" style="height:{CELL}px;line-height:{CELL}px;">{i%2===0?day:''}</span>
        {/each}
      </div>
      <div style="position:relative;width:{WEEKS*(CELL+GAP)-GAP}px;height:{7*(CELL+GAP)-GAP}px;">
        <div style="display:flex;gap:{GAP}px;position:absolute;inset:0;pointer-events:auto;">
          {#each Array(WEEKS) as _,col}
            <div style="display:flex;flex-direction:column;gap:{GAP}px;">
              {#each Array(7) as _,row}
                {@const cell=grid[row]?.[col]}
                {#if cell}
                  <div class="hm-cell hm-show"
                    class:hm-today={cell.date===todayStr}
                    style="width:{CELL}px;height:{CELL}px;
                      --c-light:{LIGHT[eatenMap.has(cell.date)?cell.level:0]};
                      --c-dark:{DARK[eatenMap.has(cell.date)?cell.level:0]};"
                    onmouseenter={(e)=>show(e,cell)}
                    onmouseleave={()=>tooltip=null}
                    role="img" aria-label={`${cell.date}: ${cell.count} 篇`}
                  ></div>
                {:else}
                  <div style="width:{CELL}px;height:{CELL}px;"></div>
                {/if}
              {/each}
            </div>
          {/each}
        </div>
        <canvas bind:this={canvasEl}
          width={WEEKS*(CELL+GAP)-GAP} height={7*(CELL+GAP)-GAP}
          style="position:absolute;inset:0;pointer-events:none;"
        ></canvas>
      </div>
    </div>
  </div>
  <div class="hm-legend">
    <span class="hm-leg-l">Less</span>
    {#each LIGHT as c,i}
      <div class="hm-cell hm-show hm-leg-c" style="width:12px;height:12px;--c-light:{c};--c-dark:{DARK[i]};"></div>
    {/each}
    <span class="hm-leg-l">More</span>
  </div>
  {#if tooltip}
    <div class="hm-tt" style="left:{tooltip.x}px;top:{tooltip.y}px;">{tooltip.text}</div>
  {/if}
</div>

<style>
  .hm-wrap{position:relative;margin:2rem auto;max-width:fit-content;}
  .hm-months{overflow:visible;}
  .hm-month{font-size:11px;color:var(--text-color-70);}
  .hm-days{display:flex;flex-direction:column;gap:3px;width:30px;flex-shrink:0;}
  .hm-day{font-size:10px;color:var(--text-color-70);text-align:right;padding-right:4px;}
  .hm-cell{border-radius:3px;background:var(--c-light);transition:background .4s ease;cursor:pointer;flex-shrink:0;}
  .hm-show{transform:scale(1);opacity:1;}
  .hm-cell:hover{outline:2px solid var(--link-color);outline-offset:-1px;z-index:2;}
  .hm-today{outline:2px solid var(--link-color);outline-offset:-2px;}
  :global([data-theme="dark"]) .hm-cell{background:var(--c-dark);}
  .hm-tt{position:fixed;transform:translate(-50%,-100%);background:var(--bg-color);border:1px solid var(--button-border-color);color:var(--text-color);padding:4px 8px;border-radius:6px;font-size:12px;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,.15);pointer-events:none;z-index:500;}
  .hm-legend{display:flex;align-items:center;justify-content:flex-end;gap:3px;margin-top:8px;}
  .hm-leg-c{cursor:default;}
  .hm-leg-c:hover{outline:none;}
  .hm-leg-l{font-size:11px;color:var(--text-color-70);margin:0 4px;}
  @media(max-width:768px){.hm-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;max-width:100%;}}
  canvas{image-rendering:pixelated;}
</style>
