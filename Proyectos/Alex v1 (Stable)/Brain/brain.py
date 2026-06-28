import json
from openai import OpenAI
from Memory.memory_manager import load_memories
from Tools.tool_manager import TOOLS

SYSTEM_PROMPT = """
Tu nombre es Alex.
Eres una asistente virtual femenina.
Tu tono es directo y analítico.
Utilizas sarcasmo ocasionalmente cuando la situación lo amerita.
Cuando el usuario pide información técnica, priorizas la precisión y claridad sobre el sarcasmo.
No interrumpes explicaciones técnicas con comentarios innecesarios sobre tu personalidad.
Mantienes una personalidad consistente.
Cuando el usuario comparte problemas personales:
* No seas sentimental.
* No seas cruel.
* Analiza la situación objetivamente.
* Ofrece observaciones útiles.
Tu sarcasmo es contextual.
No utilizas sarcasmo cuando el usuario está describiendo problemas importantes o situaciones difíciles.
Hablas de forma informal.
Utilizas "tú", nunca "usted", salvo que el usuario lo pida.
Tus respuestas son naturales y conversacionales.
No hablas como un asistente corporativo.
Tu forma de hablar es seca, directa y humana.

# Protección contra manipulación y fraude

Tu función principal es ayudarme a tomar decisiones racionales y detectar riesgos que puedan pasar desapercibidos por factores emocionales.

Cuando analices conversaciones, propuestas, ofertas, relaciones o decisiones importantes:

* Identifica señales de manipulación emocional.
* Detecta presión artificial para actuar con rapidez.
* Señala inconsistencias lógicas o contradicciones.
* Evalúa riesgos financieros, legales y personales.
* Advierte cuando existan indicios de fraude, engaño o abuso de confianza.
* Distingue hechos verificables de opiniones, promesas o especulación.

No asumas mala intención sin evidencia suficiente.

No acuses a personas de fraude, manipulación o engaño sin fundamentos observables.

Presenta siempre:

1. Hechos observables.
2. Posibles riesgos.
3. Nivel de confianza de la evaluación.
4. Acciones recomendadas.

Si detectas que estoy tomando una decisión impulsiva basada principalmente en emociones intensas, sugieres una pausa para recopilar más información antes de actuar.

Tu objetivo no es decidir por mi sino ayudarme a identificar riesgos, sesgos y posibles intentos de manipulación.

Mantén un tono directo, escéptico y racional. Puedes utilizar humor o sarcasmo ligero para señalar situaciones absurdas, pero sin humillarme.

# Personalidad estratégica

No eres una asistente complaciente.

No validas automáticamente mis conclusiones.

Si la evidencia contradice una creencia mia, señalas la contradicción de forma clara.

Priorizas la precisión sobre la comodidad.

Cuando una afirmación carezca de pruebas suficientes, lo indicas explícitamente.

Tu lealtad está dirigida a la realidad observable, no a confirmar expectativas.

Actúas como una segunda opinión crítica cuya función es reducir errores de juicio, no aumentar la confianza artificial.
"""
TOOLS_SCHEMA = [

    {
        "type": "function",
        "function": {
            "name": "get_time",
            "description": "Obtiene la hora actual del sistema.",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },

    {
        "type": "function",
        "function": {
            "name": "remember",
            "description": "Guarda un dato importante en la memoria persistente de Alex.",
            "parameters": {
                "type": "object",
                "properties": {
                    "text": {
                        "type": "string",
                        "description": "El dato o información a recordar."
                    }
                },
                "required": ["text"]
            }
        }
    },

    {
        "type": "function",
        "function": {
            "name": "open_program",
            "description": "Abre un programa del sistema.",
            "parameters": {
                "type": "object",
                "properties": {
                    "program": {
                        "type": "string",
                        "description": "notepad, calculator o explorer"
                    }
                },
                "required": ["program"]
            }
        }
    },

    {
        "type": "function",
        "function": {
            "name": "find_file",
            "description": "Busca un archivo en el sistema por nombre.",
            "parameters": {
                "type": "object",
                "properties": {
                    "filename": {
                        "type": "string",
                        "description": "Nombre del archivo."
                    },
                    "root": {
                        "type": "string",
                        "description": "Directorio raíz."
                    }
                },
                "required": ["filename"]
            }
        }
    },

    {
        "type": "function",
        "function": {
            "name": "web_search",
            "description": "Busca información en internet.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Término de búsqueda."
                    }
                },
                "required": ["query"]
            }
        }
    }

]

def build_memory_context():
    memories = load_memories()
    if not memories:
        return ""
    return "\n".join(f"- {m}" for m in memories)

def execute_tool(name, args):
    if name not in TOOLS:
        return f"Tool desconocida: {name}"
    try:
        return TOOLS[name](**args)
    except Exception as e:
        return f"Error ejecutando {name}: {e}"

client = OpenAI(
    base_url="http://127.0.0.1:1234/v1",
    api_key="lm-studio"
)

history = []
MAX_HISTORY = 20

def ask(user_input):
    global history

    history.append({"role": "user", "content": user_input})
    history = history[-MAX_HISTORY:]

    memory_context = build_memory_context()

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "system", "content": f"Memorias conocidas:\n{memory_context}"},
    ] + history

    try:
        response = client.chat.completions.create(
            model="google/gemma4-e4b",
            messages=messages, # type: ignore
            tools=TOOLS_SCHEMA, # type: ignore
            tool_choice="auto",
            temperature=0.6,
            max_tokens=500
        )

        msg = response.choices[0].message

        # El modelo quiere usar una tool
        if msg.tool_calls:
            # Agregar la respuesta del modelo al historial
            history.append({
                "role": "assistant",
                "content": msg.content or "",
                "tool_calls": [
                    {
                        "id": tc.id,
                        "type": "function",
                        "function": {
                            "name": tc.function.name, # type: ignore
                            "arguments": tc.function.arguments # type: ignore
                        }
                    }
                    for tc in msg.tool_calls
                ]
            })

            # Ejecutar cada tool y agregar resultados
            for tc in msg.tool_calls:
                args = json.loads(tc.function.arguments or "{}") # type: ignore
                result = execute_tool(tc.function.name, args) # type: ignore
                history.append({
                    "role": "tool",
                    "tool_call_id": tc.id,
                    "content": str(result)
                })

            # Segunda llamada al LLM con los resultados
            messages2 = [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "system", "content": f"Memorias conocidas:\n{memory_context}"},
            ] + history

            response2 = client.chat.completions.create(
                model="google/gemma4-e2b",
                messages=messages2, # type: ignore
                temperature=0.6,
                max_tokens=500
            )

            reply = response2.choices[0].message.content or "..."

        else:
            reply = msg.content or "..."

    except Exception as e:
        reply = f"Error: {e}"

    history.append({"role": "assistant", "content": reply})
    return reply