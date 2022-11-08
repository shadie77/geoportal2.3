from rest_framework import viewsets
from rest_framework.decorators import action
from django.contrib.auth.models import User
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum
import nltk
import numpy as np
import pandas as pd
from scipy.interpolate import griddata
from nltk.tokenize import word_tokenize
from django.db.models import Count
from collections import Counter
from django.db.models.functions import TruncYear, TruncMonth, TruncHour
from .serializers import UserSerializer, jettySerializer, routeSerializer, bathySerializer, UserInfoSerializer, depthSerializer, boundarySerializer, ridershipSerializer, accidentSerializer, jettyPictureSerializer, jettyBathymetrySerializer, bathyRasterSerializer
from .models import Jetty_Pictures, Route, Bathy, Jetty, UserProfileInfo, Depth, Water_Boundary, Ridership, Accident,Jetty_Bathymetry, Bathyraster


# Create your viewsets here.
class UserProfileViewSet(viewsets.ModelViewSet):
    queryset= UserProfileInfo.objects.all()
    serializer_class = UserInfoSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class bathyViewSet(viewsets.ModelViewSet):
    queryset = Bathy.objects.all()
    serializer_class = bathySerializer

class routeViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = routeSerializer

class jettyViewSet(viewsets.ModelViewSet):
    queryset = Jetty.objects.all()
    serializer_class = jettySerializer

    # Return total number oj jetties 
    #Make details true later
    @action(detail=False)
    def count(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        count = queryset.count()
        content = {'count': count}
        return Response(content)

class depthViewSet(viewsets.ModelViewSet):
    queryset = Depth.objects.all()
    serializer_class = depthSerializer

class boundaryViewSet(viewsets.ModelViewSet):
    queryset = Water_Boundary.objects.all()
    serializer_class = boundarySerializer

class ridershipViewset(viewsets.ModelViewSet):
    queryset = Ridership.objects.all()
    serializer_class = ridershipSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {'jetty_id': ['exact'],
                        'arrival_departure': ['exact'],
                         'arrival_departure_time': ['gte', 'lte', 'exact','range', 'gt', 'lt'],
                         'number_of_male_passengers': ['gte', 'lte', 'exact', 'gt', 'lt'],
                         'number_of_female_passengers': ['gte', 'lte', 'exact', 'gt', 'lt'],
                         'transport_fare': ['gte', 'lte', 'exact', 'gt', 'lt'],
                         'arrival_departure_date': ['gte', 'lte', 'exact','range', 'gt', 'lt']
                         }

    #Make details true later
    @action(detail= False)
    def average_daily_count(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        first_day = queryset.order_by("arrival_departure_date").first().arrival_departure_date
        last_day = queryset.order_by("arrival_departure_date").last().arrival_departure_date
        number_of_days = last_day - first_day
        total_passenger = queryset.aggregate(Sum('number_of_passengers'))
        total_boat_ride = queryset.count()
        content = {
            'first_day': first_day,
            'last_day': last_day,
            'number_of_days': number_of_days.days,
            'total_number_of_passengers': total_passenger['number_of_passengers__sum'],
            'average_daily_passenger': round(total_passenger['number_of_passengers__sum']/number_of_days.days, 2),
            'total_boat_ride' : total_boat_ride,
            'average_daily_boat_ride': round(total_boat_ride/number_of_days.days, 2)
            }
        return Response(content)

    @action(detail= False)
    def daily_data(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        total_passenger = queryset.aggregate(Sum('number_of_passengers'))
        total_boat_ride = queryset.count()
        content = {
            'total_number_of_passengers': total_passenger['number_of_passengers__sum'],
            'total_boat_ride' : total_boat_ride
            }
        return Response(content)

    @action(detail= False)
    def boat_data(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        total_boat_in = queryset.filter(arrival_departure="Arrival").count()
        total_boat_out = queryset.filter(arrival_departure="Departure").count()
        timehour = queryset.annotate(hour=TruncHour('arrival_departure_time')).values('hour').annotate(count=Count('id'))

        content = {
            'totalBoatIn': total_boat_in,
            'totalBoatOut': total_boat_out,
            'timehourlabel': [listhour['hour'] for listhour in timehour],
            'timehourcount': [listhour['count'] for listhour in timehour]
        }
        return Response(content)

    @action(detail= False)
    def passenger_data(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        arrival_count = queryset.filter(arrival_departure="Arrival").aggregate(Sum('number_of_passengers'))
        departure_count = queryset.filter(arrival_departure="Departure").aggregate(Sum('number_of_passengers'))
        passengerArrival = queryset.filter(arrival_departure="Arrival")
        femalePassengerArrival = passengerArrival.aggregate(Sum('number_of_female_passengers'))
        malePassengerArrival = passengerArrival.aggregate(Sum('number_of_male_passengers'))
        passengerList = passengerArrival.annotate(year=TruncYear('arrival_departure_date')).values('year').annotate(Sum('number_of_passengers')).order_by('year')
        passengerDeparture = queryset.filter(arrival_departure="Departure")
        femalePassengerDeparture = passengerDeparture.aggregate(Sum('number_of_female_passengers'))
        malePassengerDeparture = passengerDeparture.aggregate(Sum('number_of_male_passengers'))
        passengerDepartureList = passengerDeparture.annotate(year=TruncYear('arrival_departure_date')).values('year').annotate(Sum('number_of_passengers')).order_by('year')
        labels = [eachyear['year'].strftime('%Y') for eachyear in passengerList]
        passengerInCount = [num['number_of_passengers__sum'] for num in passengerList]
        labelsOut = [eachyear['year'].strftime('%Y') for eachyear in passengerDepartureList]
        passengerOutCount = [out['number_of_passengers__sum'] for out in passengerDepartureList]
        content = {
            'totalPassengerIn' : arrival_count['number_of_passengers__sum'],
            'totalPassengerOut': departure_count['number_of_passengers__sum'],
            'totalMaleIn': malePassengerArrival['number_of_male_passengers__sum'],
            'totalFemaleIn': femalePassengerArrival['number_of_female_passengers__sum'],
            'totalMaleOut': malePassengerDeparture['number_of_male_passengers__sum'],
            'totalFemaleOut': femalePassengerDeparture['number_of_female_passengers__sum'],
            'passengerOutCount': passengerOutCount,
            'labelsOut': labelsOut,
            'labels': labels,
            'passengerInCount': passengerInCount
        }
        return Response(content)

    @action(detail = False)
    def trip_data(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        result = list(queryset.values_list('arrival_departure_location', flat = True))
        resultlower = [name.lower() for name in result]
        word_count= dict(Counter(resultlower))
        word_count_order = {k: v for k, v in sorted(word_count.items(), reverse=True, key=lambda item: item[1])}
        labels = word_count_order.keys()
        numbercount = word_count_order.values()
        
        content = {
            'labels': labels,
            'total': numbercount
        }
        return Response(content)

    @action(detail=False)
    def route_count(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        val = queryset.values_list('jetty_id', 'arrival_departure', 'arrival_departure_location')
        bag = [','.join(map(str, eachList)) for eachList in val]
        word_count = dict(Counter(bag))
        word_count_order = {k: v for k, v in sorted(word_count.items(), reverse=True, key=lambda item: item[1])}
        context = {
            'route_rank': word_count_order
        }
        return Response(context)

    @action(detail=False)
    def hourly_passenger(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        hourly = queryset.annotate(hour=TruncHour('arrival_departure_time')).values('hour').annotate(total=Sum('number_of_passengers'))
        if len(hourly) > 1:
            start_time = hourly[0]['hour']
            end_time = hourly[len(hourly)-1]['hour']
            time_range = pd.date_range(pd.to_datetime(str(start_time)), pd.to_datetime(str(end_time)), freq='H')
            time_list = []
            for eachtime in time_range:
                time_list.append({'hour': eachtime.time(), 'total': 0})
            for eachdict in hourly:
                for eachdictionary in time_list:
                    if eachdict['hour'] == eachdictionary['hour']:
                        eachdictionary['total'] = eachdict['total']


            context = {
                'hourly' : time_list
            }
            return Response(context)
        context = {
            "hourly" : hourly
        }
        return Response(context)


class accidentViewset(viewsets.ModelViewSet):
    queryset = Accident.objects.all()
    serializer_class = accidentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {'accident_date': ['gte', 'lte', 'exact','range', 'gt', 'lt'],
                        'accident_time': ['gte', 'lte', 'exact','range', 'gt', 'lt'],
                        'location': ['exact'],
                        'number_of_injuries': ['gte', 'lte', 'exact','range', 'gt', 'lt'],
                        'Boat_type_or_name': ['exact'],
                        'number_of_death': ['gte', 'lte', 'exact','range', 'gt', 'lt'],
                        'number_of_rescues': ['gte', 'lte', 'exact','range', 'gt', 'lt'],
                        'cause': ['exact']
                            }

    #Make details true later
    @action(detail= False)
    def accident_data(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        count = queryset.count()
        casuality = queryset.aggregate(Sum('number_of_casuality'))['number_of_casuality__sum']
        injuries = queryset.aggregate(Sum('number_of_injuries'))['number_of_injuries__sum']
        death = queryset.aggregate(Sum('number_of_death'))['number_of_death__sum']
        rescue = queryset.aggregate(Sum('number_of_rescues'))['number_of_rescues__sum']
        accident_cause_list = list(queryset.values_list('cause', flat = True))
        sw = nltk.corpus.stopwords.words('english')
        bag_of_words = []
        ## Remove stopwords
        for word in accident_cause_list:
            tokens = word_tokenize(word)
            for eachtoken in tokens:
                if eachtoken not in sw:
                    bag_of_words.append(eachtoken)
        word_count= dict(Counter(bag_of_words))
        

        content = {
            'casuality': casuality,
            'injury_rate': round(injuries/ casuality*100,2),
            'death_rate': round(death / casuality *100,2),
            'rescue_rate':round(rescue / casuality *100, 2),
            'word_count': word_count,
            'count': count
            }
        return Response(content)
    


class jettyPictureViewset(viewsets.ModelViewSet):
    queryset = Jetty_Pictures.objects.all()
    serializer_class = jettyPictureSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['jetty_id']

    @action(detail= False)
    def pic_list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        pic_list = list(queryset.values_list('picture', flat = True))
        content = {
            'pictures': pic_list
        }
        return Response(content)

class bathyRasterViewset(viewsets.ModelViewSet):
    queryset = Bathyraster.objects.all()
    serializer_class = bathyRasterSerializer



class jettyBathymetryViewset(viewsets.ModelViewSet):
    queryset = Jetty_Bathymetry.objects.all()
    serializer_class = jettyBathymetrySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {'jetty_id': ['exact']}

    @action(detail=False)
    def bathy_depth(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        # Bathymetry data for jetty
        try:
                
            result = list(queryset.values_list('bathymetry', flat = True))
            bathy = pd.read_csv("http://127.0.0.1:8000/Documents/laswa/backend/media/"+result[0])
            bathy_x = np.array(bathy.X)
            bathy_y = np.array(bathy.Y)
            bathy_z = np.array(bathy.Z)
            bathy_xi = np.linspace(bathy_x.min(), bathy_x.max(), 100)
            bathy_yi = np.linspace(bathy_y.min(), bathy_y.max(), 100)
            bathy_X, bathy_Y = np.meshgrid(bathy_xi, bathy_yi)
            bathy_Z = griddata((bathy_x, bathy_y), bathy_z,( bathy_X, bathy_Y), method='nearest', fill_value= 0.0)
            context = {'x':bathy_xi.tolist(), 'y': bathy_yi.tolist(), "z":bathy_Z.tolist()}
            return Response(context)
        except:
            context = {'x':[], "y":[], "z":[]}
            return Response(context)