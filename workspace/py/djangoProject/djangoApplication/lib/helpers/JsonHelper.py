import json

class JsonHelper:
    @staticmethod
    def toString(jsonObject):
        jsonString = json.dumps(jsonObject, indent=2)
        return jsonString
