const cheerio = require("cheerio");

async function printGridFromDoc(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);

    const table = $("table").first();
    if (!table || table.length === 0) {
      console.error("No table found in the document.");
      return;
    }

    const rows = table.find("tr");
    if (rows.length === 0) {
      console.error("No table rows found in the document.");
      return;
    }

    const entries = [];

    rows.each((i, row) => {
      const cells = $(row).find("td");
      if (cells.length < 3) return;

      const xText = $(cells[0]).text().trim();
      const charText = $(cells[1]).text().trim();
      const yText = $(cells[2]).text().trim();

      const x = parseInt(xText, 10);
      const y = parseInt(yText, 10);

      if (!isNaN(x) && !isNaN(y)) {
        entries.push({ x, y, char: charText });
      }
    });

    if (entries.length === 0) {
      console.error("No valid data entries found.");
      return;
    }

    let maxX = 0, maxY = 0;
    for (const entry of entries) {
      if (entry.x > maxX) maxX = entry.x;
      if (entry.y > maxY) maxY = entry.y;
    }

    const grid = [];
    for (let y = 0; y <= maxY; y++) {
      grid[y] = [];
      for (let x = 0; x <= maxX; x++) {
        grid[y][x] = ' ';
      }
    }

    for (const entry of entries) {
      grid[entry.y][entry.x] = entry.char;
    }

    for (let y = 0; y <= maxY; y++) {
      console.log(grid[y].join(''));
    }
  } catch (error) {
    console.error("Error fetching or processing the document:", error);
  }
}

const docURL = "https://docs.google.com/document/d/e/2PACX-1vQGUck9HIFCyezsrBSnmENk5ieJuYwpt7YHYEzeNJkIb9OSDdx-ov2nRNReKQyey-cwJOoEKUhLmN9z/pub";
printGridFromDoc(docURL);
