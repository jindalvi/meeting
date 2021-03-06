# Generated by Django 2.2.9 on 2020-01-26 13:45

from django.db import migrations, models
import meeting.common.utils
import tenant_schemas.postgresql_backend.base


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Tenant',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('domain_url', models.CharField(max_length=128, unique=True)),
                ('schema_name', models.CharField(max_length=63, unique=True, validators=[tenant_schemas.postgresql_backend.base._check_schema_name])),
                ('name', models.CharField(max_length=128)),
                ('slug', models.CharField(max_length=128)),
                ('paid_until', models.DateField()),
                ('on_trial', models.BooleanField(default=True)),
                ('created_on', models.DateField(auto_now_add=True)),
                ('logo', meeting.common.utils.ContentTypeRestrictedFileField(blank=True, max_length=512, null=True, upload_to=meeting.common.utils.upload_to)),
                ('testing_email', models.CharField(blank=True, max_length=255, null=True)),
                ('activate_emails', models.BooleanField(default=False)),
                ('testing_mode', models.BooleanField(default=False)),
                ('setup_completed', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
