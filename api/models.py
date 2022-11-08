from unicodedata import name
from django.db import models as nmodels
from django.contrib.gis.db import models
from django.contrib.auth.models import User
from numpy import size
from phonenumber_field.modelfields import PhoneNumberField
from django_resized import ResizedImageField

# Make Email address unique
User._meta.get_field('email')._unique = True


# Change the ModelBackend to Login With Email only
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            user = UserModel.objects.get(email=username)
        except UserModel.DoesNotExist:
            return None
        else:
            if user.check_password(password):
                return user
        return None

# Change the Model Backend to Login with Either Email or Username
from django.contrib.auth.backends import ModelBackend, UserModel
from django.db.models import Q

class CustomBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try: #to allow authentication through phone number or any other field, modify the below statement
            user = UserModel.objects.get(Q(username__iexact=username) | Q(email__iexact=username))
        except UserModel.DoesNotExist:
            UserModel().set_password(password)
        except MultipleObjectsReturned:
            return User.objects.filter(email=username).order_by('id').first()
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user

    def get_user(self, user_id):
        try:
            user = UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None

        return user if self.user_can_authenticate(user) else None

# Create your models here.
class UserProfileInfo(nmodels.Model):
    user = nmodels.OneToOneField(User,default=None, null=True, related_name="user_profile", on_delete=models.CASCADE)
    #Additional Information
    department = nmodels.CharField(max_length=20, blank = True)
    phone_number = PhoneNumberField(blank = True)
    profile_pic = nmodels.ImageField(upload_to="profile_pics", blank=True)
    created_at = nmodels.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.user.email


class Route(models.Model):
    name = models.CharField(max_length=254)
    route_id = models.CharField(max_length=254)
    avg_depth = models.FloatField()
    geom = models.MultiLineStringField(srid=4326)

BOAT_TYPES= (
    ('Wooden', "Wooden"),
    ("Fiber", "Fiber"),
    ('Aluminium', "Aluminiun"),
    ("Steel", "Steel"),
    ("Others", "Others")
)

NEEDS_TYPE= (
    ('Yes', "Yes"),
    ("No", "No"),
    ('Unknown', "Unknown")
)

class Jetty(models.Model):
    name = models.CharField(max_length=254, unique=True)
    terminal = models.CharField(max_length=254)
    type = models.CharField(max_length=254)
    ownership = models.CharField(max_length= 254, default='LASG')
    status = models.CharField(max_length= 254, default='Operational')
    geom = models.MultiPointField(srid=4326, unique=True)
    picture = ResizedImageField(size= [250,150], upload_to = "small_jetty", blank= True)
    restaurants = models.CharField(max_length=254, choices=NEEDS_TYPE, default= "Unknown", blank=False, null = True)
    roads = models.CharField(max_length=254, choices=NEEDS_TYPE, default= "Unknown", blank=False, null = True)
    parking = models.CharField(max_length=254, choices=NEEDS_TYPE, default= "Unknown", blank=False, null = True)
    building = models.CharField(max_length=254, choices=NEEDS_TYPE, default= "Unknown", blank=False, null = True)
    waitingRoom = models.CharField(max_length=254, choices=NEEDS_TYPE, default= "Unknown", blank=False, null = True)
    ticketArea = models.CharField(max_length=254, choices=NEEDS_TYPE, default= "Unknown", blank=False, null = True)
    fender = models.CharField(max_length=254, choices=NEEDS_TYPE, default= "Unknown", blank=False, null = True)
    anchor = models.CharField(max_length=254, choices=NEEDS_TYPE, default= "Unknown", blank=False, null = True)
    buoys = models.CharField(max_length=254, choices=NEEDS_TYPE, default= "Unknown", blank=False, null = True)
    lifeJackets = models.CharField(max_length=254, choices=NEEDS_TYPE, default= "Unknown", blank=False, null = True)
    security = models.CharField(max_length=254, choices=NEEDS_TYPE, default= "Unknown", blank=False, null = True)
    fireStation = models.CharField(max_length=254, choices=NEEDS_TYPE, default= "Unknown", blank=False, null = True)
    disabilityRamp = models.CharField(max_length=254, choices=NEEDS_TYPE, default= "Unknown", blank=False, null = True)
    restrooms = models.CharField(max_length=254, choices=NEEDS_TYPE, default= "Unknown", blank=False, null = True)
    landingDock = models.CharField(max_length=254, choices=NEEDS_TYPE, default= "Unknown", blank=False, null = True)
    guardRails = models.CharField(max_length=254, choices=NEEDS_TYPE, default= "Unknown", blank=False, null = True)


    def __str__(self):
        return self.name


