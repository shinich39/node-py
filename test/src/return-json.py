import sys
import json

# set stdout encoding
sys.stdout.reconfigure(encoding='utf-8')

def main(*args):

  data = {
    "object": {
      "a": 1,
      "b": 2,
    },
    "array": [1,2,3],
    "boolean": True,
    "string": "hello",
    "number": 1,
    "null": None,
  }

  # send to js stdout
  sys.stdout.write(json.dumps(data))
  sys.exit(0)

if __name__ == '__main__':
  # send all arguments without this filename
  main(*sys.argv[1:])