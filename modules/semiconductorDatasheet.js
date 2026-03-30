function showPdfInApp(url, part) {
    const panel = document.getElementById("pdfPanel");
    const frame = document.getElementById("pdfFrame");
    const openBtn = document.getElementById("openPdfBtn");
    const title = document.getElementById("pdfTitle");

    if (!panel || !frame || !openBtn || !title) return;

    title.innerText = `Datasheet: ${part}`;
    openBtn.href = url;
    openBtn.style.display = "inline-block";
    frame.src = url;
    panel.classList.remove("hidden");
}

function renderPdfOptions(options, part) {
    const container = document.getElementById("pdfOptions");
    if (!container) return;

    if (!options || options.length === 0) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML = options.map((item, index) => `
        <button class="pdf-option-btn ${index === 0 ? "active" : ""}" data-url="${item.url}">
            ${item.label}
        </button>
    `).join("");

    const buttons = container.querySelectorAll(".pdf-option-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            showPdfInApp(btn.dataset.url, part);
        });
    });
}

function hidePdfInApp() {
    const panel = document.getElementById("pdfPanel");
    const frame = document.getElementById("pdfFrame");
    const openBtn = document.getElementById("openPdfBtn");
    const title = document.getElementById("pdfTitle");
    const options = document.getElementById("pdfOptions");

    if (panel) panel.classList.add("hidden");
    if (frame) frame.src = "";
    if (openBtn) {
        openBtn.href = "#";
        openBtn.style.display = "none";
    }
    if (title) title.innerText = "Datasheet";
    if (options) options.innerHTML = "";
}

async function searchSemiconductor(code) {
    if (!code || code === "0") {
        hidePdfInApp();
        return { ok: false, html: "Ingrese un componente" };
    }

    let part = code.toUpperCase().trim();

    if (/^\d+$/.test(part)) {
        part = "2N" + part;
    }

    try {
        const res = await fetch(`http://localhost:3000/api/datasheet?part=${encodeURIComponent(part)}`);
        const data = await res.json();

        console.log("Respuesta datasheet:", data);

        if (!data.ok || !data.pdfUrl) {
            hidePdfInApp();
            return { ok: false, html: "No se encontró datasheet" };
        }

        if (data.mode === "pdf") {
            showPdfInApp(data.pdfUrl, data.part);
            renderPdfOptions(data.options || [], data.part);

            return {
                ok: true,
                html: `PDF cargado: ${data.part}`
            };
        }

        hidePdfInApp();

        return {
            ok: true,
            html: `<a href="${data.pdfUrl}" target="_blank" class="pdf-link">Abrir búsqueda de datasheet: ${data.part}</a>`
        };

    } catch (err) {
        console.error(err);
        hidePdfInApp();
        return { ok: false, html: "No se pudo conectar al servidor" };
    }
}