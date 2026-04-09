import fs from "node:fs";
import path from "node:path";

const items = [
  // set-linen (beige)
  { id: "dziVRZYOFpI", out: "public/products/set-linen/beige-1.jpg" },
  { id: "eYjD1bDMF5c", out: "public/products/set-linen/beige-2.jpg" },

  // set-linen (black)
  { id: "ZbUnHXdseWM", out: "public/products/set-linen/black-1.jpg" },
  { id: "3SiFwLWWAtE", out: "public/products/set-linen/black-2.jpg" },

  // dress-satin (red)
  { id: "EWhwQDucrqQ", out: "public/products/dress-satin/red-1.jpg" },
  { id: "VP8oBqtQcio", out: "public/products/dress-satin/red-2.jpg" },

  // dress-satin (emerald)
  { id: "kd6M1QVsu9g", out: "public/products/dress-satin/emerald-1.jpg" },
  { id: "4-OncC4SPc4", out: "public/products/dress-satin/emerald-2.jpg" },
];

async function downloadToFile(url, outFile) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} al bajar ${url}`);

  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, buf);
}

async function main() {
  console.log("📸 Descargando imágenes demo...");
  for (const it of items) {
    const url = `https://unsplash.com/photos/${it.id}/download?force=true`;
    process.stdout.write(`- ${it.out} ... `);
    await downloadToFile(url, it.out);
    console.log("OK");
  }
  console.log("\n✅ Listo. Reinicia el dev server para verlas.");
}

main().catch((e) => {
  console.error("\n❌ Error:", e.message);
  process.exit(1);
});
