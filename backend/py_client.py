import requests

payload = {
    "first":"innocent",
    "last":"kamesa",
    "phone":"+265983759420",
    "email":"innocentkamesa05@gmail.com",
    "studentId":"230302202",
    "password":"@Inno2006",
    "confirm":"@Inno2006"
}

url = "http://localhost:5000/api/auth/register/"
response = requests.post(url, json=payload)
print(response.json())
