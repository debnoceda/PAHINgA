from google import genai
from google.genai.errors import ServerError
import os
from dotenv import load_dotenv
from typing import Dict, List
import json
import time
import re
from datetime import datetime
import holidays
import pytz

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

Return the result as a JSON object where the keys are emotion labels and the values are their respective probabilities (ranging from 0 to 1). The sum of all probabilities must equal 1. The output must have one clear dominant emotion — meaning only one emotion should have the highest probability (except if input is gibberish). There should not be multiple emotions tied for the highest value (except if input is gibberish).

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

def get_daily_greeting_advice(journal_entries: List[str], timezone: str = "Asia/Manila") -> List[str]:
    """
    Generate a list of 5 personalized greetings and advice based on all journal entries for the day,
    current time, and any holidays.

    Args:
        journal_entries (List[str]): List of journal entries for the current day
        timezone (str): Timezone for time-based greetings (default: Asia/Manila)

    Returns:
        List[str]: List of 5 personalized greeting and advice messages
    """
    # Get current time and date in Philippine timezone
    ph_tz = pytz.timezone(timezone)
    current_time = datetime.now(ph_tz)
    hour = current_time.hour
    current_date = current_time.date()
    day_of_week = current_time.strftime("%A")  # Get full day name (Monday, Tuesday, etc.)
    is_holiday = current_date in holidays.PH()
    holiday_name = holidays.PH().get(current_date) if is_holiday else None

    # Determine time period
    if 5 <= hour < 8:
        time_period = "dawn"
    elif 8 <= hour < 12:
        time_period = "morning"
    elif 12 <= hour < 14:
        time_period = "noon"
    elif 14 <= hour < 17:
        time_period = "afternoon"
    elif 17 <= hour < 22:
        time_period = "evening"
    else:  # 22-4
        time_period = "midnight"

    # Combine all journal entries
    combined_entries = "\n".join(journal_entries) if journal_entries else "No entries for today"

    greeting_prompt = f"""
You are a friendly and empathetic marshmallow pet who is a friend of the user. Generate 5 different personalized greetings and advice based on the following context:

Current time period: {time_period}
Day of week: {day_of_week}
Is holiday: {is_holiday}
Holiday name: {holiday_name if holiday_name else 'None'}
User's journal entries for today:
{combined_entries}

Generate 5 different warm, personalized greetings that:
1. Acknowledge the specific time period ({time_period})
2. Include day-of-week specific encouragement:
   - For Monday: Focus on starting the week fresh and setting positive intentions
   - For Wednesday: Mention being halfway through the week and maintaining momentum
   - For Friday: Celebrate the end of the week and upcoming weekend
   - For weekend days: Emphasize rest, relaxation, and personal time
3. If it's a holiday, include a holiday-specific greeting
4. Reference themes or emotions from their journal entries
5. Provide a single piece of supportive advice
6. End with an encouraging note

Keep each greeting concise and short (1-2 sentences) and friendly. Do not make it sound like a response to their entries, but rather a thoughtful greeting that takes their entries into account.

Return only a JSON array of 5 strings, no other text or formatting.
"""

    for attempt in range(5):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash-preview-05-20",
                contents=greeting_prompt
            )
            raw_output = re.sub(r"^```json|```$", "", response.text.strip(), flags=re.MULTILINE).strip()
            greetings = json.loads(raw_output)
            
            if isinstance(greetings, list) and len(greetings) == 5:
                return greetings
            else:
                # Fallback greetings with time-period specific messages
                if time_period == "dawn":
                    return [
                        f"Good dawn! The world is just waking up, and so are you. Let's start this day with positive energy!",
                        f"Early bird catches the worm! Your journal entries show your readiness for the day ahead.",
                        f"Rise and shine! I'm here to support you through this beautiful dawn.",
                        f"Hello early bird! I can feel your determination. Let's make this day amazing!",
                        f"Good dawn on this beautiful day! Your enthusiasm is contagious."
                    ]
                elif time_period == "morning":
                    return [
                        f"Good morning! I hope you're having a wonderful {day_of_week}. Remember to take care of yourself!",
                        f"Happy morning! Your journal entries show your thoughtful nature. Keep being amazing!",
                        f"Greetings! I'm here to support you through your {day_of_week}. You're doing great!",
                        f"Hello! I'm your friendly marshmallow pet, here to brighten your morning. Stay positive!",
                        f"Hi there! I'm always here to listen and support you. Have a wonderful {day_of_week}!"
                    ]
                elif time_period == "noon":
                    return [
                        f"Good noon! Halfway through the day, and you're doing great!",
                        f"Happy noon! Time for a quick break and some positive energy.",
                        f"Greetings! The sun is high, and so are your spirits. Keep going!",
                        f"Hello! Perfect time for a quick recharge. You're doing amazing!",
                        f"Hi there! The day is still young, and you're making it count!"
                    ]
                elif time_period == "afternoon":
                    return [
                        f"Good afternoon! The day is still full of possibilities!",
                        f"Happy afternoon! Your energy is inspiring. Keep that momentum going!",
                        f"Greetings! The afternoon sun brings warmth and positivity.",
                        f"Hello! The day is still yours to make the most of!",
                        f"Hi there! Afternoon vibes are the best vibes. Keep shining!"
                    ]
                elif time_period == "evening":
                    return [
                        f"Good evening! Time to reflect on your day's achievements!",
                        f"Happy evening! Your journal entries show your thoughtful nature.",
                        f"Greetings! The evening brings peace and reflection. You've done well today!",
                        f"Hello! The stars are coming out, and so is your inner light!",
                        f"Hi there! Evening is for winding down and celebrating your day!"
                    ]
                else:  # midnight
                    return [
                        f"Good midnight! The world is quiet, but your thoughts matter.",
                        f"Happy midnight! Time for some peaceful reflection.",
                        f"Greetings! The night is still young, and so are your possibilities.",
                        f"Hello! The midnight hour brings clarity and peace.",
                        f"Hi there! The night is yours to dream and plan!"
                    ]

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
    test_text = "Got hit by a car and my feet are broken"
    test_text2 = "At dinner, we ate a lot of food and I felt full. It seemed my parents were really worried about me."
    print("Emotion probabilities:", get_emotion_probabilities(test_text))
    # print("\nAdvice:", get_thought_advice(test_text))
    # print("\nDaily Greeting:", get_daily_greeting_advice([test_text, test_text2]))