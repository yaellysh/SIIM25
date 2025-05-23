import requests
import json
from dotenv import load_dotenv
import os
import re

load_dotenv()

api_key = os.getenv("API_KEY")
FHIR_SERVER_URL = "https://your.fhir.server"
MODEL_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

def load_clinical_note(filepath):
    with open(filepath, 'r') as file:
        return file.read()

def gemini_call(system_prompt):
    data = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": system_prompt}]
            }
        ]
    }

    headers = {"Content-Type": "application/json"}
    response = requests.post(f"{MODEL_URL}?key={api_key}", headers=headers, json=data)
    response_json = response.json()

    output_text = "".join(p["text"] for p in response_json["candidates"][0]["content"]["parts"])

    return output_text

def read_file_content(filepath):
    with open(filepath, 'r') as file:
        return file.read()

def extract_related(context_path, rad_reports, past_reports):
    with open(context_path, 'r') as file:
        context_content = file.read()

    rad_reports_content = ""
    for idx, filename in enumerate(rad_reports, start=1):
        with open(filename, 'r') as file:
            rad_reports_content += f"Report {idx}:\n" + file.read() + "\n"

    past_reports_content = ""
    for idx, filename in enumerate(past_reports, start=1):
        with open(filename, 'r') as file:
            past_reports_content += f"Report {idx}:\n" + file.read() + "\n"

    system_prompt = '''
        You are a medical professional assigned the task of reviewing previous patient reports and extracting information relevant to the context
        of the problem in the current scenario/report. You will be provided with a context, either a file or a string, 
        and you need to extract the related information from the provided text.
        Relevent information is anything that might reference or be related to the topic from a clinical lens.
    '''

    ground_rules = '''Ground rules: 
        - We want the output to be a list of information from past and radiology reports that are relevant to the current patient context. \n
        - Extracted information should be presented retaining as much context as possible, as a list of unstructured elements. \n
    '''

    context_prompt = f"Here is the current patient context:\n{context_content}\n\n"
    rad_reports_prompt = f"Here are the radiology reports:\n{rad_reports_content}\n\n"
    past_reports_prompt = f"Here are the past history and FHIR resources:\n{past_reports_content}\n\n"

    system_prompt += ground_rules + context_prompt + rad_reports_prompt + past_reports_prompt

    gemini_call(system_prompt)

def output_cleaning(output_cleaning):
    lines = output_cleaning.splitlines()
    if lines[0].startswith("```"):
        lines = lines[1:]
    if lines[-1].startswith("```"):
        lines = lines[:-1]

    # 3) Reassemble just the JSON block
    json_text = "\n".join(lines)

    # 4) Parse into a Python dict
    data = json.loads(json_text)

    # 5) Pretty-print with real indentation and line breaks
    output = json.dumps(data, indent=4)
    return output

def format_response(extracted_info, cdes, model_obvs):

    with open(cdes, 'r') as file:
        cdes_content = file.read()

    with open(model_obvs, 'r') as file:
        model_obvs_content = file.read()

    system_prompt = '''
        You are a medical professional assigned the task of formatting the extracted information from previous patient reports based 
        off the structure of the provided example FHIR structured observation, using CDEs from the list of Common Data Elements (CDEs). 
    '''

    ground_rules = '''Ground rules: 
        - The output should be a FHIR observation resource in JSON format. \n
        - Do not include any extraneous information or comments. \n
        - Be as thorough as possible in the extraction. \n
        - The output should be a valid JSON object. \n
    '''

    extracted_info_prompt = f"Here is the extracted information:\n{extracted_info}\n\n"
    cdes_prompt = f"Here are the Common Data Elements (CDEs):\n{cdes_content}\n\n"
    model_obvs_prompt = f"Here is an example FHIR observation representing the CDEs:\n{model_obvs_content}\n\n"

    system_prompt += ground_rules + extracted_info_prompt + cdes_prompt + model_obvs_prompt

    return gemini_call(system_prompt)


if __name__ == "__main__":
    extracted_info = extract_related("model/documents/patient_current.json", 
                                     ["model/documents/rad_reports.txt"], 
                                     ["model/documents/patient_history.json"]
                    )
    formatted_response = format_response(extracted_info, 
                                         "model/documents/MR_Knee_CDEs_Formatted_Filled.json", 
                                         "model/documents/FHIR_Observation_Knee_MRI.json"
                        )
    

print(output_cleaning(formatted_response))