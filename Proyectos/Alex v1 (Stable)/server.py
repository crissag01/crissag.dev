from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from Brain.brain import ask

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    text: str

@app.post("/chat")
def chat(msg: Message):

    reply = ask(msg.text)

    return {
        "reply": reply
    }

@app.get("/resources")
def resources():
    import psutil
    cpu = psutil.cpu_percent()
    ram_used = psutil.virtual_memory().used / (1024 ** 3)
    ram_total = psutil.virtual_memory().total / (1024 ** 3)
    return {
        "cpu": int(cpu),
        "ram": f"{ram_used:.1f} / {ram_total:.1f} GB",
        "model": "qwen:7b",
        "connected": True
    }

from pydantic import BaseModel
import json, os, uuid

CHATS_FILE = "chats.json"

def load_chats():
    if not os.path.exists(CHATS_FILE):
        return {}
    with open(CHATS_FILE) as f:
        return json.load(f)

def save_chats(data):
    with open(CHATS_FILE, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

@app.get("/chats")
def get_chats():
    return load_chats()

@app.post("/chats/{chat_id}")
def save_chat(chat_id: str, body: dict):
    chats = load_chats()
    chats[chat_id] = body
    save_chats(chats)
    return {"ok": True}