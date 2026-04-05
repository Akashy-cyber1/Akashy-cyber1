from django.contrib import admin

from .models import Lead, LeadNote, LeadSource


@admin.register(LeadSource)
class LeadSourceAdmin(admin.ModelAdmin):
    list_display = ("id", "business", "name", "is_active", "created_at")
    search_fields = ("name", "business__name")


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "business", "status", "assigned_to", "next_follow_up_at", "created_at")
    list_filter = ("status",)
    search_fields = ("name", "phone", "email")


@admin.register(LeadNote)
class LeadNoteAdmin(admin.ModelAdmin):
    list_display = ("id", "lead", "created_by", "created_at")
    search_fields = ("lead__name", "note")
