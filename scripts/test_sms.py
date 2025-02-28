import requests

# Step 1: Get JWT Token
auth_url = "http://127.0.0.1:8000/auth/jwt/create/"
auth_data = {
    "username": "ravi",  
    "password": "Ravidoc1@1"  
}

auth_response = requests.post(auth_url, json=auth_data)
token_data = auth_response.json()

# FIX: Get correct access token
access_token = token_data.get("access")  # ✅ Correct key

if not access_token:
    print("❌ Failed to get token:", token_data)  # Show full error
else:
    print("✅ JWT Token:", access_token)

    # Step 2: Send SMS
    sms_url = "http://127.0.0.1:8000/auth/users/send_sms/"
    headers = {
        "Authorization": f"JWT {access_token}",
        "Content-Type": "application/json"
    }
    sms_data = {
        "to": "+917375826949",  
        "message": "Hello from VibeConnect!"
    }

    sms_response = requests.post(sms_url, json=sms_data, headers=headers)
    print("📨 SMS Response Code:", sms_response.status_code)
    print("📩 Response Data:", sms_response.json())
