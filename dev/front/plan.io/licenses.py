import json

# Open the SBOM file with the correct encoding (UTF-8)
with open('sbom.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Extract licenses
licenses = []
for component in data.get('components', []):
    component_licenses = component.get('licenses', [])
    for license_info in component_licenses:
        license_id = license_info.get('license', {}).get('id', 'No license')
        licenses.append({'name': component['name'], 'version': component['version'], 'license': license_id})

# Print the results
for item in licenses:
    print(f"{item['name']} ({item['version']}): {item['license']}")
