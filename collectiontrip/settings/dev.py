from .common import *

DEBUG = True

SECRET_KEY = 'django-insecure-0%&w+sj6pcw=6a%fh^$pt1_kw(pj1!e^at9=$40-#0-^os+o@1'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'collectiontrip3',
        'USER': 'root',
        'HOST': '127.0.0.1',
        'PASSWORD': 'Ravidoc1@1$',
        'PORT': '3306',
        'OPTIONS': {
            'charset': 'utf8mb4',
        },
    }
}

TWILIO_ACCOUNT_SID = "ACaae3e97351f066031fdfc5dc48cdb661"
TWILIO_AUTH_TOKEN = "2466d63b79c419a15e593f6e7a5b2d13"
TWILIO_PHONE_NUMBER = "+15733754020"





