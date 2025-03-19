import requests

url = "https://shopee.vn/api/v4/notification/get_activities?limit=5"
headers = {
    "User-Agent": "Mozilla/5.0",
    "Cookie": "SPC_EC=.UnZRY3hjaGxRaFFzY2lKa1uWuGP8MBKRtAJGG1AGSYziSQhDjiGyJci5aKZhJK+JgBInS3r2bg/WYDmYtkbWT367oSDOkHoCpNttrUfaVmf8n6p3QsI8pfeO67eEkM8Te7FDT4zmpzYGlq1qVEhuCjEek5FsHFS57AEAtP4wyDCTAQLx8M0mF5y92AKVljYaG0b71wXOwzCWufYbqO2C9exa7A7x10wi4CXzsMSulzbMUCroq1lgngWyM1DvkPFS; "
    "SPC_R_T_ID=tPUQLW/VpmopHhulFs8gQ+Opg2lZNUxlTKULjY7umRcAeKBkqnusouPfLQee8htJKqNepAq1LGDxUncJFcL6eAW8Vpw+1Zx7/eA/btUF69ZLA0I4b4e8lBKZjOb6kTF51hANpz4QsCY0NT3PesSvllzgQnTuADosKTgx9myHV30=; "
    "SPC_R_T_IV=dkdLancxejA3Tmlldk8wZw==;"
}


response = requests.get(url, headers=headers)
data = response.json()

print(data)  # Hiển thị danh sách voucher
