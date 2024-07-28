from django.db.models import Count
from django.db.models import F
from rest_framework import viewsets, filters, generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files.uploadedfile import InMemoryUploadedFile

from .models import Country, Sport, Discipline, Participant, Schedule, Venue, Result
from .serializers import CountrySerializer, SportSerializer, DisciplineSerializer, ParticipantSerializer, \
    ScheduleSerializer, VenueSerializer, ResultSerializer


class CountryViewSet(viewsets.ModelViewSet):
    lookup_field = 'country_code'

    queryset = Country.objects.all()
    serializer_class = CountrySerializer

    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['country_code', 'country_name', 'total_medals']

    def get_queryset(self):
        queryset = super().get_queryset()
        ordering = self.request.query_params.get('ordering', None)

        if ordering in ['total_medals', '-total_medals']:
            queryset = queryset.annotate(total_medals=Count('participant__result'))
            if ordering == 'total_medals':
                queryset = queryset.order_by(F('total_medals').asc())
            elif ordering == '-total_medals':
                queryset = queryset.order_by(F('total_medals').desc())

        return queryset


class SportViewSet(viewsets.ModelViewSet):
    lookup_field = 'sport_code'

    queryset = Sport.objects.all()
    serializer_class = SportSerializer

    filter_backends = [filters.OrderingFilter]
    ordering_fields = '__all__'


class DisciplineViewSet(viewsets.ModelViewSet):
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer


class ParticipantViewSet(viewsets.ModelViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer

    filter_backends = [filters.OrderingFilter]
    ordering_fields = '__all__'

    def create(self, request, *args, **kwargs):
        photo = request.data.get("photo", None)

        new_athlete = Participant.objects.create(
            country=Country.objects.get(country_code=request.data["country"]),
            sport=Sport.objects.get(sport_code=request.data["sport"]),
            full_name=request.data["full_name"],
            date_of_birth=request.data["date_of_birth"],
            gender=request.data["gender"],
            photo=photo if photo else 'default_photo.jpg'
        )
        print('new_athlete', new_athlete.__dict__)
        if new_athlete:
            serializer = ParticipantSerializer(new_athlete)
            print('serialized data', serializer.data)
            return Response(serializer.data)
        else:
            return Response({"error": "Failed to create participant"}, status=status.HTTP_400_BAD_REQUEST)


class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer

    filter_backends = [filters.OrderingFilter]
    ordering_fields = '__all__'


class VenueViewSet(viewsets.ModelViewSet):
    lookup_field = 'venue_code'

    queryset = Venue.objects.all()
    serializer_class = VenueSerializer

    filter_backends = [filters.OrderingFilter]
    ordering_fields = '__all__'


class ResultListAPI(generics.ListAPIView):
    serializer_class = ResultSerializer  # Замените это на соответствующий Serializer для класса Result

    def get_queryset(self):
        schedule_id = self.request.query_params.get('schedule', None)
        discipline_id = self.request.query_params.get('discipline', None)

        if schedule_id is not None and discipline_id is not None:
            # найдем объекты Schedule и Discipline на основе их первичных ключей
            schedule = Schedule.objects.get(pk=schedule_id)
            discipline = Discipline.objects.get(pk=discipline_id)

            # найти все объекты Result, которые связаны с этими Schedule и Discipline
            queryset = Result.objects.filter(Schedule=schedule, discipline=discipline).order_by('place')
            return queryset
        else:
            return Result.objects.all()


class ResultDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ResultSerializer
    queryset = Result.objects.all()


@api_view(['GET'])
def all_athlete(request):
    athletes = Participant.objects.order_by('full_name').all()
    serializer = ParticipantSerializer(athletes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def athlete_data(request, participant_code):
    athlete = Participant.objects.get(participant_code=participant_code)
    results = Result.objects.filter(participant=athlete).order_by('-Schedule__timestamp')
    serializer_athlete = ParticipantSerializer(athlete)
    serializer_results = ResultSerializer(results, many=True)
    return Response({'athlete': serializer_athlete.data, 'results': serializer_results.data})


@api_view(['DELETE'])
def delete_athlete(request, participant_code):
    try:
        athlete = Participant.objects.get(participant_code=participant_code)
    except Participant.DoesNotExist:
        return Response({"error": "Participant not found"}, status=status.HTTP_404_NOT_FOUND)
    athlete.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def edit_athlete(request, participant_code):
    editable_athlete = Participant.objects.get(participant_code=request.data['participant_code'])

    sport = request.data.get('sport[sport_code]', None)
    country = request.data.get('country[country_code]', None)
    full_name = request.data.get('full_name', None)
    date_of_birth = request.data.get('date_of_birth', None)
    photo = request.data.get('photo', None)
    gender = request.data.get('gender', None)
    print('send_foto', photo)
    print('foto_from_bd', editable_athlete.photo)

    if isinstance(photo, InMemoryUploadedFile):
        editable_athlete.photo = photo
    else:
        if photo.startswith('/media/'):
            editable_athlete.photo = photo[7:]
        elif photo.startswith('http://localhost:8000/media/'):
            editable_athlete.photo = photo[28:]

    if sport is not None:
        editable_athlete.sport = Sport.objects.get(sport_code=sport)
    if country is not None:
        editable_athlete.country = Country.objects.get(country_code=country)
    if full_name is not None:
        editable_athlete.full_name = full_name
    if date_of_birth is not None:
        editable_athlete.date_of_birth = date_of_birth
    if gender is not None:
        editable_athlete.gender = gender

    editable_athlete.save()
    serializer = ParticipantSerializer(editable_athlete, context={'request': request})

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def search_athlete(request, search_text):
    query_list = Participant.objects.filter(full_name__icontains=search_text)
    serializer = ParticipantSerializer(query_list, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def filters_athlete(request):
    print(request.data)
    filters_data = request.data

    if filters_data['countries']['country'] != 'allCountries' and filters_data['sports']['sport'] != 'allSports':
        athletes = Participant.objects.filter(country__country_code=filters_data['countries']['country'],
                                              sport__sport_code=filters_data['sports']['sport'])
    elif filters_data['countries']['country'] == 'allCountries' and filters_data['sports']['sport'] != 'allSports':
        athletes = Participant.objects.filter(sport__sport_code=filters_data['sports']['sport'])
    elif filters_data['countries']['country'] != 'allCountries' and filters_data['sports']['sport'] == 'allSports':
        athletes = Participant.objects.filter(country__country_code=filters_data['countries']['country'])
    else:
        athletes = Participant.objects.all()

    if not filters_data['gender']['male'] and not filters_data['gender']['female']:
        athletes = athletes.none()
    elif filters_data['gender']['male'] and filters_data['gender']['female']:
        pass
    elif filters_data['gender']['male'] and not filters_data['gender']['female']:
        athletes = athletes.filter(gender='M')
    elif not filters_data['gender']['male'] and filters_data['gender']['female']:
        athletes = athletes.filter(gender='F')

    serializer = ParticipantSerializer(athletes, many=True)
    print(serializer.data)
    return Response(serializer.data, status=status.HTTP_200_OK)
