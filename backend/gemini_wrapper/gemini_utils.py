from google import genai
from google.genai.errors import ServerError
import os
from dotenv import load_dotenv
from typing import Dict, List
import json
import time
import re

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)


DEFAULT_EMOTION_PROBS = {
    "happy": 0.0,
    "sad": 0.0,
    "fear": 0.0,
    "disgust": 0.0,
    "anger": 0.0
}

DEFAULT_ADVICE = [
    "Take a moment to breathe and reflect on your feelings.",
    "Remember that it's okay to feel this way.",
    "Consider talking to someone you trust about how you're feeling.",
    "Try to engage in an activity that usually brings you joy.",
    "Be kind to yourself during this time."
]

def get_emotion_probabilities(text: str) -> Dict[str, float]:
    """
    Analyze text and return probabilities for different emotions using Gemini API.

    Args:
        text (str): The input text to analyze

    Returns:
        Dict[str, float]: Dictionary containing emotion probabilities
    """

    mood_prompt = f"""
You are a sentiment classifier. Given a user's input text, classify it into one or more of the following moods: happy, sad, fear, disgust, and anger.

Return the result as a JSON object with keys as the moods and values as probabilities between 0 and 1 (representing the likelihood of each emotion). Probabilities should sum to 1.

Do not include any text before or after the JSON. Only output the raw JSON.

Only return a valid JSON object with the following structure:

{{
    "happy": <float>,
    "sad": <float>,
    "fear": <float>,
    "disgust": <float>,
    "anger": <float>
}}

Here is the input text: "{text}"
"""

    for attempt in range(5):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash-preview-05-20",
                contents=mood_prompt
            )
            raw_output = re.sub(r"^```json|```$", "", response.text.strip(), flags=re.MULTILINE).strip()
            emotion_probs = json.loads(raw_output)
            
            # print("Raw output:", emotion_probs)

            if all(k in emotion_probs for k in DEFAULT_EMOTION_PROBS.keys()):
                # print("Successfully parsed JSON:", emotion_probs)
                return {k: float(emotion_probs.get(k, 0.0)) for k in DEFAULT_EMOTION_PROBS}
            else:
                # print("Incomplete response keys:", emotion_probs)   
                return DEFAULT_EMOTION_PROBS

        except ServerError as e:
            print(f"[Attempt {attempt + 1}] Gemini API is overloaded. Retrying in 5 seconds...")
            time.sleep(5)
        except json.JSONDecodeError:
            print("Failed to parse JSON:", response.text)
            return DEFAULT_EMOTION_PROBS
        except Exception as e:
            print("Unexpected error:", e)
            return DEFAULT_EMOTION_PROBS

    print("Failed after multiple retries.")
    return DEFAULT_EMOTION_PROBS

def get_thought_advice(text: str) -> List[str]:
    """
    Generate supportive advice based on the user's input text using Gemini API.

    Args:
        text (str): The input text to analyze

    Returns:
        List[str]: List of 5 supportive advice messages
    """
    advice_prompt = f"""
You are a helpful and emotionally aware marshmallow pet who is a friend of the user. Based on the following user input, generate 5 short, supportive advice messages that are encouraging and contextually appropriate.

Advice should be relevant to the user's emotional tone and situation, and may include general well-being tips like self-care, emotional validation, or gentle reminders.

Do not make a reply to message or reference it. Just make advice with the user's input as context.

Respond only with a JSON array of 5 strings.

User input: "{text}"

Only return output in this format:

[
  "advice 1",
  "advice 2",
  "advice 3",
  "advice 4",
  "advice 5"
]
"""

    for attempt in range(5):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash-preview-05-20",
                contents=advice_prompt
            )
            raw_output = re.sub(r"^```json|```$", "", response.text.strip(), flags=re.MULTILINE).strip()
            advice_list = json.loads(raw_output)
            
            # print("Raw output:", advice_list)

            if isinstance(advice_list, list) and len(advice_list) == 5:
                # print("Successfully parsed JSON:", advice_list)
                return advice_list
            else:
                print("Invalid response format")
                return DEFAULT_ADVICE

        except ServerError as e:
            print(f"[Attempt {attempt + 1}] Gemini API is overloaded. Retrying in 5 seconds...")
            time.sleep(5)
        except json.JSONDecodeError:
            print("Failed to parse JSON:", response.text)
            return DEFAULT_ADVICE
        except Exception as e:
            print("Unexpected error:", e)
            return DEFAULT_ADVICE

    print("Failed after multiple retries.")
    return DEFAULT_ADVICE

# Test functions
if __name__ == "__main__":
    test_text = "I am feeling happy today"
    print("Emotion probabilities:", get_emotion_probabilities(test_text))
    print("\nAdvice:", get_thought_advice(test_text))