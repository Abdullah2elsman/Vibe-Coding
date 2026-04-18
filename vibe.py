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
                "content": "give me some info about JS"
            }
        ],
    }
)

if response.status_code == 200:
    print(response.json())
else:
    print(f"Error {response.status_code}: {response.text}")