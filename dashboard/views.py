from attr import field
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.views.generic import TemplateView, ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse, reverse_lazy
from django.contrib.auth import authenticate, login, logout
from django.core.serializers import serialize
from api.forms import UserForm, UserProfileForm, jettyForm, bathymetryForm,pictureForm
from django.db.models import Sum, Count
from django.db.models.functions import TruncYear, TruncMonth
import pandas as pd
from scipy.interpolate import griddata
from django.contrib.gis.geos import GEOSGeometry
import numpy as np
from datetime import datetime
import io
# Import Model
from api.models import Accident, Jetty_Videos, UserProfileInfo, Jetty, Route, Jetty_Pictures, Ridership, Jetty_Supervisors, Jetty_Bathymetry
# Process Data Download
from djqscsv import render_to_csv_response
# Serializer to display data



# Create your views here.
class landingView(ListView):
    template_name = "dashboard/landing2.html"
    model = Jetty

class landingViewTest(TemplateView):
    template_name = 'dashboard/landing.html'
    model= Jetty

def dashboard(request):
    template = 'dashboard/kepler.html'
    jetty = Jetty.objects.all()
    context = {
        'pageTitle': "Homepage", 'jetty_list': jetty
    }
    if request.method == "GET":
        return render(request, template, context=context)
    
    try:
        csv_file = request.POST.dict()
        data_set = pd.read_csv(io.StringIO(csv_file['csvtext']), encoding='utf8')
        print(data_set)
        for index, fields in data_set.iterrows():
            jetty = Jetty()
            try:
                jetty.name = fields['Name']
                jetty.terminal = fields['Terminal']
                jetty.type = fields['Type']
                print("POINT(" + str(fields['Long']) + " " +str(fields['Lat']) + ')')
                jetty.geom = GEOSGeometry('MULTIPOINT('+str(fields['Long']) +" " + str(fields["Lat"]) + ')', srid=4326)
                print('Jetty name is', fields[0])
                jetty.save()											
            except:
                print('Error Saving File')
        
        return render(request, template, context=context)
    except:
        csv_file = request.FILES['file']
        data_set = pd.read_csv(csv_file, encoding='utf8')
        data_set = data_set.dropna(how='all',axis=0)
        
        if 'Long' in data_set.columns.to_list() and 'Lat' in data_set.columns.to_list():
            lon = 'Long' 
            lat = 'Lat'
        elif 'X' in data_set.columns.to_list() and 'Y' in data_set.columns.to_list():
            lon = 'X'
            lat = 'Y'
        else:
            context = {
                'pageTitle': "Homepage",
                'message': 'Cant find Longitude and Latitude column'

            }
            return render(request, template, context=context)
        data_set = data_set[data_set[lon].notna()]
        data_set = data_set[data_set[lat].notna()]
        print(data_set.head(10))
        #loop over the lines and save them in db. If error , store as string and then display
        for index, fields in data_set.iterrows():
            jetty = Jetty()
            try:
                if str(fields['Name']) == 'nan':
                    continue
                else:
                    jetty.name = fields['Name']
                if str(fields['Terminal'])== 'nan':
                    print(fields['Name'], 'has no Terminal')
                    pass
                else:
                    jetty.terminal = fields['Terminal']
                if str(fields['Type']) == 'nan':
                    pass
                else:
                    jetty.type = fields['Type']
                if str(fields['Ownership']) == 'nan':
                    pass
                else:
                    jetty.ownership = fields['Ownership']
                if str(fields['Status']) == 'nan':
                    pass
                else:
                    jetty.status = fields['Status']
                jetty.geom = GEOSGeometry('MULTIPOINT('+str(fields[lon]) +" " + str(fields[lat]) + ')', srid=4326)
                print('Jetty name is', fields['Name'])
                jetty.save()											
            except:
                print('Error Saving File')
        
        return render(request, template, context=context)
  
        
class DashboardView(TemplateView):
    template_name = "dashboard/kepler.html"
    title = "Dashboard"

    def get(self, request):
        return render(request, self.template_name, context={'pageTitle': self.title})

# To remove
class KeplerDashboardView(LoginRequiredMixin, TemplateView):
    template_name = "dashboard/kepler.html"
    title = "Kepler Dashboard"

    def get(self, request):
        return render(request, self.template_name, context={'pageTitle': self.title})

class SlideoutView(TemplateView):
    template_name = "dashboard/slideout.html"

class AppearView(TemplateView):
    template_name = "dashboard/appear.html"

@login_required
def user_logout(request):
    logout(request)
    return redirect('login')

# Change this to Show Dashboard Directly
class index(TemplateView):
    template_name = 'dashboard/login.html'
    title = "Login"
    
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('dashboard')
        
        return super(index, self).dispatch(request, *args, **kwargs)

