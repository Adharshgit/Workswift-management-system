from django.contrib.auth import get_user_model
User = get_user_model()
users = User.objects.all()
print(f"Total Users: {users.count()}")
for u in users:
    print(f"ID: {u.id}, Username: {u.username}, Role: {u.role}")
