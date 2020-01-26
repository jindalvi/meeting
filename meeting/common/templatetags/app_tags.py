import re

from django import template

from meeting.common.models import *

register = template.Library()

@register.filter
def qs_to_css(qs, key):

	css = list()

	if qs or len(qs):
		for item in qs:
			css.append(str(item.__dict__.get(key)))

		return ', '.join(css)
	else:
		return 'None'


@register.filter
def qs_to_css_stripped(qs, key):

	css = list()

	if qs or len(qs):
		for item in qs:
			css.append(str(item.__dict__.get(key)))

		return ','.join(css)
	else:
		return 'None'


@register.filter
def firstcharacter(string):
	return string[0]


@register.filter
def is_role_deleteable(role):
	if EmployeeRole.objects.filter(role=role).exists():
		return False
	else:
		return True


@register.filter
def is_allowed(employee, permission_code):

	try:

		roles = employee.employeemetadata.roles
		employee_groups = employee.employeemetadata.groups.all()

		permission_groups = set([y for x in roles for y in x.permission_groups.all()] + [y for x in employee_groups for y in x.permission_groups.all()])
		module_permission = Permission.objects.get(permission_code=permission_code)
		containing_groups = set([x for x in PermissionGroup.objects.filter(permissions=module_permission)])

		if permission_groups.intersection(containing_groups):
			return True

		else:
			return False
	except Exception as e:
		return False


@register.filter
def float_to_percent(value):
	
	if type(value) == float:
		return '{:.2f}'.format(round((value * 100), 2))
	else:
		return 0.0


@register.filter
def absolute_value(value, precision=2):
	try:
		float(value)
		return format(value, '.{0}f'.format(precision))
	except Exception as e:
		return value


@register.filter
def subtract(x, y):

	try:

		x = float(x)
		y = float(y)

		result = x - y

		if result.is_integer():
			result = int(result)

		return result
	except Exception as e:
		return x



@register.filter
def add(x, y):
	try:
		x = float(x)
		y = float(y)

		result = x + y

		if result.is_integer():
			result = int(result)

		return result
	except Exception as e:
		return x


@register.filter
def is_future_date(value):

	today = timezone.now().date()

	if value > today:
		return True

	return False


@register.filter
def is_date_from_current_month_year(value):

	today = timezone.now().date()

	if value.month < today.month or value.month > today.month:
		return False

	return True


@register.filter
def previous_year(value):
	try:
		print(type(value))
		return int(value) - 1
	except Exception as e:
		return value


@register.filter
def next_year(value):
	try:
		print(type(value))
		return int(value) + 1
	except Exception as e:
		return value


@register.filter
def dictionary_has_key(dictionary, key):

	if dictionary:
		if dictionary.get(key, None):
			return True

		return False
	else:
		return False



@register.filter
def value_from_dictionary(dictionary, key):

	if dictionary:
		return dictionary.get(key, None)

	return None