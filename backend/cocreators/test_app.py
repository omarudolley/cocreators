from .app import app,Websites
from flask import  json
import pytest


    
@pytest.fixture
def client():
    app.config["TESTING"] = True
    yield app.test_client()



class TestWebMonitorCollection():

    RESOURCE_URL = "/api/website"

    def test_website_class(self):
        website = Websites('https://goal.com','DOWN')
        assert website.address == 'https://goal.com'
        assert website.status == 'DOWN'
        assert website.id == 0

    def test_posting_website(self, client):
        resp= client.post(self.RESOURCE_URL, json={'title':'https://example.com'})
        json_data = resp.get_json()
        assert len(json_data) == 1
        assert  json_data[0]['address'] == 'https://example.com'
        assert 'status' in json_data[0]
        assert resp.status_code == 201

    
    def test_get_website_listing(self, client):
        resp = client.get(self.RESOURCE_URL)
        json_data = resp.get_json()
        assert resp.status_code == 200
        assert len(json_data) == 1
        assert len(Websites.registered_addresses) == 1
        assert len(Websites.checked_addresses) == 1
        

    def test_deleting_website(self,client):
        resp= client.post(self.RESOURCE_URL+'/delete', json={'title':'https://example.com'})
        assert resp.status_code == 201
        assert len(Websites.registered_addresses) == 0

        resp= client.post(self.RESOURCE_URL+'/delete', json={'title':'https://does_not_exist.com'})
        assert resp.status_code == 404
    
        
