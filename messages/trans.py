import pandas as pd
import json
from datetime import datetime
import argparse
import os

parser = argparse.ArgumentParser(description="Translate JSON using Excel translations.")
parser.add_argument('file_path', help="Path to the translation Excel file.")
args = parser.parse_args()

languages = {'영어': 'en'}

json_file_path = os.path.join(os.path.dirname(__file__), 'ko.json')
with open(json_file_path, 'r', encoding='utf-8') as f:
    ko_data = json.load(f)

def load_all_sheets(file_path):
    sheets = pd.read_excel(file_path, sheet_name=None)
    for sheet_name, sheet_df in sheets.items():
        print(f"Loaded sheet: {sheet_name}, number of rows: {sheet_df.shape[0]}")
    return sheets

def merge_sheets_from_file(file_path):
    sheets = load_all_sheets(file_path)
    merged_df = pd.concat([sheets[sheet] for sheet in sheets], ignore_index=True)
    return merged_df

merged_df = merge_sheets_from_file(args.file_path)

overall_missing_translations = []

def translate_dict(data, translations):
    if isinstance(data, dict):
        return {key: translate_dict(value, translations) for key, value in data.items()}
    elif isinstance(data, list):
        return [translate_dict(item, translations) for item in data]
    elif isinstance(data, str):
        if data not in translations and data not in overall_missing_translations:
            overall_missing_translations.append(data)
            return
        return translations.get(data, data)
    else:
        return

def translate_and_dump(ko_data, merged_df, languages):
    for lang_name, lang_code in languages.items():
        translations = merged_df.set_index('한글').to_dict()[lang_name]
        translated_data = translate_dict(ko_data, translations)

        output_file = f'{lang_code}.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(translated_data, f, ensure_ascii=False, indent=4)
        print(f"Translation complete for {lang_name} with missing entries noted in {output_file}.")

def get_timestamped_filename(prefix, extension):
    current_time = datetime.now().strftime("%y%m%d_%H%M")
    return f"{current_time}_{prefix}.{extension}"

translate_and_dump(ko_data, merged_df, languages)

missing_translations_filename = get_timestamped_filename("missing_translations", "json")
with open(missing_translations_filename, 'w', encoding='utf-8') as f:
    json.dump(overall_missing_translations, f, ensure_ascii=False, indent=4)

print(f"All missing translations have been noted in {missing_translations_filename}.")
