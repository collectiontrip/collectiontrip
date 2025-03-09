import os
from .common import *
from .common import BASE_DIR


DEBUG = False
SECRET_KEY = os.environ['SECRET_KEY']
#9^!)q2#9bj&x8ya1_597*x+&v#n(xd7phvk5x#ul&8oa#ic_x$

ALLOWED_HOSTS = [os.environ['WEBSITE_HOSTNAME']]
CSRF_TRUSTED_ORIGINS = ['https://'+os.environ['WEBSITE_HOSTNAME']]

CONNECTIONS = os.environ['AZURE_MYSQL_CONNECTIONSTRING']
CONNECTION_STR = {pair.split('=')[0]:pair.split('=')[1] for pair in CONNECTIONS.split(' ')}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': CONNECTION_STR['dbname'],
        'HOST': CONNECTION_STR['host'],
        'USER': CONNECTION_STR['user'],
        'PASSWORD': CONNECTION_STR['password'],
        
        'OPTIONS': {
            'charset': 'utf8mb4',
        },
    }
}

STATIC_ROOT = BASE_DIR/'static'