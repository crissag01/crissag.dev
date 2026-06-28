# Tools/web_search.py
import urllib.request
import urllib.parse
import json

def web_search(query: str) -> str:
    url = f"https://api.duckduckgo.com/?q={urllib.parse.quote(query)}&format=json&no_redirect=1&no_html=1"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=5) as r:
            data = json.loads(r.read())
        
        results = []
        if data.get("AbstractText"):
            results.append(data["AbstractText"])
        for topic in data.get("RelatedTopics", [])[:3]:
            if isinstance(topic, dict) and topic.get("Text"):
                results.append(topic["Text"])
        
        return "\n".join(results) if results else "Sin resultados."
    except Exception as e:
        return f"Error en búsqueda: {e}"