# Generated by Django 3.2.8 on 2022-08-01 10:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_analysis', '0007_alter_dockerprocess_resources'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dockerprocess',
            name='resources',
            field=models.CharField(choices=[('32-16', '32 GB RAM, 16 CPU cores'), ('32-1', '32 GB RAM, 1 CPU core'), ('4-1', '4 GB RAM, 1 CPU core')], default='4-1', max_length=20),
        ),
    ]
