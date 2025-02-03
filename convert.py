import os
import json
import asciidoctor

def convert_asciidoc_to_json(file_path):
    # Load the AsciiDoc file
    asciidoctor_api = asciidoctor.AsciidoctorAPI()
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Parse the AsciiDoc content
    document = asciidoctor_api.load(content)
    return {
        "filePath": os.path.relpath(file_path, start=os.getcwd()),
        "title": document.get_title(),
        "attributes": document.get_attributes(),
        "blocks": parse_blocks(document.get_blocks())
    }

def parse_blocks(blocks):
    result = []
    for block in blocks:
        block_data = {
            "context": block.get_context(),
            "content": block.get_content(),
            "attributes": block.get_attributes()
        }
        if block.get_blocks():
            block_data["blocks"] = parse_blocks(block.get_blocks())
        result.append(block_data)
    return result

def process_folder_recursively(folder_path):
    results = []
    for root, _, files in os.walk(folder_path):
        for file in files:
            if file.endswith('.adoc'):
                file_path = os.path.join(root, file)
                json_content = convert_asciidoc_to_json(file_path)
                results.append(json_content)
    return results

def main():
    input_folder = './docs'  # Replace with your AsciiDoc folder path
    output_file = './output.json'     # Output JSON file

    try:
        json_result = process_folder_recursively(input_folder)
        with open(output_file, 'w', encoding='utf-8') as outfile:
            json.dump(json_result, outfile, indent=2)
        print(f"Conversion successful! Combined JSON saved to {output_file}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()

