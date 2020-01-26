import os
import re
import json
import uuid
import base64

from meeting.customer.models import *

from datetime import timedelta
from django.conf import settings
from django.utils import timezone
from django.core.files.base import ContentFile
from tenant_schemas.utils import tenant_context
from django.core.management import call_command
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey


def codify(label):

	code = re.sub('[^a-zA-Z0-9 \n\.]', '', label)
	code = '_'.join(label.split(' '))
	return code.lower()


def setup_public_tenant():

	'''
		*setup_public_tenant* is a utility to function to populate system with one public tenant in either environments.

		Args:
			It takes no argument

		Return:
			*setup_public_tenant* does not return anything

	'''

	call_command('makemigrations', 'customer')
	call_command('migrate_schemas', '--shared')

	if settings.SETTINGS_MODULE == 'config.settings.local':
		tenant = Tenant.objects.create(domain_url='meeting.localhost', schema_name='public', name='Meeting', setup_completed=True, paid_until=timezone.now().date())

	user, c = User.objects.get_or_create(username=settings.SYSTEM_ADMIN, email=settings.SYSTEM_ADMIN, first_name='System', last_name='Admin', is_staff=True, is_superuser=True)

	user.set_password('meeting@123')
	user.save()


def setup_new_tenant(tenant_data, user_data):

	tenant_data.update({
		'subscription_mode': 'T',
		'subscribed_on': timezone.now(),
		'subscription_ends_on': timezone.now() + timedelta(days=7)
	})

	data = {
		'name':'testing',
		'schema_name':'tenant',
		'setup_completed':True,
		'domain_url':'testing.meeting.localhost',
		'paid_until':timezone.now().date()

	}

	tenant = Tenant.objects.create(**tenant_data)

	call_command('makemigrations', 'common')
	call_command('migrate_schemas', '--tenant')

    user_data = {
        'username': 'vikasjindal.iitp@gmail.com',
        'email': 'vikasjindal.iitp@gmail.com',
        'first_name': 'Vikas',
        'last_name': 'Jindal'
    }

	with tenant_context(tenant):

		password = user_data.pop('password', 'password@123')
		user = User.objects.create(**user_data)
		user.set_password(password)
		user.save()

		print('Here we go!!')
		print('Providing initial data via loaddata')
		loaddata()
		print('Completed importing initial data.')
		print('**********************************')
		print('\n\n')

		tenant.setup_completed = True
		tenant.save()

		print('Exiting setting up new tenant utility function. Enjoy!')
