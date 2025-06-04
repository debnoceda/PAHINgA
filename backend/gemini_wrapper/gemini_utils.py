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

def get_daily_greeting_advice(journal_entries: List[str], timezone: str = "UTC") -> List[str]:
    """
    Generate a list of 5 personalized greetings and advice based on all journal entries for the day,
    current time, and any holidays.

    Args:
        journal_entries (List[str]): List of journal entries for the current day
        timezone (str): Timezone for time-based greetings (default: UTC)

    Returns:
        List[str]: List of 5 personalized greeting and advice messages
    """
    # Get current time and date
    current_time = datetime.now()
    hour = current_time.hour
    current_date = current_time.date()
    day_of_week = current_time.strftime("%A")  # Get full day name (Monday, Tuesday, etc.)
    is_holiday = current_date in holidays.PH()
    holiday_name = holidays.PH().get(current_date) if is_holiday else None

    # Determine time of day
    time_of_day = "morning" if 5 <= hour < 12 else "afternoon" if 12 <= hour < 17 else "evening"

    # Combine all journal entries
    combined_entries = "\n".join(journal_entries) if journal_entries else "No entries for today"

    greeting_prompt = f"""
You are a friendly and empathetic marshmallow pet who is a friend of the user. Generate 5 different personalized greetings and advice based on the following context:

Current time: {time_of_day}
Day of week: {day_of_week}
Is holiday: {is_holiday}
Holiday name: {holiday_name if holiday_name else 'None'}
User's journal entries for today:
{combined_entries}

Generate 5 different warm, personalized greetings that:
1. Acknowledge the time of day
2. Include day-of-week specific encouragement:
   - For Monday: Focus on starting the week fresh and setting positive intentions
   - For Wednesday: Mention being halfway through the week and maintaining momentum
   - For Friday: Celebrate the end of the week and upcoming weekend
   - For weekend days: Emphasize rest, relaxation, and personal time
3. If it's a holiday, include a holiday-specific greeting (e.g., "Merry Christmas!" for December 25)
4. Reference themes or emotions from their journal entries
5. Provide a single piece of supportive advice
6. End with an encouraging note

Keep each greeting concise and short (1-2 sentences) and friendly. Do not make it sound like a response to their entries, but rather a thoughtful greeting that takes their entries into account.

Return only a JSON array of 5 strings, no other text or formatting.

Example format for a Monday:
[
  "Good morning! Happy Monday! I see you're ready to start the week. Let's make it a great one!",
  "Welcome to a new week! Your positive energy is exactly what we need for a fresh start.",
  "Happy Monday morning! I notice you're feeling motivated. Keep that energy going!",
  "Good morning on this beautiful Monday! Your enthusiasm is contagious. Let's make this week amazing!",
  "Hello Monday! I can feel your readiness for the week ahead. You've got this!"
]

Example format for a Wednesday:
[
  "Good morning! Happy Hump Day! We're halfway through the week and you're doing great!",
  "Wednesday wisdom: You're stronger than you think. Keep pushing forward!",
  "Happy Wednesday! I see your determination shining through. The weekend is getting closer!",
  "Good morning on this wonderful Wednesday! Your progress is inspiring. Keep going!",
  "Hello Wednesday! I can feel your momentum building. You're doing amazing!"
]
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
                # Fallback greetings with day-specific messages
                if day_of_week == "Monday":
                    return [
                        f"Good {time_of_day}! Happy Monday! Let's start this week with positive energy!",
                        f"Welcome to a new week! Your journal entries show your readiness for fresh beginnings.",
                        f"Happy Monday {time_of_day}! I'm here to support you through this new week.",
                        f"Hello! It's Monday and I can feel your determination. Let's make this week amazing!",
                        f"Good {time_of_day} on this beautiful Monday! Your enthusiasm is contagious."
                    ]
                elif day_of_week == "Wednesday":
                    return [
                        f"Good {time_of_day}! Happy Hump Day! We're halfway through the week!",
                        f"Wednesday wisdom: You're stronger than you think. Keep pushing forward!",
                        f"Happy Wednesday {time_of_day}! Your progress is inspiring.",
                        f"Hello! It's Wednesday and you're doing great. The weekend is getting closer!",
                        f"Good {time_of_day} on this wonderful Wednesday! Keep that momentum going!"
                    ]
                elif day_of_week in ["Saturday", "Sunday"]:
                    return [
                        f"Good {time_of_day}! Happy {day_of_week}! Time to relax and recharge.",
                        f"Enjoy your {day_of_week}! Your journal entries show you're taking time for yourself.",
                        f"Happy {day_of_week} {time_of_day}! I'm here to support your weekend vibes.",
                        f"Hello! It's {day_of_week} and you deserve this time to rest.",
                        f"Good {time_of_day} on this beautiful {day_of_week}! Take time to enjoy yourself."
                    ]
                else:
                    return [
                        f"Good {time_of_day}! I hope you're having a wonderful {day_of_week}. Remember to take care of yourself!",
                        f"Happy {time_of_day}! Your journal entries show your thoughtful nature. Keep being amazing!",
                        f"Greetings! I'm here to support you through your {day_of_week}. You're doing great!",
                        f"Hello! I'm your friendly marshmallow pet, here to brighten your {time_of_day}. Stay positive!",
                        f"Hi there! I'm always here to listen and support you. Have a wonderful {day_of_week}!"
                    ]

        except ServerError as e:
            print(f"[Attempt {attempt + 1}] Gemini API is overloaded. Retrying in 5 seconds...")
            time.sleep(5)
        except json.JSONDecodeError:
            print("Failed to parse JSON:", response.text)
            return [
                f"Good {time_of_day}! I hope you're having a wonderful {day_of_week}. Remember to take care of yourself!",
                f"Happy {time_of_day}! Your journal entries show your thoughtful nature. Keep being amazing!",
                f"Greetings! I'm here to support you through your {day_of_week}. You're doing great!",
                f"Hello! I'm your friendly marshmallow pet, here to brighten your {time_of_day}. Stay positive!",
                f"Hi there! I'm always here to listen and support you. Have a wonderful {day_of_week}!"
            ]
        except Exception as e:
            print("Unexpected error:", e)
            return [
                f"Good {time_of_day}! I hope you're having a wonderful {day_of_week}. Remember to take care of yourself!",
                f"Happy {time_of_day}! Your journal entries show your thoughtful nature. Keep being amazing!",
                f"Greetings! I'm here to support you through your {day_of_week}. You're doing great!",
                f"Hello! I'm your friendly marshmallow pet, here to brighten your {time_of_day}. Stay positive!",
                f"Hi there! I'm always here to listen and support you. Have a wonderful {day_of_week}!"
            ]

    print("Failed after multiple retries.")
    return [
        f"Good {time_of_day}! I hope you're having a wonderful {day_of_week}. Remember to take care of yourself!",
        f"Happy {time_of_day}! Your journal entries show your thoughtful nature. Keep being amazing!",
        f"Greetings! I'm here to support you through your {day_of_week}. You're doing great!",
        f"Hello! I'm your friendly marshmallow pet, here to brighten your {time_of_day}. Stay positive!",
        f"Hi there! I'm always here to listen and support you. Have a wonderful {day_of_week}!"
    ]

# Test functions
if __name__ == "__main__":
    test_text = "Got hit by a car and my feet are broken"
    test_text2 = "At dinner, we ate a lot of food and I felt full. It seemed my parents were really worried about me."
    # print("Emotion probabilities:", get_emotion_probabilities(test_text))
    # print("\nAdvice:", get_thought_advice(test_text))
    print("\nDaily Greeting:", get_daily_greeting_advice([test_text, test_text2]))