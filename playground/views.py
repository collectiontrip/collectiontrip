from django.core.cache import cache
from django.shortcuts import render
import requests
import logging


logger = logging.getLogger(__name__)

def say_hello(request):
   def get(self, request):
      try:
         logger.info('Calling httpbin')
         response = requests.get('https://httpbin.org')
         logger.info('Received the response')
         data = response.json()
      except request.ConnectionError:
         logger.critical('httpbin is offline')
   return render(request, 'hello.html', {'name': 'Ravi dochania'})
