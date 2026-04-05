from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/auth/", include("apps.accounts.urls")),
    path("api/v1/leads/", include("apps.leads.urls")),
    path("api/v1/followups/", include("apps.followups.urls")),
    path("api/v1/payments/", include("apps.payments.urls")),
    path("api/v1/reports/", include("apps.reports.urls")),
]
