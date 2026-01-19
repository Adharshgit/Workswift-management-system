import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wsms_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

print("=== SUPERUSERS ===")
superusers = User.objects.filter(is_superuser=True)
if not superusers.exists():
    print("No superusers found.")
    # Check if 'Adharsh' is a manager and if we can use it
    adharsh = User.objects.filter(username='Adharsh').first()
    if adharsh:
        print(f"User 'Adharsh' found. Role: {getattr(adharsh, 'role', 'N/A')}, is_superuser: {adharsh.is_superuser}")
else:
    for u in superusers:
        print(f"Username: {u.username}, is_active: {u.is_active}")
        for pwd in ['pass123', 'admin', 'password', '123456', 'Adharsh']:
            if u.check_password(pwd):
                print(f"  -> PASSWORD MATCH: {pwd}")
                break
