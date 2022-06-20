# Generated by Django 3.2.8 on 2022-03-11 13:54

import core.fileupload.models.license
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core_fileupload', '0002_auto_20220303_1516'),
    ]

    operations = [
        migrations.CreateModel(
            name='License',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('label', models.TextField(default='CC BY - Mention')),
            ],
            managers=[
                ('objects', core.fileupload.models.license.LicenseManager()),
            ],
        ),
        migrations.AlterField(
            model_name='file',
            name='license',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core_fileupload.license'),
        ),
    ]