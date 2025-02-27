# Generated by Django 5.0.4 on 2024-04-09 13:59

import django.db.models.deletion
import shortuuid.main
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_venue_address_alter_venue_venue_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='result',
            name='discipline',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='app.discipline'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='venue',
            name='venue_code',
            field=models.CharField(default=shortuuid.main.ShortUUID.uuid, max_length=50, primary_key=True, serialize=False),
        ),
    ]
