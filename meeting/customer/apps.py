from django.apps import AppConfig


class CustomerConfig(AppConfig):

	name = 'meeting.customer'
	verbose_name = 'Customer'

	def ready(self):
		pass