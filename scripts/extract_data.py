"""
extract_data.py (เวอร์ชันแก้ไข - ดึงรูปด้วยการแกะ XML เองแทนการพึ่ง openpyxl._images)
----------------
แปลงไฟล์ 1.xlsx - 7.xlsx (ผลสำรวจเห็ดเขาหลวง) ให้เป็น:
  - data/round-1.json ... round-7.json
  - data/summary.json
  - public/images/round-1/ ... round-7/  (รูปเห็ดที่ดึงออกจากไฟล์ excel)

วิธีรัน:
    pip install openpyxl --break-system-packages
    python3 scripts/extract_data.py

หมายเหตุ: เวอร์ชันนี้ไม่พึ่งพา worksheet._images ของ openpyxl (บางเครื่อง/บาง
environment คืนค่าว่างแม้ไฟล์จะมีรูปจริง) แต่แกะไฟล์ xlsx (ซึ่งเป็น zip)
แล้วอ่าน xl/drawings/drawingN.xml + rels โดยตรงเพื่อหาว่ารูปไหนอยู่แถวไหน
วิธีนี้เสถียรกว่าและได้ผลลัพธ์เหมือนกันทุกเครื่อง
"""

import json
import os
import re
import statistics
import zipfile
import xml.etree.ElementTree as ET
from openpyxl import load_workbook

# ---------- ตั้งค่า path ----------
SOURCE_DIR = "source-data"       # โฟลเดอร์ที่เก็บไฟล์ 1.xlsx - 7.xlsx
DATA_OUT_DIR = "data"
IMAGES_OUT_DIR = os.path.join("public", "images")

THAI_DATES = {
    1: "22 พฤศจิกายน 2568",
    2: "29 ธันวาคม 2568",
    3: "16 มกราคม 2569",
    4: "14 กุมภาพันธ์ 2569",
    5: "7 พฤษภาคม 2569",
    6: "18 มิถุนายน 2569",
    7: "18 กรกฎาคม 2569",
}

# คอลัมน์ (index เริ่มที่ 0) ตามโครงสร้างไฟล์จริง
COL_POINT = 0
COL_IMAGE = 1
COL_FAMILY = 2
COL_SCI_NAME = 3
COL_LOCAL_NAME = 4
COL_AMOUNT = 5
COL_GROUP = 6
COL_ORIGIN = 7
COL_ROLE = 8
COL_EDIBILITY = 9
COL_TEMP = 10
COL_HUMIDITY = 11

NS = {
    "xdr": "http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "rel": "http://schemas.openxmlformats.org/package/2006/relationships",
}


def normalize_name(name):
    if not name:
        return ""
    return re.sub(r"\s+", " ", str(name).strip())


def find_data_end_row(ws):
    for row_idx in range(4, ws.max_row + 1):
        val = ws.cell(row=row_idx, column=1).value
        if val and "วิเคราะห์ข้อมูลในภาพรวม" in str(val):
            return row_idx - 1
    return ws.max_row


def get_row_to_media_map(xlsx_path, sheet_index=1):
    """แกะไฟล์ xlsx (zip) หา mapping {แถว: [path ของรูปใน zip]} โดยตรงจาก XML
    ไม่พึ่งพา openpyxl._images"""
    with zipfile.ZipFile(xlsx_path) as z:
        sheet_rels_path = f"xl/worksheets/_rels/sheet{sheet_index}.xml.rels"
        if sheet_rels_path not in z.namelist():
            return {}

        with z.open(sheet_rels_path) as f:
            rels_xml = ET.parse(f)

        drawing_target = None
        for rel in rels_xml.findall(".//rel:Relationship", NS):
            if "drawing" in rel.attrib.get("Type", ""):
                drawing_target = rel.attrib["Target"]
        if not drawing_target:
            return {}

        drawing_path = "xl/" + drawing_target.replace("../", "")
        drawing_rels_path = drawing_path.replace("drawings/", "drawings/_rels/") + ".rels"

        rid_to_media = {}
        if drawing_rels_path in z.namelist():
            with z.open(drawing_rels_path) as f:
                drels_xml = ET.parse(f)
            for rel in drels_xml.findall(".//rel:Relationship", NS):
                target = rel.attrib["Target"]
                rid_to_media[rel.attrib["Id"]] = "xl/" + target.replace("../", "")

        with z.open(drawing_path) as f:
            dxml = ET.parse(f)

        row_to_media = {}
        for anchor_tag in ["twoCellAnchor", "oneCellAnchor"]:
            for anchor in dxml.findall(f".//xdr:{anchor_tag}", NS):
                from_el = anchor.find("xdr:from", NS)
                if from_el is None:
                    continue
                row_el = from_el.find("xdr:row", NS)
                if row_el is None:
                    continue
                row = int(row_el.text) + 1  # openpyxl/excel นับแถวเริ่มที่ 1

                blip = anchor.find(".//a:blip", NS)
                if blip is None:
                    continue
                embed_rid = blip.attrib.get(
                    "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed"
                )
                media_path = rid_to_media.get(embed_rid)
                if media_path:
                    row_to_media.setdefault(row, []).append(media_path)
        return row_to_media


