from django.db import models
from tenant_schemas.models import TenantMixin
from meeting.common.utils import *



class Tenant(TenantMixin):
	
	name 				= models.CharField(max_length=128)
	slug 				= models.CharField(max_length=128)
	paid_until 			= models.DateField()
	on_trial 			= models.BooleanField(default=True)
	created_on 			= models.DateField(auto_now_add=True)
	logo 				= ContentTypeRestrictedFileField(upload_to=upload_to,
							max_length=512, null=True, blank=True)
	testing_email 		= models.CharField(max_length=255, 
							null=True, blank=True)
	activate_emails 	= models.BooleanField(default=False)
	testing_mode 		= models.BooleanField(default=False)
	setup_completed 	= models.BooleanField(default=False)
	auto_create_schema 	= True
	auto_drop_schema 	= True

	def __str__(self):
		return self.name

	def save(self, *args, **kwargs):
		unique_slugify(self, self.name)
		super(Tenant, self).save(*args, **kwargs)