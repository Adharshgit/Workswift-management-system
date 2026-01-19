import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wsms_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

print("=== All Users ===")
for u in User.objects.all():
    print(f"Username: '{u.username}', Role: {u.role}, is_active: {u.is_active}")

# Test password for the manager user 
print("\n=== Password Checks ===")
try:
    user = User.objects.get(username='Adharsh')
    for pwd in ['password', 'pass123', '123456', 'Adharsh123', 'Admin123', 'admin', 'manager']:
        result = user.check_password(pwd)
        print(f"Password '{pwd}': {result}")
except User.DoesNotExist:
    print("User 'Adharsh' not found")
