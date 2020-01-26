import re
import uuid
import base64
import string
import random
import logging
import difflib
import traceback

from meeting.common.models import *
from meeting.common.responses import *

from copy import deepcopy
from django.shortcuts import *
from django.conf import settings
from django.utils import timezone
from django.db.models import Value
from django.contrib import messages
from datetime import datetime, timedelta
from django.urls import reverse
from django.template.loader import get_template
from django.db.models.functions import Concat
from django.core.serializers import serialize
# from django.core.exceptions import PermissionDenied
from django.template.loader import render_to_string
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.views.generic import View, TemplateView, FormView
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, Http404, HttpResponseNotFound, JsonResponse
from django.contrib.staticfiles.templatetags.staticfiles import static



class Login(TemplateView):

	'''
		Login view is a standard authenticator view for hostelonease. It accepts username and password, authenticates them and provides login to user if the credentials supplied are valid.

		Args:
			*args: Arbitrary number of arguments.
			**kwargs: Arbitrary number of named arguments.

		Returns:
			It returns user to his/her home page if authentication is
			successful else returns the login page with errors.

	'''

	def get(self, request, *args, **kwargs):

		self.template_name = 'common/login.html'

		action = reverse('common:login')

		context = {
			'action': action
		}

		storage = messages.get_messages(request)
		storage.used = True

		if request.user.is_authenticated:
			return redirect(reverse('common:landing'))

		return self.render_to_response(context)


	def post(self, request, *args, **kwargs):

		try:
			data = request.POST.dict()

			username = data.get('username')
			password = data.get('password')

			user = authenticate(request, username=username, password=password)

			context = dict()

			if user is not None:
				login(request, user)

				context.update({'redirect_url':reverse('common:landing')})

				return success(context)
			else:
				return bad_request(message='Username or password is incorrect')

		except Exception as e:
			print(traceback.print_exc())
			raise Http404()



class Logout(View):

	'''
		Logout view is a standard django logout view which logs out an authenticated user.

		Args:
			*args: Arbitrary number of arguments
			**kwargs: Arbitrary number of named arguments

		Returns:
			It returns user to login page after a successful logout.

	'''

	@method_decorator(login_required)
	def get(self, request, *args, **kwargs):

		user = request.user

		if request.user.is_authenticated:
			logout(request)

		return redirect(reverse('hostel:login'))



class Landing(TemplateView):

	def get(self, request, *args, **kwargs):

		self.template_name = 'common/landing.html'

		try:

			return self.render_to_response({})

		except Exception as e:
			print(e)
			raise Http404()
