import requests

open_router_key = "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"

headers = {
    "Authorization": "Bearer " + open_router_key,
    "Content-Type": "application/json" 
}

response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers=headers,
    json={
        "model": "google/gemma-4-31b-it:free",
        "messages": [
            {
                "role": "user",
                "content": "generate text contain 50 words"
            }
        ],
    }
)

if response.status_code == 200:
    print(response.json().choices.message.content)
else:
    print(f"Error {response.status_code}: {response.text}")