# Generated by Django 5.0.4 on 2024-04-09 12:33

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_alter_country_photo'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='sport',
            name='sport_type',
        ),
        migrations.CreateModel(
            name='Discipline',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('discipline_name', models.CharField(max_length=100)),
                ('sport_type', models.CharField(choices=[('team', 'Командный'), ('individual', 'Индивидуальный')], default='individual', max_length=20)),
                ('sport', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.sport')),
            ],
        ),
    ]
