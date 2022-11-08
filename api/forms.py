from attr import field, fields
from django import forms
from django.contrib.gis import forms as gisform
from django.contrib.auth.models import User
from .models import Jetty_Pictures, UserProfileInfo
from phonenumber_field.modelfields import PhoneNumberField
from django.contrib.auth.forms import UserCreationForm
from api.models import Jetty, Jetty_Bathymetry, Jetty_Pictures


class UserForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=True, help_text='Enter your firstname')
    last_name = forms.CharField(max_length=30, required=True, help_text='Enter your surname')
    email = forms.EmailField(max_length=254, required=True, help_text="Required. Insert a valid email address")
    class Meta:
        model= User
        fields = ["first_name", 'last_name', 'username','email','password1', 'password2']
        widgets = {
            'first_name': forms.TextInput(attrs={'placeholder': 'Enter your first name'}),
            'last_name': forms.TextInput(attrs={'placeholder': 'Enter your last name'}),
        }

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfileInfo
        fields= ["phone_number"]

class jettyForm(gisform.ModelForm):
    class Meta:
        model = Jetty
        fields = "__all__"
        widgets = {
            'name': gisform.TextInput(attrs={'Placeholder': 'Please enter jetty name here'}),
            'terminal': gisform.TextInput(attrs={'Placeholder': 'Please enter jetty type here'}),
            'type': gisform.TextInput(attrs={'Placeholder': 'Enter landing type. (e.g Concrete, Wooden, Metallic)'}),
            "restaurants": gisform.RadioSelect(attrs={'class': 'form-check-inline'}),
            "roads": gisform.RadioSelect(attrs={'class': 'form-check-inline'}),
            "parking": gisform.RadioSelect(attrs={'class': 'form-check-inline'}),
            "building": gisform.RadioSelect(attrs={'class': 'form-check-inline'}),
            "waitingRoom": gisform.RadioSelect(attrs={'class': 'form-check-inline'}),
            "ticketArea": gisform.RadioSelect(attrs={'class': 'form-check-inline'}),
            "restrooms": gisform.RadioSelect(attrs={'class': 'form-check-inline'}),
            "disabilityRamp": gisform.RadioSelect(attrs={'class': 'form-check-inline'}),
            "fender": gisform.RadioSelect(attrs={'class': 'form-check-inline'}),
            "anchor": gisform.RadioSelect(attrs={'class': 'form-check-inline'}),
            "buoys": gisform.RadioSelect(attrs={'class': 'form-check-inline'}),
            "lifeJackets": gisform.RadioSelect(attrs={'class': 'form-check-inline'}),
            "security": gisform.RadioSelect(attrs={'class': 'form-check-inline'}),
            "fireStation": gisform.RadioSelect(attrs={'class': 'form-check-inline'}),
            "guardRails": gisform.RadioSelect(attrs={'class': 'form-check-inline'}),
            "landingDock": gisform.RadioSelect(attrs={'class': 'form-check-inline'})
        }

class bathymetryForm(forms.ModelForm):
    class Meta:
        model = Jetty_Bathymetry
        fields = "__all__"

class pictureForm(forms.ModelForm):
    class Meta:
        model = Jetty_Pictures
        fields = "__all__"