class logon(TemplateView):
    template_name = 'dashboard/login.html'
    title = 'LogIn Page'

    def post(self, request):
        email = self.request.POST['username']
        password= self.request.POST['password']
        user = authenticate(username= email, password= password)
        print(user)
        if user:
            if user.is_active:
                login(request,user)
                return HttpResponseRedirect(reverse('dashboard'))
            else:
                return HttpResponse('Invalid Account Details')
        else:
            print('Someone tried to log on')
            print('Email', email)
            print('Password', password)
            return render(request, self.template_name, context={'pageTitle': self.title, 'errorMessage':"Invalid Login Details"})

    def get(self, request):
        return render(request, self.template_name, context={'pageTitle': self.title, 'errorMessage':""})


class signup(CreateView):
    form_class = UserForm
    success_url = reverse_lazy('login')
    template_name= 'dashboard/register.html'
    title= "Sign Up Page"

class Registration(CreateView):
    model = User
    fields = ('first_name', 'last_name','email', 'password')
    child_model = UserProfileInfo
    child_form_class = UserForm
    child_fields = ('department', 'profile_pics',)
    template_name= "dashboard/registration.html"

def registration_view(request):
    if request.method == 'POST':
        user_form = UserForm(request.POST)
        userinfo_form = UserProfileForm(request.POST)
        if user_form.is_valid() and userinfo_form.is_valid():
            userdetails= user_form.save()
            print(userdetails.pk)
            userinfodata= userinfo_form.save(commit=False)
            userinfodata.user = userdetails
            userinfodata.save()
            new_user = authenticate(username= user_form.cleaned_data.get('email'),
                                    password= user_form.cleaned_data.get('password1'),
                                    )
            login(request, new_user)
            return HttpResponseRedirect(reverse("dashboard"))
        else:
            print("Invalid form")
            print(user_form.errors)
    else:
        print('Not post')
        user_form = UserForm()
        userinfo_form = UserProfileForm()
    context = {'user_form':user_form, 'userinfo_form':userinfo_form, 'pageTitle':'Registration Page'}
    return render(request, "dashboard/registration.html", context)

#def jetty_details(request, pk):
#    model = 
    
class JettyDetailsView(DetailView):
    model = Jetty
    template_name = "dashboard/jetty_detail.html"
    # add other models to this page using context
    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(JettyDetailsView, self).get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        context['jetty_pictures'] = Jetty_Pictures.objects.filter(jetty_id= self.kwargs['pk'])
        context['arrival_count'] = Ridership.objects.filter(jetty_id=self.kwargs['pk']).filter(arrival_departure="Arrival").aggregate(Sum('number_of_passengers'))
        context['departure_count'] = Ridership.objects.filter(jetty_id=self.kwargs['pk']).filter(arrival_departure="Departure").aggregate(Sum('number_of_passengers'))
        context['arrival_boat_count'] = Ridership.objects.filter(jetty_id = self.kwargs['pk']).filter(arrival_departure="Arrival").count()
        context['departure_boat_count'] = Ridership.objects.filter(jetty_id=self.kwargs['pk']).filter(arrival_departure="Departure").count()
        context['ridership'] = Ridership.objects.filter(jetty_id= self.kwargs['pk'])
        return context

class JettyListView(ListView):
    model = Jetty
    template_name = "dashboard/jetty_list.html"


def total_jetty (request):
    totalJetty = Jetty.objects.all().count()
    return HttpResponse(totalJetty)


def jetty_dataset(request):
    bathy = serialize('geojson', Jetty.objects.all())
    return HttpResponse(bathy, content_type= 'json')

def route_dataset(request):
    routes = serialize('geojson', Route.objects.all())
    return HttpResponse(routes, content_type = 'json')

def addJetty(request):
    if request.method == 'POST':
        jetty_form = jettyForm(request.POST)
        jetty_pic = Jetty_Pictures(request.POST)
        jetty_bathymetry = Jetty_Bathymetry(request.POST)
    else:
        jetty_form = jettyForm()
        jetty_pic = Jetty_Pictures()
        jetty_bathymetry = Jetty_Bathymetry()

    context = {'jetty_form': jetty_form, 'jetty_pictures':jetty_pic, 'bathymetry':jetty_bathymetry, 'pageTitle':'Add New Jetty'}
    return render(request, "dashboard/add_jetty.html", context)

class JettyPictureListView(ListView):
    model = Jetty
    template_name = "dashboard/jetty_pic_list.html"

class JettyVideoListView(ListView):
    model = Jetty
    template_name = "dashboard/jetty_vid_list.html"


