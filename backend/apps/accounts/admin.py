from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import Business, StaffMember, User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = ("id", "email", "username", "role", "is_active", "is_staff")
    ordering = ("id",)
    fieldsets = DjangoUserAdmin.fieldsets + (("CRM", {"fields": ("role", "is_email_verified")}),)
    add_fieldsets = DjangoUserAdmin.add_fieldsets + (("CRM", {"fields": ("role",)}),)


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "owner", "phone", "city", "created_at")
    search_fields = ("name", "owner__email", "phone")


@admin.register(StaffMember)
class StaffMemberAdmin(admin.ModelAdmin):
    list_display = ("id", "business", "user", "title", "is_active", "joined_at")
    search_fields = ("business__name", "user__email", "title")
