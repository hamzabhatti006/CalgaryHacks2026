from google import genai


with open(".env") as f:
    for line in f:
        if line.startswith("GEMENI_API_KEY="):
            api_key = line.strip().split("=")[1]
            break

client = genai.Client(api_key=api_key)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="type out hello world"
)

print(response.text)
