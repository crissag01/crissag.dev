import json
import os

import Memory

MEMORY_FILE = os.path.join(
os.path.dirname(__file__),
"memory.json"
)


def load_memory_data(): 
 try:
  with open(
  MEMORY_FILE,
  "r",
  encoding="utf-8"
  ) as file:
   return json.load(file)
 except (
    FileNotFoundError,
    json.JSONDecodeError
):

    return {}

def load_memories():

 data = load_memory_data()
 return data.get(
    "memories",
    []
)

def save_memory(Memory):
 data = load_memory_data()

 memories = data.get(
    "memories",
    []
)

 if Memory not in memories:

    memories.append(Memory)

    data["memories"] = memories

    with open(
        MEMORY_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            data,
            file,
            indent=4,
            ensure_ascii=False
        )

    return True

 return False