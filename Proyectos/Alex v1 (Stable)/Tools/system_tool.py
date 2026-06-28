import os

def open_program(program):

    programs = {

        "notepad": "notepad.exe",
        "calculator": "calc.exe",
        "explorer": "explorer.exe"
    }

    if program in programs:

        os.system(programs[program])

        return f"Abrí {program}"

    return "Programa desconocido."