def process_round(round_num, source_path, images_out_root):
    wb = load_workbook(source_path)
    ws = wb.active

    end_row = find_data_end_row(ws)
    row_to_media = get_row_to_media_map(source_path, sheet_index=1)

    round_img_dir = os.path.join(images_out_root, f"round-{round_num}")
    os.makedirs(round_img_dir, exist_ok=True)

    # เปิด zip ไว้รอบเดียวเพื่อดึงไบต์ของรูปแต่ละอัน
    with zipfile.ZipFile(source_path) as z:
        species = {}
        temps, humidities = [], []

        for row_idx in range(4, end_row + 1):
            point = ws.cell(row=row_idx, column=COL_POINT + 1).value
            sci_name_raw = ws.cell(row=row_idx, column=COL_SCI_NAME + 1).value
            if not point or not sci_name_raw:
                continue

            sci_key = normalize_name(sci_name_raw).lower()
            if not sci_key:
                continue

            temp = ws.cell(row=row_idx, column=COL_TEMP + 1).value
            humidity = ws.cell(row=row_idx, column=COL_HUMIDITY + 1).value
            if isinstance(temp, (int, float)):
                temps.append(temp)
            if isinstance(humidity, (int, float)):
                humidities.append(humidity)

            row_images = []
            for i, media_path in enumerate(row_to_media.get(row_idx, [])):
                ext = os.path.splitext(media_path)[1] or ".jpg"
                filename = f"round-{round_num}-row-{row_idx:04d}-{i}{ext}"
                out_path = os.path.join(round_img_dir, filename)
                if not os.path.exists(out_path):
                    try:
                        with z.open(media_path) as src, open(out_path, "wb") as dst:
                            dst.write(src.read())
                    except KeyError:
                        continue
                row_images.append(f"/images/round-{round_num}/{filename}")

            if sci_key not in species:
                species[sci_key] = {
                    "scientificName": normalize_name(sci_name_raw),
                    "localName": ws.cell(row=row_idx, column=COL_LOCAL_NAME + 1).value or "-",
                    "family": ws.cell(row=row_idx, column=COL_FAMILY + 1).value or "-",
                    "group": ws.cell(row=row_idx, column=COL_GROUP + 1).value or "-",
                    "habitat": ws.cell(row=row_idx, column=COL_ORIGIN + 1).value or "-",
                    "ecologicalRole": ws.cell(row=row_idx, column=COL_ROLE + 1).value or "-",
                    "edibility": ws.cell(row=row_idx, column=COL_EDIBILITY + 1).value or "ไม่มีข้อมูล",
                    "totalFound": 0,
                    "pointsFound": [],
                    "images": [],
                }

            rec = species[sci_key]
            rec["totalFound"] += 1
            if point not in rec["pointsFound"]:
                rec["pointsFound"].append(point)
            if row_images:
                rec["images"].extend(row_images)

    mushroom_list = []
    for rec in species.values():
        rec["pointsFoundCount"] = len(rec["pointsFound"])
        if not rec["images"]:
            rec["images"] = ["/images/placeholder-mushroom.png"]
        mushroom_list.append(rec)

    mushroom_list.sort(key=lambda m: m["scientificName"].lower())

    avg_temp = round(statistics.mean(temps), 1) if temps else None
    avg_humidity = round(statistics.mean(humidities), 1) if humidities else None

    return {
        "round": round_num,
        "date": THAI_DATES.get(round_num, ""),
        "speciesCount": len(mushroom_list),
        "mushrooms": mushroom_list,
        "avgTemperature": avg_temp,
        "avgHumidity": avg_humidity,
    }


def main():
    os.makedirs(DATA_OUT_DIR, exist_ok=True)
    os.makedirs(IMAGES_OUT_DIR, exist_ok=True)

    summary = []

    for round_num in range(1, 8):
        source_path = os.path.join(SOURCE_DIR, f"{round_num}.xlsx")
        if not os.path.exists(source_path):
            print(f"⚠️  ไม่พบไฟล์ {source_path} ข้ามรอบนี้ไป")
            continue

        print(f"กำลังประมวลผลรอบที่ {round_num} ...")
        result = process_round(round_num, source_path, IMAGES_OUT_DIR)

        out_json_path = os.path.join(DATA_OUT_DIR, f"round-{round_num}.json")
        with open(out_json_path, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=2)

        with_image_count = sum(
            1 for m in result["mushrooms"]
            if m["images"] != ["/images/placeholder-mushroom.png"]
        )
        print(f"  -> พบ {result['speciesCount']} ชนิด "
              f"(มีรูปจริง {with_image_count} ชนิด), "
              f"เฉลี่ยอุณหภูมิ {result['avgTemperature']}°C, "
              f"เฉลี่ยความชื้น {result['avgHumidity']}%")

        summary.append({
            "round": round_num,
            "date": result["date"],
            "speciesCount": result["speciesCount"],
            "avgTemperature": result["avgTemperature"],
            "avgHumidity": result["avgHumidity"],
        })

    with open(os.path.join(DATA_OUT_DIR, "summary.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)

    print("\nเสร็จสิ้น! ไฟล์ข้อมูลอยู่ในโฟลเดอร์ data/ และรูปอยู่ใน public/images/")


if __name__ == "__main__":
    main()