import json
import os
from dotenv import load_dotenv
from groq import Groq

def check_api():
    load_dotenv()
    api_key = os.getenv("API")
    if not api_key:
        print("Error: API key not found.")
        quit()
    return api_key

def open_file():
    try:
        with open('./database/temp.json', 'r') as latest_data:
            data = json.load(latest_data)
            text = data[0]['text']
            # print(text)
            return text
    except Exception as e:
        print(f"error: {e}")
        quit()

def open_prev():
    try:
        with open('./database/temp_user_aura.json', 'r') as json_file:
            return json.load(json_file)
    except FileNotFoundError:
        return {} 
    except Exception as e:
        print(f"Error reading temp_user_aura.json: {e}")
        return {}


def extract(api, text, prev):
    client = Groq(api_key=api)

    try:
        response = client.chat.completions.create(
            model="mistral-saba-24b",
            messages=[
                {"role": "system", "content": """ You are an AI that extracts personality traits from text, focusing only on details that are essential to replicating a person’s personality. Your response must be in pure JSON format only—no explanations, no additional text. The JSON must follow this structure:
                                                {
                                                "Openness": { "Description": "..." },
                                                "Conscientiousness": { "Description": "..." },
                                                "Extraversion": { "Description": "..." },
                                                "Agreeableness": { "Description": "..." },
                                                "Neuroticism": { "Description": "..." },
                                                "Relations": { "Description": "..." }
                                                }
                                                The "Description" should provide a brief explanation based on the given text and should include important details related to person based on the OCEAN trait method.
                                                Do not include scores, extra commentary, or anything outside the JSON structure. """},
                {"role": "user", "content": text}
            ],
            temperature=0.7
        )
        response  = response.choices[0].message.content.replace("```json", "").replace("```", "").strip()
        print("Raw data", response)

        try:
            return json.loads(response)
        except Exception as e:
            print("Error: API response is not valid JSON.")
            return None
    except Exception as e:
        print(f"API request failed: {e}")
        return None

def merge_data(prev_data, new_data):
    if not prev_data:
        return new_data 

    updated_data = {}
    for key in ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism"]:
        if key in new_data:
            updated_data[key] = new_data[key]  
        elif key in prev_data:
            updated_data[key] = prev_data[key]  

    return updated_data

def save(data):
    try:
        with open('./database/temp_user_aura.json', 'w') as json_file:
            json.dump(data, json_file, indent=4)
        print("Personality traits saved")
    except Exception as e:
        print(f"Error saving file: {e}")

def main():
    api = check_api()
    text = open_file()
    if text:
        prev = open_prev() 
        new_data = extract(api, text, prev) 
        
        if new_data:
            merged_data = merge_data(prev, new_data)  
            save(merged_data)  

if __name__ == "__main__":
    main()
