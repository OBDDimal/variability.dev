# Generated by Django 3.2.8 on 2022-08-01 09:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_fileupload', '0003_family_date_created'),
    ]

    operations = [
        migrations.AddField(
            model_name='family',
            name='slug',
            field=models.SlugField(default=models.CharField(max_length=255)),
        ),
    ]
