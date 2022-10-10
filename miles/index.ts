import parse from "yargs-parser";
import scrape_manga from "./scrape_manga";
const args = parse(Bun.argv.slice(3));

scrape_manga();
