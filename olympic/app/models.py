import os
import uuid

import shortuuid as shortuuid
from django.db import models
from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver
from django.utils.timezone import now


def participant_photo_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{instance.full_name}_{now().strftime("%Y%m%d_%H%M%S")}.{ext}'
    return os.path.join('participant_photos', filename)


def country_flag_photo_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{instance.country_code}_{now().strftime("%Y%m%d_%H%M%S")}.{ext}'
    return os.path.join('country_flag_photos', filename)


class Country(models.Model):
    country_code = models.CharField(max_length=50, primary_key=True, unique=True, blank=False)
    country_name = models.CharField(max_length=100, unique=True, blank=False)
    photo = models.ImageField(upload_to=country_flag_photo_path, blank=False)

    def __str__(self):
        return f'{self.country_name}'


class Sport(models.Model):
    sport_code = models.CharField(max_length=50, primary_key=True, unique=True)
    sport_name = models.CharField(max_length=100, blank=False, verbose_name='Вид спорта')

    def __str__(self):
        return f'{self.sport_name}'


class Discipline(models.Model):
    SPORT_TYPES = [
        ('team', 'Командный'),
        ('individual', 'Индивидуальный'),
    ]

    DEFAULT_SPORT = 'individual'
    sport = models.ForeignKey(Sport, on_delete=models.CASCADE, verbose_name='Вид спорта')
    discipline_name = models.CharField(max_length=100, verbose_name='Дисциплина')
    sport_type = models.CharField(max_length=20, choices=SPORT_TYPES, blank=False)

    def __str__(self):
        return f'{self.discipline_name}'


class Participant(models.Model):
    GENDER_CHOICES = [
        ('M', 'Мужской'),
        ('F', 'Женский'),
    ]

    DEFAULT_GENDER = 'M'

    country = models.ForeignKey(Country, on_delete=models.CASCADE, verbose_name='Гражданство')
    sport = models.ForeignKey(Sport, on_delete=models.CASCADE, verbose_name='Вид спорта')
    participant_code = models.UUIDField(default=uuid.uuid4, unique=True)
    full_name = models.CharField(max_length=100, blank=False, verbose_name='Полное имя')
    date_of_birth = models.DateField(blank=False, verbose_name='Дата рождения')
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default=DEFAULT_GENDER, verbose_name='Пол')
    photo = models.ImageField(upload_to=participant_photo_path, default='default_photo.jpg')

    def __str__(self):
        return f'{self.full_name}'

    def delete_old_image(self):
        if self.pk:
            try:
                old_image = Participant.objects.get(pk=self.pk).photo
                if self.photo and old_image != self.photo and old_image.url != '/media/default_photo.jpg':
                    old_image.delete(save=False)
            except Participant.DoesNotExist:
                pass

@receiver(pre_save, sender=Participant)
def delete_old_image(sender, instance, **kwargs):
    # Удаляет старую фотографию перед сохранением новой
    instance.delete_old_image()


@receiver(post_delete, sender=Participant)
def delete_image_on_delete(sender, instance, **kwargs):
    # Удаляет фотографию после удаления записи из базы данных
    if instance.photo and instance.photo.url != '/media/default_photo.jpg':
        if os.path.isfile(instance.photo.path):
            os.remove(instance.photo.path)


class Schedule(models.Model):
    sport = models.ForeignKey(Sport, on_delete=models.CASCADE, verbose_name='Вид спорта')
    discipline = models.ForeignKey(Discipline, on_delete=models.CASCADE, verbose_name='Дисциплина')
    venue = models.ForeignKey('Venue', on_delete=models.CASCADE, verbose_name='Спортивный объект')
    timestamp = models.DateTimeField(null=True, blank=True, verbose_name='Дата и время старта в формате timestamp')

    def __str__(self):
        return f'{self.timestamp}'


class Venue(models.Model):
    venue_code = models.CharField(max_length=50, primary_key=True, default=shortuuid.uuid)
    venue_name = models.CharField(max_length=100, blank=False, verbose_name='спортивный объект')
    location = models.CharField(max_length=200, blank=False, verbose_name='координаты')
    address = models.CharField(max_length=200, blank=False, verbose_name='aдрес')

    def __str__(self):
        return f'{self.venue_name}'


class Result(models.Model):
    sport = models.ForeignKey(Sport, on_delete=models.CASCADE, verbose_name='Вид спорта')
    Schedule = models.ForeignKey(Schedule, on_delete=models.SET_NULL, null=True, verbose_name='Дата/время старта')
    discipline = models.ForeignKey(Discipline, on_delete=models.CASCADE, verbose_name='Дисциплина')
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE, verbose_name='Спортсмен')
    place = models.IntegerField(verbose_name='Место')
    result = models.CharField(max_length=100, verbose_name='Результат')

    def __str__(self):
        return f'{self.participant}: {self.sport}'

