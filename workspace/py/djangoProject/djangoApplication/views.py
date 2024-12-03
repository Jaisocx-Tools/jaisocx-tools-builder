from .lib.helpers.ResponseHelper import ResponseHelper
from django.http import HttpResponse

def helloWorldJson(request):
  jsonObject = {
    "Greetings": "Hello World!!!"
  }
  return ResponseHelper.toJsonResponse(jsonObject)
