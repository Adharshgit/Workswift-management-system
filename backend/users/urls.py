from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, UserDetailView, UserListView, EmployeeCreateView, EmployeeDeleteView, ManagerDeleteView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserDetailView.as_view(), name='user_detail'),
    path('list/', UserListView.as_view(), name='user_list'),
    path('create-employee/', EmployeeCreateView.as_view(), name='create_employee'),
    path('delete/<int:pk>/', EmployeeDeleteView.as_view(), name='delete_employee'),
    path('delete-manager/', ManagerDeleteView.as_view(), name='delete_manager'),
]
