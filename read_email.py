import imaplib
import email
from email.header import decode_header
import os

def connect_to_email(email_address, password):
    # Kết nối đến Gmail IMAP server
    imap_server = "imap.gmail.com"
    mail = imaplib.IMAP4_SSL(imap_server)
    mail.login(email_address, password)
    return mail

def read_emails(mail):
    # Chọn hộp thư đến
    mail.select("INBOX")
    
    # Tìm tất cả email
    _, messages = mail.search(None, "ALL")
    
    # Lấy danh sách ID của các email
    email_ids = messages[0].split()
    
    print("\nDanh sách email:")
    print("-" * 50)
    
    # Đọc từng email
    for email_id in email_ids:
        _, msg_data = mail.fetch(email_id, "(RFC822)")
        email_body = msg_data[0][1]
        email_message = email.message_from_bytes(email_body)
        
        # Lấy thông tin người gửi
        from_ = decode_header(email_message["From"])[0][0]
        if isinstance(from_, bytes):
            from_ = from_.decode()
            
        # Lấy tiêu đề
        subject = decode_header(email_message["Subject"])[0][0]
        if isinstance(subject, bytes):
            subject = subject.decode()
            
        print(f"From: {from_}")
        print(f"Subject: {subject}")
        print("-" * 50)

def create_folder(mail, folder_name):
    try:
        # Tạo thư mục mới
        mail.create(folder_name)
        print(f"\nĐã tạo thư mục '{folder_name}' thành công!")
    except Exception as e:
        print(f"\nLỗi khi tạo thư mục: {e}")

def main():
    # Thông tin đăng nhập
    email_address = "23521337@gm.uit.edu.vn"
    password = "pfnf uktx ugoo zxhp"
    
    try:
        # Kết nối đến email
        print("Đang kết nối đến Gmail...")
        mail = connect_to_email(email_address, password)
        print("Kết nối thành công!")
        
        # Đọc email
        read_emails(mail)
        
        # Tạo thư mục mới
        folder_name = "GROUPXX-MÃLỚP"  # Thay đổi tên thư mục theo yêu cầu
        create_folder(mail, folder_name)
        
        # Đóng kết nối
        mail.logout()
        
    except Exception as e:
        print(f"Lỗi: {e}")

if __name__ == "__main__":
    main() 