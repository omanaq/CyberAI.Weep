
from llama_cpp import Llama
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
import uvicorn
import uuid

llm = Llama(
    model_path="model/mistral.gguf",
    n_ctx=1024,
    n_threads=4
)

app = FastAPI()
API_KEYS = set()

@app.post("/v1/generate-key")
def generate_key():
    new_key = "wlored-" + str(uuid.uuid4())
    API_KEYS.add(new_key)
    return {"api_key": new_key, "status": "created"}

@app.post("/v1/chat/completions")
async def chat(request: Request):
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer wlored-"):
        raise HTTPException(status_code=401, detail="Unauthorized")

    token = auth.split("Bearer ")[-1].strip()
    if token not in API_KEYS:
        raise HTTPException(status_code=403, detail="Invalid API Key")

    body = await request.json()
    messages = body.get("messages", [])
    if not messages:
        raise HTTPException(status_code=400, detail="Missing messages")

    prompt = "\n".join([f"{m['role']}: {m['content']}" for m in messages])
    prompt += "\nassistant:"

    output = llm(
        prompt=prompt,
        max_tokens=256,
        temperature=0.7,
        stop=["user:", "assistant:"],
    )

    content = output["choices"][0]["text"].strip()
    return JSONResponse({
        "id": "chatcmpl-wlored",
        "object": "chat.completion",
        "created": 0,
        "model": "mistral-7b-instruct",
        "choices": [
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": content
                },
                "finish_reason": "stop"
            }
        ]
    })

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
