# Generated by Django 3.2.8 on 2022-08-19 09:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_fileupload', '0006_auto_20220815_1018'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='slug',
            field=models.SlugField(null=True),
        ),
    ]
