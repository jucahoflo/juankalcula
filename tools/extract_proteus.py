import os
import json
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LIB_PATH = os.path.join(BASE_DIR, "..", "LIBRARY")
OUTPUT_FILE = os.path.join(BASE_DIR, "..", "data", "semiconductors.json")

components = []

def looks_like_semiconductor(name):
    name = name.upper().strip()

    prefixes = [
        "BC", "BD", "BF", "2N", "1N", "IRF", "TIP", "LM", "TL",
        "MJE", "BZX", "BUZ", "MJ", "PN", "TDA", "UA", "NE", "MC"
    ]

    if any(name.startswith(p) for p in prefixes):
        return True

    semiconductor_words = [
        "TRANSISTOR", "DIODE", "MOSFET", "SCR", "TRIAC",
        "OPAMP", "REGULATOR", "THYRISTOR", "IGBT"
    ]

    if any(word in name for word in semiconductor_words):
        return True

    return False

def clean_name(text):
    return re.sub(r'[^A-Za-z0-9\-\_\.]', '', text).strip()

def parse_lib_file(file_path):
    found = []

    try:
        with open(file_path, "r", encoding="latin-1", errors="ignore") as f:
            lines = f.readlines()
    except Exception as e:
        print(f"Error leyendo {file_path}: {e}")
        return found

    for line in lines:
        line = line.strip()

        if not line:
            continue

        parts = line.split()

        if len(parts) < 2:
            continue

        first = parts[0].upper()
        second = clean_name(parts[1])

        if first in ["COMPONENT", "DEVICE", "PART", "SYMBOL"]:
            if second and looks_like_semiconductor(second):
                found.append({
                    "name": second.upper(),
                    "library": os.path.basename(file_path),
                    "description": "",
                    "package": "",
                    "image": "",
                    "datasheet": ""
                })

    return found

def main():
    if not os.path.exists(LIB_PATH):
        print(f"No se encontró la carpeta LIBRARY en: {LIB_PATH}")
        return

    print(f"Leyendo librerías desde: {LIB_PATH}")

    for root, dirs, files in os.walk(LIB_PATH):
        for file in files:
            if file.upper().endswith(".LIB"):
                full_path = os.path.join(root, file)
                print(f"Procesando: {file}")
                result = parse_lib_file(full_path)
                components.extend(result)

    unique = {}
    for c in components:
        unique[c["name"]] = c

    final_data = sorted(unique.values(), key=lambda x: x["name"])

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(final_data, f, indent=2, ensure_ascii=False)

    print(f"\nProceso terminado.")
    print(f"Total extraídos: {len(final_data)}")
    print(f"JSON generado en: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
