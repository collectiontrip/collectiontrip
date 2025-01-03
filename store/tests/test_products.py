import pytest
from rest_framework import status
from rest_framework.test import APIClient

@pytest.mark.django_db

class TestCreateProducts:
    
    def test_if_user_anonymous_returns_401(self):
        
        client = APIClient()
        response = client.post('/store/products/', {'title': 'a'})
        
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED



