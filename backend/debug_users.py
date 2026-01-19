import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

print("=== USERS IN DATABASE ===")
for u in User.objects.all():
    print(f"Username: {u.username}, Role: {u.role}, is_active: {u.is_active}")
    # Check common passwords
    for pwd in ['pass123', 'password', '123456', 'Adharsh', 'admin']:
        if u.check_password(pwd):
            print(f"  -> Password matches: {pwd}")
            break
    else:
        print(f"  -> Password doesn't match common passwords")
