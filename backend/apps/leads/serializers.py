from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.accounts.models import StaffMember

from .models import Lead, LeadNote, LeadSource

User = get_user_model()


class LeadSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadSource
        fields = ("id", "name", "description", "is_active", "created_at")
        read_only_fields = ("id", "created_at")


class LeadNoteSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source="created_by.get_full_name", read_only=True)

    class Meta:
        model = LeadNote
        fields = ("id", "lead", "note", "created_by", "created_by_name", "created_at")
        read_only_fields = ("id", "created_by", "created_at", "created_by_name")


class LeadSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.SerializerMethodField()
    source_name = serializers.CharField(source="source.name", read_only=True)

    class Meta:
        model = Lead
        fields = (
            "id",
            "source",
            "source_name",
            "name",
            "phone",
            "email",
            "status",
            "budget",
            "requirement",
            "next_follow_up_at",
            "assigned_to",
            "assigned_to_name",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "source_name", "assigned_to_name")

    def validate_assigned_to(self, value):
        if value is None:
            return value

        request = self.context.get("request")
        if not request:
            return value

        business = getattr(request.user, "business", None)
        if not business:
            raise serializers.ValidationError("Business profile is missing.")

        if value == business.owner:
            return value

        has_membership = StaffMember.objects.filter(business=business, user=value, is_active=True).exists()
        if not has_membership:
            raise serializers.ValidationError("Assigned user must belong to your business staff.")
        return value

    def validate_source(self, value):
        if value is None:
            return value

        request = self.context.get("request")
        business = getattr(request.user, "business", None)
        if not business or value.business_id != business.id:
            raise serializers.ValidationError("Invalid lead source for your business.")
        return value

    def get_assigned_to_name(self, obj):
        if not obj.assigned_to:
            return None
        full_name = obj.assigned_to.get_full_name().strip()
        return full_name or obj.assigned_to.email
