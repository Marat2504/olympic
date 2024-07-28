from django.contrib import admin
from django.utils.safestring import mark_safe

from .models import Country, Sport, Participant, Venue, Result, Schedule, Discipline


class CountryAdmin(admin.ModelAdmin):
    list_display = ('get_html_photo', 'country_code', 'country_name')
    list_display_links = ('country_code', 'country_name',)

    readonly_fields = ('get_html_photo',)

    def get_html_photo(self, object):
        if object.photo:
            return mark_safe(f"<img src='{object.photo.url}' width=50>")

    get_html_photo.short_description = 'Фото'


class SportAdmin(admin.ModelAdmin):
    list_display = ('sport_code', 'sport_name')
    list_display_links = ('sport_code', 'sport_name')


class DisciplineAdmin(admin.ModelAdmin):
    list_display = ('id', 'sport', 'discipline_name', 'sport_type')
    list_editable = ('sport_type',)


class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'get_html_photo', 'participant_code', 'date_of_birth', 'sport', 'country', 'gender',)
    list_editable = ('gender',)

    readonly_fields = ('get_html_photo',)

    def get_html_photo(self, object):
        if object.photo:
            return mark_safe(f"<img src='{object.photo.url}' width=150>")

    get_html_photo.short_description = 'Фото'


class ResultAdmin(admin.ModelAdmin):
    list_display = ('sport', 'discipline', 'Schedule', 'participant', 'place', 'result')


class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('sport', 'discipline', 'timestamp', 'venue')


class VenueAdmin(admin.ModelAdmin):
    list_display = ('venue_code', 'venue_name', 'location', 'address')


admin.site.register(Country, CountryAdmin)
admin.site.register(Discipline, DisciplineAdmin)
admin.site.register(Sport, SportAdmin)
admin.site.register(Participant, ParticipantAdmin)
admin.site.register(Venue, VenueAdmin)
admin.site.register(Result, ResultAdmin)
admin.site.register(Schedule, ScheduleAdmin)



