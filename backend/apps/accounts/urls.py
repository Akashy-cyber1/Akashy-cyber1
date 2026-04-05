from django.urls import path

from .views import CurrentUserView, HealthCheckView, LoginView, LogoutView, RegisterView

urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="auth-health"),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", CurrentUserView.as_view(), name="current-user"),
]