def add_passenger_data(request):
    if request.method == 'POST':
        form_data = request.POST.dict()
        jettyname = form_data['jettyname']
        for csv in request.FILES.getlist('file'):
            #csv = request.FILES['file']
            # #csv = form_data['file']
            data_set = pd.read_csv(csv, encoding='utf8')
            data_set = data_set.dropna(how='all',axis=0)
            for index, fields in data_set.iterrows():
                passenger = Ridership()
                waterguard = Jetty_Supervisors()
                passenger.jetty_id = Jetty.objects.get(name= jettyname)
                if 'Arrive' in  fields['To (Depart)/  From(Arrive)']:
                    passenger.arrival_departure = 'Arrival'
                elif 'Depart' in fields['To (Depart)/  From(Arrive)']:
                    passenger.arrival_departure = 'Departure'
                else:
                    passenger.arrival_departure = None
                # Fix the time
                try:
                    datetime_obj = fields['Date'].strip()
                    arrival_departure_datetime = datetime.strptime(datetime_obj,"%Y-%m-%d %H:%M:%S.%f")
                    passenger.arrival_departure_date = arrival_departure_datetime.date()
                    passenger.arrival_departure_time = arrival_departure_datetime.time()

                except:
                    try:
                        datetime_obj = fields['Timestamp'].strip()
                        passenger.arrival_departure_time = datetime.strptime(datetime_obj,"%Y-%m-%d %H:%M:%S.%f").time()
                        passenger.arrival_departure_date = datetime.strptime(datetime_obj,"%Y-%m-%d %H:%M:%S.%f").date()
                    except:
                        context = {'dropoptions': option_list, 'pageTitle': 'Add Passenger Data', 'message':'Problem uploading' + datetime_obj}
                        return render(request, 'dashboard/add_passenger.html', context=context)
                passenger.arrival_departure_location = fields['To/From Where (Route)']
                if 'Male' in data_set.columns.to_list():
                    if str(fields['Male']) == 'nan':
                        passenger.number_of_male_passengers = 0
                    else:
                        passenger.number_of_male_passengers = int(fields['Male'])
                    if str(fields['Female']) == 'nan':
                        passenger.number_of_female_passengers = 0
                    else:
                        passenger.number_of_female_passengers = int(fields['Female'])
                else:
                    passenger.number_of_male_passengers = 0
                    passenger.number_of_female_passengers = 0
                if str(fields['No. of Passenger Depart/Arrive']) == 'nan':
                    try:
                        passenger.number_of_passengers = int(fields['Male']) + int(fields['Female'])
                    except:
                        passenger.number_of_passengers = 0
                else:
                    passenger.number_of_passengers = int(fields['No. of Passenger Depart/Arrive'])
                if str(fields['T. fare']) == 'nan':
                    passenger.transport_fare = None
                else:
                    passenger.transport_fare = int(fields['T. fare'])
                if str(fields['Name of Waterguard'])=='nan':
                    print('Name of Waterguard is blank')
                    pass
                else:
                    print('Name of waterguard is', fields['Name of Waterguard'])
                    passenger.waterguard = fields['Name of Waterguard']
                    fullname = fields['Name of Waterguard'].strip()
                    if len(fullname.split()) >= 3:
                        waterguard.firstname = fullname.split()[0].strip()
                        waterguard.middlename = fullname.split()[1].strip()
                        waterguard.surname = fullname.split()[2].strip()
                    elif len(fullname.split()) == 2:
                        waterguard.firstname = fullname.split()[0].strip()
                        waterguard.surname = fullname.split()[1].strip()
                    else:
                        waterguard.firstname = fullname.strip()
                    waterguard.jetty_id = Jetty.objects.get(name= jettyname)
                    waterguard.date_of_supervision = datetime.strptime(datetime_obj,"%Y-%m-%d %H:%M:%S.%f").date()
                    try:
                        print('Saving Waterguard')
                        waterguard.save()
                    except:
                        pass
                    
                try:
                    passenger.save()
                except:
                    pass

        option_list = Jetty.objects.all()
        context = {'dropoptions': option_list, 'pageTitle': 'Add Passenger Data', 'message':'Upload Successful...'}
        return render(request, 'dashboard/add_passenger.html', context=context)
        


    else:
        option_list = Jetty.objects.all()
        context = {'dropoptions': option_list, 'pageTitle': 'Add Passenger Data', 'message':''}
        return render(request, 'dashboard/add_passenger.html', context=context)

def add_accident_data(request):
    if request.method == 'POST':
        form_data = request.POST.dict()

    else:
        option_list = Jetty.objects.all()
        context = {'dropoptions': option_list, 'pageTitle': 'Add Passenger Data'}
        return render(request, 'dashboard/add_accident_data.html', context=context)



def downloadForm(request):
    if request.method == "POST":
        filter_data = request.POST.dict()
        if filter_data['dataOption'] == 'jetty':
            dataReturn = Jetty.objects.values('name', 'terminal', 'type', 'ownership','status', 'roads','parking', 'building', 'waitingRoom', 'ticketArea', 'fender', 'anchor', 'buoys','lifejackets','security', 'fireStation','restrooms', 'landingDock', 'guardRails')
            return render_to_csv_response(dataReturn)
        elif filter_data['dataOption'] == 'route':
            dataReturn = Route.objects.values('name', 'avg_depth')
            return render_to_csv_response(dataReturn)
        elif filter_data['dataOption'] == 'bathymetry':
            location_filter = filter_data['jettyListOption']
        else:
            pass