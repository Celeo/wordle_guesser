default: run

run:
    @deno run --allow-read=words.txt main.ts

compile:
    @deno compile --allow-read=words.txt main.ts
