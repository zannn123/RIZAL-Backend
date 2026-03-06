import urllib.request
import json
import urllib.error

data = json.dumps({'email': 'admin@university.edu', 'password': 'AdminPass123!'}).encode('utf-8')
req = urllib.request.Request(
    'https://rizal-backend.onrender.com/login',
    data=data,
    headers={'Content-Type': 'application/json'},
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}")
    print(e.read().decode())
except Exception as e:
    print(f"Error: {e}")
