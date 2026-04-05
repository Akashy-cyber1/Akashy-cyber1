from django.urls import path

from .views import (
    LeadListCreateView,
    LeadNoteListCreateView,
    LeadRetrieveUpdateDestroyView,
    LeadSourceListCreateView,
    StaffListView,
)

urlpatterns = [
    path("sources/", LeadSourceListCreateView.as_view(), name="lead-source-list-create"),
    path("staff/", StaffListView.as_view(), name="lead-staff-list"),
    path("", LeadListCreateView.as_view(), name="lead-list-create"),
    path("<int:pk>/", LeadRetrieveUpdateDestroyView.as_view(), name="lead-detail"),
    path("<int:lead_id>/notes/", LeadNoteListCreateView.as_view(), name="lead-note-list-create"),
]
