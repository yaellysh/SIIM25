import requests
import json
from dotenv import load_dotenv
import os
import re

load_dotenv()

api_key = os.getenv("API_KEY")
FHIR_SERVER_URL = "https://your.fhir.server"
MODEL_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"

def load_clinical_note(filepath):
    with open(filepath, 'r') as file:
        return file.read()

def extract_fhir_observations(narrative_text, system_prompt):
    data = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": system_prompt + "\n\nInput narrative:\n" + narrative_text}]
            }
        ]
    }

    headers = {"Content-Type": "application/json"}
    response = requests.post(f"{MODEL_URL}?key={api_key}", headers=headers, json=data)
    response_json = response.json()

    if "candidates" not in response_json:
        raise ValueError(response_json.get("error", "Unknown Gemini API error."))

    raw_text = response_json["candidates"][0]["content"]["parts"][0]["text"]

    cleaned = raw_text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[len("```json"):].strip()
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3].strip()

    cleaned_no_comments = re.sub(r"//.*", "", cleaned)
    cleaned_safe = re.sub(r"[\x00-\x1F\x7F]", "", cleaned_no_comments)

    return json.loads(cleaned_safe)

if __name__ == "__main__":
    narrative = load_clinical_note("example_narrative.txt")
    print("Extracting FHIR Observations from narrative...\n")
    system_prompt = """
    You are a medical data structuring assistant. Convert the given narrative medical text into a JSON array of FHIR-compliant Observation resources.
    Use RSNA/ACR Common Data Elements wherever appropriate. Include relevant coding (e.g., SNOMED, LOINC) if applicable.
    Keep it structured and assume this will be part of a FHIR Imaging Problem List. Return only valid JSON. Do not include placeholder strings like "http:" or "YYYY-MM-DD". Remove incomplete values.
    """
    structured_data = extract_fhir_observations(narrative, system_prompt)

    print("Parsed FHIR Observations:\n")
    print(json.dumps(structured_data, indent=2))

    with open("output_fhir_observations.json", "w") as outfile:
        json.dump(structured_data, outfile, indent=2)

    print("\nFHIR Observation(s) successfully extracted and saved to output_fhir_observations.json.")
