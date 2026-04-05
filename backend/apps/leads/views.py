from django.db.models import Q
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from apps.accounts.models import StaffMember

from .models import Lead, LeadNote, LeadSource
from .serializers import LeadNoteSerializer, LeadSerializer, LeadSourceSerializer


class BusinessScopedMixin:
    def get_business(self):
        business = getattr(self.request.user, "business", None)
        if not business:
            raise ValidationError({"detail": "Business profile not found for current user."})
        return business


class LeadSourceListCreateView(BusinessScopedMixin, generics.ListCreateAPIView):
    serializer_class = LeadSourceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LeadSource.objects.filter(business=self.get_business())

    def perform_create(self, serializer):
        serializer.save(business=self.get_business())


class LeadListCreateView(BusinessScopedMixin, generics.ListCreateAPIView):
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        business = self.get_business()
        queryset = Lead.objects.filter(business=business).select_related("source", "assigned_to")

        query = self.request.query_params.get("search")
        status_value = self.request.query_params.get("status")
        assigned_to = self.request.query_params.get("assigned_to")
        source_id = self.request.query_params.get("source")

        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) | Q(phone__icontains=query) | Q(email__icontains=query)
            )

        if status_value:
            queryset = queryset.filter(status=status_value)

        if assigned_to:
            queryset = queryset.filter(assigned_to_id=assigned_to)

        if source_id:
            queryset = queryset.filter(source_id=source_id)

        return queryset

    def perform_create(self, serializer):
        serializer.save(business=self.get_business(), created_by=self.request.user)


class LeadRetrieveUpdateDestroyView(BusinessScopedMixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Lead.objects.filter(business=self.get_business()).select_related("source", "assigned_to")


class LeadNoteListCreateView(BusinessScopedMixin, generics.ListCreateAPIView):
    serializer_class = LeadNoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        lead_id = self.kwargs["lead_id"]
        return LeadNote.objects.filter(lead__business=self.get_business(), lead_id=lead_id).select_related("created_by")

    def perform_create(self, serializer):
        lead_id = self.kwargs["lead_id"]
        lead = Lead.objects.filter(id=lead_id, business=self.get_business()).first()
        if not lead:
            raise ValidationError({"lead": "Lead not found."})
        serializer.save(lead=lead, created_by=self.request.user)


class StaffListView(BusinessScopedMixin, generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        business = self.get_business()
        memberships = StaffMember.objects.filter(business=business, is_active=True).select_related("user")

        users = [business.owner]
        users.extend([membership.user for membership in memberships])

        unique_users = []
        seen = set()
        for user in users:
            if user.id in seen:
                continue
            seen.add(user.id)
            unique_users.append(user)
        return unique_users

    def list(self, request, *args, **kwargs):
        payload = [
            {
                "id": user.id,
                "email": user.email,
                "name": user.get_full_name().strip() or user.email,
                "role": user.role,
            }
            for user in self.get_queryset()
        ]
        return Response(payload)
