import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

# Load biến môi trường từ file .env
load_dotenv()

def send_email(sender_email, receiver_email, subject, body):
    try:
        # Lấy mật khẩu từ biến môi trường
        password = os.getenv('EMAIL_PASSWORD')
        if not password:
            raise ValueError("Không tìm thấy mật khẩu email trong biến môi trường")

        # Tạo message
        message = MIMEMultipart()
        message["From"] = sender_email
        message["To"] = receiver_email
        message["Subject"] = subject

        # Thêm nội dung
        message.attach(MIMEText(body, "plain"))

        # Kết nối và gửi
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, password)
        text = message.as_string()
        server.sendmail(sender_email, receiver_email, text)
        server.quit()
        print("Email đã được gửi thành công!")
        return True
    except Exception as e:
        print(f"Lỗi khi gửi email: {e}")
        return False

if __name__ == "__main__":
    # Thông tin người gửi và nhận
    sender_email = "23521337@gm.uit.edu.vn"
    receiver_email = "dtsang0987@gmail.com"
    
    # Nội dung email
    subject = "Test Email"
    body = "This is a test email"
    
    # Gửi email
    send_email(sender_email, receiver_email, subject, body) 