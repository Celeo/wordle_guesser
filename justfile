default: run

run:
    @deno run --allow-read=words.txt main.ts

download_words:
    @wget https://raw.githubusercontent.com/dwyl/english-words/master/words.txt -O words.txt

compile:
    @deno compile --allow-read=words.txt main.ts
