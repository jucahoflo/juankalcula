import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Servidor activo" });
});

function decodeDuckDuckGoRedirect(url) {
  try {
    const parsed = new URL(url, "https://duckduckgo.com");
    const uddg = parsed.searchParams.get("uddg");
    return uddg ? decodeURIComponent(uddg) : url;
  } catch {
    return url;
  }
}

function getHostname(link) {
  try {
    return new URL(link).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function isBlockedPdfDomain(link) {
  const blockedDomains = [
    "onsemi.com",
    "www.onsemi.com"
  ];

  return blockedDomains.includes(getHostname(link));
}

function isLikelyPdf(link) {
  return link.toLowerCase().includes(".pdf");
}

function scorePdfLink(link) {
  const hostname = getHostname(link);
  let score = 0;

  const preferredDomains = [
    "alldatasheet.com",
    "www.alldatasheet.com",
    "datasheetcatalog.com",
    "www.datasheetcatalog.com",
    "ti.com",
    "www.ti.com",
    "nxp.com",
    "www.nxp.com",
    "infineon.com",
    "www.infineon.com",
    "microchip.com",
    "www.microchip.com",
    "analog.com",
    "www.analog.com",
    "vishay.com",
    "www.vishay.com",
    "fairchildsemi.com",
    "www.fairchildsemi.com"
  ];

  if (preferredDomains.includes(hostname)) score += 100;
  if (hostname.includes("alldatasheet")) score += 90;
  if (hostname.includes("datasheetcatalog")) score += 80;
  if (link.toLowerCase().endsWith(".pdf")) score += 40;
  if (link.toLowerCase().includes("/pdf/")) score += 20;
  if (link.toLowerCase().includes("datasheet")) score += 10;

  return score;
}

function normalizePart(rawPart) {
  let part = rawPart.toUpperCase().trim();

  if (/^\d+$/.test(part)) {
    part = "2N" + part;
  }

  return part;
}

function labelFromUrl(link, part) {
  const host = getHostname(link);

    if (host.includes("ti.com")) return `TI - ${part}`;
  if (host.includes("nxp.com")) return `NXP - ${part}`;
  if (host.includes("infineon.com")) return `Infineon - ${part}`;
  if (host.includes("microchip.com")) return `Microchip - ${part}`;
  if (host.includes("analog.com")) return `Analog - ${part}`;
  if (host.includes("vishay.com")) return `Vishay - ${part}`;
  if (host.includes("fairchildsemi.com")) return `Fairchild - ${part}`;
  if (host.includes("alldatasheet.com")) return `AllDataSheet - ${part}`;
  if (host.includes("datasheetcatalog.com")) return `DatasheetCatalog - ${part}`;

  return `${host} - ${part}`;
}

async function findPdfOptions(part) {
  const queries = [
    `${part} datasheet filetype:pdf`,
    `${part} pdf datasheet`,
    `${part} datasheet pdf`
  ];

  let allLinks = [];

  for (const query of queries) {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await response.text();

    const links = [...html.matchAll(/href="([^"]+)"/gi)]
      .map(match => match[1])
      .map(decodeDuckDuckGoRedirect)
      .filter(link => /^https?:\/\//i.test(link))
      .filter(link => isLikelyPdf(link))
      .filter(link => !isBlockedPdfDomain(link));

    allLinks.push(...links);
  }

  const uniqueLinks = [...new Set(allLinks)];
  uniqueLinks.sort((a, b) => scorePdfLink(b) - scorePdfLink(a));

  return uniqueLinks.slice(0, 6).map(link => ({
    label: labelFromUrl(link, part),
    url: link
  }));
}

app.get("/api/datasheet", async (req, res) => {
  const rawPart = (req.query.part || "").trim();

  if (!rawPart) {
    return res.status(400).json({
      ok: false,
      error: "Falta el parámetro part"
    });
  }

  const part = normalizePart(rawPart);

  try {
    const options = await findPdfOptions(part);

    if (options.length > 0) {
      return res.json({
        ok: true,
        part,
        mode: "pdf",
        pdfUrl: options[0].url,
        options
      });
    }

    const fallbackUrl = `https://www.alldatasheet.com/view.jsp?Searchword=${encodeURIComponent(part)}`;

    return res.json({
      ok: true,
      part,
      mode: "search",
      pdfUrl: fallbackUrl,
      options: []
    });

  } catch (error) {
    const fallbackUrl = `https://www.alldatasheet.com/view.jsp?Searchword=${encodeURIComponent(part)}`;

    return res.json({
      ok: true,
      part,
      mode: "search",
      pdfUrl: fallbackUrl,
      options: []
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});