class Bathy(models.Model):
    depth = models.FloatField()
    long = models.FloatField()
    lat = models.FloatField()
    geom = models.MultiPointField(srid=4326)


class Depth(models.Model):
    value = models.FloatField()
    geom = models.MultiPolygonField(srid=4326)

# Water Boundary class
class Water_Boundary(models.Model):
    id_number = models.IntegerField()
    geom = models.MultiPolygonField(srid=4326)

class Jetty_Supervisors(nmodels.Model):
    firstname= nmodels.CharField(max_length=254, blank=True, null=True)
    middlename = nmodels.CharField(max_length=254, blank=True, null=True)
    surname = nmodels.CharField(max_length=254, blank=True, null= True)
    jetty_id = nmodels.ForeignKey(Jetty, on_delete=nmodels.CASCADE)
    date_of_supervision = nmodels.DateField(blank=True, null= True)

    class Meta:
        unique_together = ["jetty_id", "date_of_supervision", "firstname", 'surname']


class Jetty_Pictures(nmodels.Model):
    jetty_id = nmodels.ForeignKey(Jetty, on_delete= nmodels.CASCADE)
    picture = ResizedImageField(size = [1920, 1080], upload_to = "jetty", blank = True)
    header_picture = ResizedImageField(size = [1050, 300], upload_to = "header_jetty", blank = True)
    medium_picture = ResizedImageField(size= [500,300], upload_to ="medium_jetty", blank= True)

    def __str__(self):
        return self.jetty_id.name

class Jetty_Videos(nmodels.Model):
    jetty_id = nmodels.ForeignKey(Jetty, on_delete= nmodels.CASCADE)
    video = nmodels.FileField()

class Jetty_Bathymetry(nmodels.Model):
    jetty_id= nmodels.ForeignKey(Jetty, on_delete=nmodels.CASCADE)
    bathymetry = nmodels.FileField(upload_to='bathymetry')

class Drivers(nmodels.Model):
    first_name = nmodels.CharField(max_length= 254, blank= True)
    last_name = nmodels.CharField(max_length= 254, blank= True)
    email = nmodels.EmailField(blank= True)
    date_of_birth = nmodels.DateField()

class Boat (nmodels.Model):
    boat_name = nmodels.CharField(max_length=254, blank= True)
    boat_type = nmodels.CharField(max_length=254, choices=BOAT_TYPES, default=None, blank=True)
    boat_driver = nmodels.ForeignKey(Drivers, on_delete=nmodels.CASCADE)
    boat_capacity = nmodels.IntegerField(blank = True, null = True)

RIDERSHIP_OPTIONS = (
    ("Arrival", "Arrival"),
    ("Departure", "Departure")
)
class Ridership(nmodels.Model):
    jetty_id = nmodels.ForeignKey(Jetty, related_name = "ridershipLocation" ,on_delete= nmodels.CASCADE)
    arrival_departure = nmodels.CharField(max_length=254, choices=RIDERSHIP_OPTIONS, default = None)
    arrival_departure_time = nmodels.TimeField(blank=True, null=True)
    arrival_departure_location = nmodels.CharField(max_length= 254, blank=True, default=None)
    number_of_male_passengers = nmodels.IntegerField(blank= True, null=True)
    number_of_female_passengers = nmodels.IntegerField(blank= True, null=True)
    number_of_passengers = nmodels.IntegerField(blank= True, null=True)
    transport_fare = nmodels.PositiveIntegerField(blank=True, null=True)
    boat_name = nmodels.CharField(max_length=254, default = None, blank=True, null=True)
    waterguard = nmodels.CharField(max_length = 254, blank= True)
    arrival_departure_date = nmodels.DateField(blank=True, null=True)
    class Meta:
        unique_together = ["jetty_id", "arrival_departure", "arrival_departure_time", 'arrival_departure_location']
        ordering = ["arrival_departure_date"]

class Accident(nmodels.Model):
    Boat_type_or_name = nmodels.TextField(blank = True)
    accident_date = nmodels.DateField(blank=True, null= True)
    accident_time = nmodels.TimeField(blank=True, null = True)
    location = nmodels.CharField(max_length=254, blank= True)
    number_of_casuality = nmodels.IntegerField(blank= True)
    number_of_injuries = nmodels.IntegerField(blank= True)
    number_of_death = nmodels.IntegerField(blank=True)
    number_of_rescues = nmodels.IntegerField(blank=True)
    cause = nmodels.TextField(blank=True)

class Bathyraster(models.Model):
    name = models.CharField(max_length=100)
    rast = models.RasterField()
    time_of_survey = models.DateField(blank=True, null=True)
    class Meta:
        unique_together = ['name', 'time_of_survey']

