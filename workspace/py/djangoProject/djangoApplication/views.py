from .lib.helpers.ResponseHelper import ResponseHelper

def helloWorldJson(request):
  jsonObject = {
    "message": "Hello World!!!"
  }
  return ResponseHelper.toJsonResponse(jsonObject)
