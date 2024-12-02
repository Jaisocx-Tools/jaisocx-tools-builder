from django.http import HttpResponse
from .JsonHelper import JsonHelper

class ResponseHelper:
    @staticmethod
    def toJsonResponse(jsonObject):
        response = HttpResponse(
            JsonHelper.toString(jsonObject)
        )
        response.headers.pop("Content-Type", "application/json")
        return response

