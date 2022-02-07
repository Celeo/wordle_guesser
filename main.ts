import Ask from "https://deno.land/x/ask@1.0.6/mod.ts";
import { WORDS } from "./words.ts";

const ASK = new Ask();
const NUMBER_OF_ROUNDS = 6;
const WORD_SIZE = 5;
const WORD_REGEX = /^[a-z]{5}$/;
const RESULT_REGEX = /^(p|s|n){5}$/;

interface GameState {
  remainingWords: Array<string>;
}

/**
 * Process a single round.
 */
async function handleRound(gameState: GameState): Promise<void> {
  const { guess } = await ASK.input({
    name: "guess",
    message: "Enter your 5-letter guess",
    suffix: ":",
    validate: (input) => !!(input && WORD_REGEX.test(input)),
  });
  const { data } = await ASK.input({
    name: "data",
    message: "Enter your results for each column",
    suffix: ":",
    validate: (input) => !!(input && RESULT_REGEX.test(input)),
  });
  if (guess === undefined || data == undefined) {
    throw Error("unreachable");
  }

  for (let index = 0; index < WORD_SIZE; index++) {
    switch (data[index]) {
      case "p": {
        gameState.remainingWords = gameState.remainingWords.filter((word) =>
          word[index] === guess[index]
        );
        break;
      }
      case "s": {
        gameState.remainingWords = gameState.remainingWords.filter((word) =>
          word.includes(guess[index]) && word[index] !== guess[index]
        );
        break;
      }
      case "n": {
        gameState.remainingWords = gameState.remainingWords.filter((word) =>
          !word.includes(guess[index])
        );
        break;
      }
      default: {
        throw Error("unreachable");
      }
    }
  }
}

/**
 * Entry point function.
 */
async function main(): Promise<void> {
  const gameState: GameState = {
    remainingWords: [...WORDS],
  };

  console.log(
    "Data results are:\np: positioned correctly\ns: correct letter, wrong position\nn: letter is not in the word\n",
  );

  for (let round = 1; round <= NUMBER_OF_ROUNDS; round++) {
    console.log(`Round ${round}`);
    console.log(`Remaining words: ${gameState.remainingWords.length}`);
    if (gameState.remainingWords.length < 100) {
      console.log(gameState.remainingWords);
    } else {
      console.log(
        `Try one of these: ${gameState.remainingWords.slice(0, 5).join(", ")}`,
      );
    }
    console.log();
    await handleRound(gameState);
    if (gameState.remainingWords.length === 1) {
      console.log(`Only 1 word remains: ${gameState.remainingWords[0]}`);
      return;
    } else if (gameState.remainingWords.length === 0) {
      console.log("No words remain, did something go wrong?");
    }
  }
  console.log(
    `Rounds complete, there are ${gameState.remainingWords.length} words remaining`,
  );
  if (gameState.remainingWords.length > 0) {
    console.log(gameState.remainingWords);
  }
}

// entry point
if (import.meta.main) {
  await main();
}
