from flask import Flask, jsonify,request
from flask_marshmallow import Marshmallow
import requests
import itertools
from flask_cors import CORS
from flask import Response
import threading
lock = threading.Lock()

#Config
app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True
ma = Marshmallow(app)



#Class/Model
class Websites:
    registered_addresses = []
    checked_addresses =[]
    newid = itertools.count()

    def __init__(self, address,status=None):
        self.address = address
        self.status = status
        self.id = next(self.newid)
    

    @classmethod
    def register_a_website(cls,address,status=None):
        site = cls(address,status)
        if site not in cls.registered_addresses:
            cls.registered_addresses.append(site)

    @classmethod
    def check_status(cls):
        with lock:
            websites = []
            if cls.registered_addresses:
                for site in cls.registered_addresses:
                    try:
                        r = requests.get(site.address, timeout=5)
                        if r.elapsed.total_seconds() >= 0.25:
                            site.setStatus('SLOW')
                        else:
                            site.setStatus('OK')
                        websites.append(site)
                    except requests.exceptions.RequestException as e:
                        site.setStatus('DOWN')
                        websites.append(site)
                        continue
            cls.checked_addresses = list(set(websites))

    def setStatus(self,status):
        self.status = status
    
    @staticmethod
    def set_interval(func, sec):
        def func_wrapper():
            set_interval(func, sec)
            func()
        t = threading.Timer(sec, func_wrapper)
        t.start()
        return t

    def __str__(self):
        return f'({self.address},{self.status})'
    
    def __hash__(self):
        hash_value = hash(self.address)
        return hash_value

    def __eq__(self, other):
        return isinstance(other, Websites) and self.address == other.address

   



# Create ma schema
class WebsitesSchema(ma.Schema):
    class Meta:
        fields = ('address','status')
#Initialize schema
websites_schema = WebsitesSchema(many=True)




#Get all monitored websites
@app.route('/api/website', methods=['GET'])
def get_list():
    Websites.check_status()
    result = websites_schema.jsonify(Websites.checked_addresses)
    result.status_code = 200
    return result

#add websites to the list of monitored websites
@app.route('/api/website', methods=['POST'])
def register_website():
    title = request.json['title']
    Websites.register_a_website(address=title)
    Websites.check_status()
    result = websites_schema.jsonify(Websites.checked_addresses)
    result.status_code= 201
    return result
    

#remove a website from the list of monitored websites
@app.route('/api/website/delete', methods=['POST'])
def delete_website():
    address = request.json['title']
    website = Websites(address)
    if website in Websites.registered_addresses:
        Websites.registered_addresses.remove(website)
        status_code = Response(status=201)
        return status_code
    status_code = Response(status=404)
    return status_code
    

# Run App
if __name__ == '__main__':
    app.run(debug=True)
    #Update monitored websites list at 20 secs interval
    Websites.set_interval(Websites.check_status,20)

