from Tools.files import read_file
from Tools.time_tool import get_time
from Tools.memory_tool import remember
from Tools.system_tool import open_program
from Tools.files import list_directory
from Tools.web_search import web_search

TOOLS = {
    "get_time": get_time,
    "remember": remember,
    "open_program": open_program,
    "list_directory": list_directory,
    "web_search": web_search,
    "read_file": read_file
}

