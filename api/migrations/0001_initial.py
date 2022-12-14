# Generated by Django 4.0.2 on 2022-10-22 13:16

from django.conf import settings
import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion
import django_resized.forms
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Accident',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Boat_type_or_name', models.TextField(blank=True)),
                ('accident_date', models.DateField(blank=True, null=True)),
                ('accident_time', models.TimeField(blank=True, null=True)),
                ('location', models.CharField(blank=True, max_length=254)),
                ('number_of_casuality', models.IntegerField(blank=True)),
                ('number_of_injuries', models.IntegerField(blank=True)),
                ('number_of_death', models.IntegerField(blank=True)),
                ('number_of_rescues', models.IntegerField(blank=True)),
                ('cause', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Bathy',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('depth', models.FloatField()),
                ('long', models.FloatField()),
                ('lat', models.FloatField()),
                ('geom', django.contrib.gis.db.models.fields.MultiPointField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='Depth',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.FloatField()),
                ('geom', django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='Drivers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(blank=True, max_length=254)),
                ('last_name', models.CharField(blank=True, max_length=254)),
                ('email', models.EmailField(blank=True, max_length=254)),
                ('date_of_birth', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='Jetty',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=254, unique=True)),
                ('terminal', models.CharField(max_length=254)),
                ('type', models.CharField(max_length=254)),
                ('ownership', models.CharField(default='LASG', max_length=254)),
                ('status', models.CharField(default='Operational', max_length=254)),
                ('geom', django.contrib.gis.db.models.fields.MultiPointField(srid=4326, unique=True)),
                ('picture', django_resized.forms.ResizedImageField(blank=True, crop=None, force_format='JPEG', keep_meta=True, quality=75, scale=None, size=[250, 150], upload_to='small_jetty')),
                ('restaurants', models.CharField(choices=[('Yes', 'Yes'), ('No', 'No'), ('Unknown', 'Unknown')], default='Unknown', max_length=254, null=True)),
                ('roads', models.CharField(choices=[('Yes', 'Yes'), ('No', 'No'), ('Unknown', 'Unknown')], default='Unknown', max_length=254, null=True)),
                ('parking', models.CharField(choices=[('Yes', 'Yes'), ('No', 'No'), ('Unknown', 'Unknown')], default='Unknown', max_length=254, null=True)),
                ('building', models.CharField(choices=[('Yes', 'Yes'), ('No', 'No'), ('Unknown', 'Unknown')], default='Unknown', max_length=254, null=True)),
                ('waitingRoom', models.CharField(choices=[('Yes', 'Yes'), ('No', 'No'), ('Unknown', 'Unknown')], default='Unknown', max_length=254, null=True)),
                ('ticketArea', models.CharField(choices=[('Yes', 'Yes'), ('No', 'No'), ('Unknown', 'Unknown')], default='Unknown', max_length=254, null=True)),
                ('fender', models.CharField(choices=[('Yes', 'Yes'), ('No', 'No'), ('Unknown', 'Unknown')], default='Unknown', max_length=254, null=True)),
                ('anchor', models.CharField(choices=[('Yes', 'Yes'), ('No', 'No'), ('Unknown', 'Unknown')], default='Unknown', max_length=254, null=True)),
                ('buoys', models.CharField(choices=[('Yes', 'Yes'), ('No', 'No'), ('Unknown', 'Unknown')], default='Unknown', max_length=254, null=True)),
                ('lifeJackets', models.CharField(choices=[('Yes', 'Yes'), ('No', 'No'), ('Unknown', 'Unknown')], default='Unknown', max_length=254, null=True)),
                ('security', models.CharField(choices=[('Yes', 'Yes'), ('No', 'No'), ('Unknown', 'Unknown')], default='Unknown', max_length=254, null=True)),
                ('fireStation', models.CharField(choices=[('Yes', 'Yes'), ('No', 'No'), ('Unknown', 'Unknown')], default='Unknown', max_length=254, null=True)),
                ('disabilityRamp', models.CharField(choices=[('Yes', 'Yes'), ('No', 'No'), ('Unknown', 'Unknown')], default='Unknown', max_length=254, null=True)),
                ('restrooms', models.CharField(choices=[('Yes', 'Yes'), ('No', 'No'), ('Unknown', 'Unknown')], default='Unknown', max_length=254, null=True)),
                ('landingDock', models.CharField(choices=[('Yes', 'Yes'), ('No', 'No'), ('Unknown', 'Unknown')], default='Unknown', max_length=254, null=True)),
                ('guardRails', models.CharField(choices=[('Yes', 'Yes'), ('No', 'No'), ('Unknown', 'Unknown')], default='Unknown', max_length=254, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Route',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=254)),
                ('route_id', models.CharField(max_length=254)),
                ('avg_depth', models.FloatField()),
                ('geom', django.contrib.gis.db.models.fields.MultiLineStringField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='Water_Boundary',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('id_number', models.IntegerField()),
                ('geom', django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfileInfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('department', models.CharField(blank=True, max_length=20)),
                ('phone_number', phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, region=None)),
                ('profile_pic', models.ImageField(blank=True, upload_to='profile_pics')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.OneToOneField(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Jetty_Videos',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('video', models.FileField(upload_to='')),
                ('jetty_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.jetty')),
            ],
        ),
        migrations.CreateModel(
            name='Jetty_Pictures',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('picture', django_resized.forms.ResizedImageField(blank=True, crop=None, force_format='JPEG', keep_meta=True, quality=75, scale=None, size=[1920, 1080], upload_to='jetty')),
                ('header_picture', django_resized.forms.ResizedImageField(blank=True, crop=None, force_format='JPEG', keep_meta=True, quality=75, scale=None, size=[1050, 300], upload_to='header_jetty')),
                ('medium_picture', django_resized.forms.ResizedImageField(blank=True, crop=None, force_format='JPEG', keep_meta=True, quality=75, scale=None, size=[500, 300], upload_to='medium_jetty')),
                ('jetty_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.jetty')),
            ],
        ),
        migrations.CreateModel(
            name='Jetty_Bathymetry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bathymetry', models.FileField(upload_to='bathymetry')),
                ('jetty_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.jetty')),
            ],
        ),
        migrations.CreateModel(
            name='Boat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('boat_name', models.CharField(blank=True, max_length=254)),
                ('boat_type', models.CharField(blank=True, choices=[('Wooden', 'Wooden'), ('Fiber', 'Fiber'), ('Aluminium', 'Aluminiun'), ('Steel', 'Steel'), ('Others', 'Others')], default=None, max_length=254)),
                ('boat_capacity', models.IntegerField(blank=True, null=True)),
                ('boat_driver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.drivers')),
            ],
        ),
        migrations.CreateModel(
            name='Bathyraster',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('rast', django.contrib.gis.db.models.fields.RasterField(srid=4326)),
                ('time_of_survey', models.DateField(blank=True, null=True)),
            ],
            options={
                'unique_together': {('name', 'time_of_survey')},
            },
        ),
        migrations.CreateModel(
            name='Ridership',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('arrival_departure', models.CharField(choices=[('Arrival', 'Arrival'), ('Departure', 'Departure')], default=None, max_length=254)),
                ('arrival_departure_time', models.TimeField(blank=True, null=True)),
                ('arrival_departure_location', models.CharField(blank=True, default=None, max_length=254)),
                ('number_of_male_passengers', models.IntegerField(blank=True, null=True)),
                ('number_of_female_passengers', models.IntegerField(blank=True, null=True)),
                ('number_of_passengers', models.IntegerField(blank=True, null=True)),
                ('transport_fare', models.PositiveIntegerField(blank=True, null=True)),
                ('boat_name', models.CharField(blank=True, default=None, max_length=254, null=True)),
                ('waterguard', models.CharField(blank=True, max_length=254)),
                ('arrival_departure_date', models.DateField(blank=True, null=True)),
                ('jetty_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ridershipLocation', to='api.jetty')),
            ],
            options={
                'ordering': ['arrival_departure_date'],
                'unique_together': {('jetty_id', 'arrival_departure', 'arrival_departure_time', 'arrival_departure_location')},
            },
        ),
        migrations.CreateModel(
            name='Jetty_Supervisors',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('firstname', models.CharField(blank=True, max_length=254, null=True)),
                ('middlename', models.CharField(blank=True, max_length=254, null=True)),
                ('surname', models.CharField(blank=True, max_length=254, null=True)),
                ('date_of_supervision', models.DateField(blank=True, null=True)),
                ('jetty_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.jetty')),
            ],
            options={
                'unique_together': {('jetty_id', 'date_of_supervision', 'firstname', 'surname')},
            },
        ),
    ]
