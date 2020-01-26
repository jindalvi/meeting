from django.apps import AppConfig

class CommonConfig(AppConfig):

	name = 'meeting.common'
	verbose_name = 'Common'
	template_dir = 'common/templates'

	def ready(self):
		pass