# NYC TAXI DATA EXPLORER

This project uses DuckDB and parquets to show a 3.7+ million rows of a January 2026 taxi log

## Example GIF

## Why This Is Hard

Rendering 3.7M rows in a browser hits three limits at once: download size, memory, and DOM size.
- A JSON with 3.7M rows would be much heavier than the Parquet and you would have to download it and would have to be parsed in its entirety in memory before showing anything.
- DOM: 3.7M elements in the page would block it. The virtualization (TanStack Virtual) fixes this


## How It Works

This project works with different parts.
- It uses a web worker, which allows the browser to execute the SQL queries (DuckDB) without freezing the page, because it would use the main thread, it becomes asynchronous.
- It uses DuckDB and a Parquet file, DuckDB is an SQL engine that runs in the browser (Web Assembly), the filters become WHERE and each block a LIMIT/OFFSET, it speeds up the process of proccesing the file.
-Parquet is a file that is built to read it very fast because it uses a columnar format and is compressed, it only reads the rows the SQL query asks.
- It uses TansTack Virtual, with it you can render only the visible rows (20-30) even though its 3,7M, the scroll reacts as its the full length.

## Key Decisions

Initally the Parquet file was 67MB long, that was very large so i reduced it to 25MB to make it download faster, i also used a pagination of 500 rows per block, so the user can scroll and read a lot of rows without needing to bring the whole Parquet or make another SQL call

## Known Limitations

I know that the first load takes a while, especially with 4G or lower as the browser has to download all the 25MB of the file Parquet to show any roaw, also the accessibility is limited right now, and there's some distance rows in the Parquet of hundreds of miles that i decided to still show because i wanted to show the Parquet file as it is

## Tech Stack

React 19, TypeScript, Vite, Tailwind, TanStack Virtual, Comlink, DuckDB-WASM y Vitest.

## Running locally

pnpm install, pnpm dev y pnpm test.

## Data Source

NYC TLC Trip Record Data

## Roadmap

The next step is going to be a hybrid load, that takes a small portion of the Parquet that is shown first, that way you don't have to wait until all the Parquet downloads to see some rows. I will also be improving the architecture separating some effects in the components in a custom hook and make all of the accesibility requirements.