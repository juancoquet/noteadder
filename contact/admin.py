from django.contrib import admin

from .models import Feedback, Contact


class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['short_msg', 'subject', 'email']


class ContactAdmin(admin.ModelAdmin):
    list_display = ['short_msg', 'subject', 'email']


admin.site.register(Feedback, FeedbackAdmin)
admin.site.register(Contact, ContactAdmin)
