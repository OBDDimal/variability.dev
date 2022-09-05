# Generated by Django 3.2.8 on 2022-08-15 08:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_fileupload', '0005_alter_family_slug'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='file',
            name='new_version_of',
        ),
        migrations.AddField(
            model_name='file',
            name='version',
            field=models.CharField(default='1.0.0', max_length=16),
            preserve_default=False,
        ),
    ]
