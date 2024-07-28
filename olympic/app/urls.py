from django.urls import path
from .api import CountryViewSet, SportViewSet, ParticipantViewSet, ScheduleViewSet, \
    VenueViewSet, ResultListAPI, ResultDetailAPI, delete_athlete, edit_athlete, search_athlete, filters_athlete, \
    all_athlete, athlete_data

urlpatterns = [
    path('countries/', CountryViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('countries/<str:country_code>/',
         CountryViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),

    path('athletes/', ParticipantViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('athletes/<int:pk>/',
         CountryViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
    path('athletes/athlete/<uuid:participant_code>/', athlete_data, name='athlete_data'),
    path('athletes/all/', all_athlete, name='all_athlete'),
    path('athletes/del/<uuid:participant_code>/', delete_athlete, name='delete_athlete'),
    path('athletes/edit/<uuid:participant_code>/', edit_athlete, name='edit_athlete'),
    path('athletes/search/<str:search_text>/', search_athlete, name='search_athlete'),
    path('athletes/filters/', filters_athlete, name='filters_athlete'),

    path('sports/', SportViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('sports/<str:sport_code>/',
         SportViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),

    path('schedules/', ScheduleViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('schedules/<int:pk>/',
         ScheduleViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),

    path('venues/', VenueViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('venues/<uuid:venue_code>/',
         VenueViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),

    path('results/', ResultListAPI.as_view(), name='results'),
    path('results/<str:pk>/', ResultDetailAPI.as_view(), name='result'),

]
