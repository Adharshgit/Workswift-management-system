import os
import sys
import django

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wsms_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

def create_super():
    username = 'admin'
    password = 'admin123'
    email = 'admin@example.com'
    
    if not User.objects.filter(username=username).exists():
        print(f"Creating superuser {username}...")
        User.objects.create_superuser(
            username=username,
            password=password,
            email=email,
            role='manager'
        )
        print("Superuser created successfully!")
    else:
        print(f"User {username} already exists. Updating to superuser...")
        user = User.objects.get(username=username)
        user.is_superuser = True
        user.is_staff = True
        user.role = 'manager'
        user.set_password(password)
        user.save()
        print("User updated to superuser successfully!")

if __name__ == '__main__':
    create_super()
