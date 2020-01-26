import json
import re

from hashlib import sha256
from django.forms import forms
from django.conf import settings
from django.utils import timezone
from django.db.models import FileField
from django.db import models, connection
from django.template.defaultfilters import slugify
from django.utils.translation import ugettext_lazy as _
from django.template.defaultfilters import filesizeformat
from django.core.serializers.json import DjangoJSONEncoder


def upload_to(inst, fname):
	f = sha256((fname + str(timezone.now())).encode('utf-8')).hexdigest()
	f += fname

	path = '/'.join([inst.__class__.__name__, f])

	print('Path for upload, for {0} --> {1}'.format(inst.__class__.__name__, path))
	
	return path



class ContentTypeRestrictedFileField(FileField):
	"""
	Same as FileField, but you can specify:
		* content_types - list containing allowed content_types. Example: ['application/pdf', 'image/jpeg']
		* max_upload_size - a number indicating the maximum file size allowed for upload.
			2.5MB - 2621440
			5MB - 5242880
			10MB - 10485760
			20MB - 20971520
			50MB - 52428800
			100MB 104857600
			250MB - 214958080
			500MB - 429916160
	"""
	def __init__(self, *args, **kwargs):
		self.max_upload_size = kwargs.pop("max_upload_size", 52428800)
		super(ContentTypeRestrictedFileField, self).__init__(*args, **kwargs)

	def clean(self, *args, **kwargs):
		data = super(ContentTypeRestrictedFileField, self).clean(*args, **kwargs)

		file = data.file
		try:
			if file._size > self.max_upload_size:
				raise forms.ValidationError(_('Please keep filesize under %s. Current filesize %s') % (filesizeformat(self.max_upload_size), filesizeformat(file._size)))
		except AttributeError:
			pass

		return data



def unique_slugify(instance, value, slug_field_name='slug', queryset=None,
				   slug_separator='-'):
	"""
	Calculates and stores a unique slug of ``value`` for an instance.

	``slug_field_name`` should be a string matching the name of the field to
	store the slug in (and the field to check against for uniqueness).

	``queryset`` usually doesn't need to be explicitly provided - it'll default
	to using the ``.all()`` queryset from the model's default manager.
	"""
	slug_field = instance._meta.get_field(slug_field_name)

	slug = getattr(instance, slug_field.attname)
	slug_len = slug_field.max_length

	slug = slugify(value)
	if slug_len:
		slug = slug[:slug_len]
	slug = _slug_strip(slug, slug_separator)
	original_slug = slug

	if queryset is None:
		queryset = instance.__class__._default_manager.all()
	if instance.pk:
		queryset = queryset.exclude(pk=instance.pk)

	next = 2
	while not slug or queryset.filter(**{slug_field_name: slug}):
		slug = original_slug
		end = '%s%s' % (slug_separator, next)
		if slug_len and len(slug) + len(end) > slug_len:
			slug = slug[:slug_len-len(end)]
			slug = _slug_strip(slug, slug_separator)
		slug = '%s%s' % (slug, end)
		next += 1

	setattr(instance, slug_field.attname, slug)


def _slug_strip(value, separator='-'):
	"""
	Cleans up a slug by removing slug separator characters that occur at the
	beginning or end of a slug.

	If an alternate separator is used, it will also replace any instances of
	the default '-' separator with the new separator.
	"""
	separator = separator or ''
	if separator == '-' or not separator:
		re_sep = '-'
	else:
		re_sep = '(?:-|%s)' % re.escape(separator)

	if separator != re_sep:
		value = re.sub('%s+' % re_sep, separator, value)

	if separator:
		if separator != '-':
			re_sep = re.escape(separator)
		value = re.sub(r'^%s+|%s+$' % (re_sep, re_sep), '', value)
	return value