import os
import django
import sys

# Add the project root to sys.path
# Assuming we run this from backend directory, parent is root? No, verify path.
# If running from backend/, then backend.settings is available if current dir is in path.
sys.path.append(os.getcwd())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()
print("--- USERS IN DB ---")
users = User.objects.all()
print(f"Total Users: {users.count()}")
for u in users:
    print(f"ID: {u.id}, Username: {u.username}, Role: {getattr(u, 'role', 'N/A')}")
print("-------------------")
