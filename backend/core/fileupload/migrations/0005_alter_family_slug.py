# Generated by Django 3.2.8 on 2022-08-01 09:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_fileupload', '0004_family_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='family',
            name='slug',
            field=models.SlugField(null=True),
        ),
    ]