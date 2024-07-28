from rest_framework import serializers
from .models import Country, Sport, Discipline, Participant, Schedule, Venue, Result


class CountrySerializer(serializers.ModelSerializer):
    gold_count = serializers.SerializerMethodField()
    silver_count = serializers.SerializerMethodField()
    bronze_count = serializers.SerializerMethodField()
    total_medals = serializers.SerializerMethodField()

    def get_gold_count(self, obj):
        gold_count = 0
        team_sports = Discipline.objects.filter(sport_type='team')
        for sport in team_sports:
            result = Result.objects.filter(discipline=sport, participant__country=obj, place=1)
            if result.exists():
                gold_count += 1

        individual_results = Result.objects.filter(participant__country=obj, place=1,
                                                   discipline__sport_type='individual')
        gold_count += individual_results.count()
        return gold_count

    def get_silver_count(self, obj):
        silver_count = 0
        team_sports = Discipline.objects.filter(sport_type='team')
        for sport in team_sports:
            result = Result.objects.filter(discipline=sport, participant__country=obj, place=2)
            if result.exists():
                silver_count += 1

        individual_results = Result.objects.filter(participant__country=obj, place=2,
                                                   discipline__sport_type='individual')
        silver_count += individual_results.count()
        return silver_count

    def get_bronze_count(self, obj):
        bronze_count = 0
        team_sports = Discipline.objects.filter(sport_type='team')
        for sport in team_sports:
            result = Result.objects.filter(discipline=sport, participant__country=obj, place=3)
            if result.exists():
                bronze_count += 1

        individual_results = Result.objects.filter(participant__country=obj, place=3,
                                                   discipline__sport_type='individual')
        bronze_count += individual_results.count()
        return bronze_count

    def get_total_medals(self, obj):
        gold_count = self.get_gold_count(obj)
        silver_count = self.get_silver_count(obj)
        bronze_count = self.get_bronze_count(obj)

        return gold_count + silver_count + bronze_count

    class Meta:
        model = Country
        fields = ['country_code', 'country_name', 'photo', 'gold_count', 'silver_count', 'bronze_count', 'total_medals']


class SportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sport
        fields = '__all__'


class DisciplineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discipline
        fields = '__all__'


class ParticipantSerializer(serializers.ModelSerializer):
    sport = SportSerializer()
    country = CountrySerializer()

    class Meta:
        model = Participant
        fields = '__all__'


class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = '__all__'


class ScheduleSerializer(serializers.ModelSerializer):
    discipline = DisciplineSerializer()
    sport = SportSerializer()
    venue = VenueSerializer()

    class Meta:
        model = Schedule
        fields = '__all__'


class ResultSerializer(serializers.ModelSerializer):
    discipline = DisciplineSerializer()
    sport = SportSerializer()
    participant = ParticipantSerializer()
    Schedule = ScheduleSerializer()

    class Meta:
        model = Result
        fields = '__all__'
