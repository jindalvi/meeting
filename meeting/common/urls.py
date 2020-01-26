from django.conf import settings
import meeting.common.views as views

from django.urls import include, path

app_name = 'common'

urlpatterns = [

	path('login/', 
		views.Login.as_view(),
		 name='login'),

	path('logout/', 
		views.Logout.as_view(),
		 name='logout'),
	
	path('', views.Landing.as_view(), name='landing')

]