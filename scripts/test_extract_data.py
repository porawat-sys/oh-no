import importlib.util
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

spec = importlib.util.spec_from_file_location("extract_data", ROOT / "scripts" / "extract_data.py")
extract_data = importlib.util.module_from_spec(spec)
spec.loader.exec_module(extract_data)


def test_collect_unique_values_skips_empty_and_duplicates():
    assert extract_data.collect_unique_values(["ดิน", "ดิน", "  ", "ต้นไม้/ตอไม้"]) == ["ดิน", "ต้นไม้/ตอไม้"]


def test_is_unknown_scientific_name():
    assert extract_data.is_unknown_scientific_name("ระบุไม่ได้")
    assert extract_data.is_unknown_scientific_name("  ระบุไม่ได้  ")
    assert not extract_data.is_unknown_scientific_name("Amanita farinosa")


if __name__ == "__main__":
    test_collect_unique_values_skips_empty_and_duplicates()
    test_is_unknown_scientific_name()
    print("extract_data tests passed")
